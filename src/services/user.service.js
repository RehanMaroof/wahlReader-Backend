const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../config');
const { HELPER } = require('../helpers');
const { jwt, bcrypt } = require('../utils');
const db = require('../models/index');
const { awsSESSender } = require('../utils/aws.utils');

exports.LOGIN = async (payload) => {
    payload.email = payload.email.toLowerCase();
    const user = await db.UserModel.findOne({ where: { email: payload.email, 
        // status: true, user_type: '1' 
    } });

    if (!user) throw new HELPER.BadRequestException(MESSAGES.ERROR.LOGIN.USERNAME);

    const isMatch = await bcrypt.verifyPassword(payload.password, user.password);
    if (!isMatch) throw new HELPER.BadRequestException(MESSAGES.ERROR.LOGIN.WRONG_PASS);

    const accessToken = jwt.generateAccessToken({
        id: user.id,
        email: user.email
    });

    const refreshToken = jwt.generateRefreshToken({
        id: user.id,
        email: user.email
    });

    const user_details = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at,
        // "first_name": user.first_name,
        // "last_name": user.last_name,
        // "phone_number": user.phone_number,
        // "dial_code": user.dial_code,
        // "country_code": user.country_code,
        // "profile_image": user.profile_image,
        // "is_verified": user.is_verified,
    };

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.LOGIN_SUCCESS, {
        user_details,
        access_token:accessToken,
        refresh_token: refreshToken,
    });
};

exports.REGISTER = async (payload) => {
    payload.email = payload.email.toLowerCase();
    const user = await db.UserModel.findOne({ where: { email: payload.email } });

    if (user) throw new HELPER.BadRequestException(MESSAGES.ERROR.LOGIN.EMAIL_ALREADY_EXISTS);
    const hashedPassword = await bcrypt.generatePassword(payload.password);

    payload.password = hashedPassword;
    payload.created_at = new Date();

    const newUser = await db.UserModel.create(payload);

    delete newUser.password;
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.REGISTER_USER, newUser);
}

exports.REFRESH = async (payload) => {
    const user = await db.UserModel.findOne({ where: { email: payload.email } });
    if (!user) throw new HELPER.UnauthorizedException(MESSAGES.UNAUTHORIZED);

    const accessToken = jwt.generateAccessToken({
        id: user.id,
        email: user.email
    })
    const refreshToken = jwt.generateRefreshToken({
        id: user.id,
        email: user.email
    });
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.SUCCESS_REFRESH_TOKEN, {
        refresh_token: refreshToken,
        access_token: accessToken,
    });
}

exports.FORGOTPASSWORD = async (payload) => {
    try{
        payload.email = payload.email.toLowerCase();
        const user = await db.UserModel.findOne({ where: { email: payload.email } });
        if (!user) throw new HELPER.BadRequestException(MESSAGES.ERROR.LOGIN.USERNAME);
    
        const otp = Math.floor(100000 + Math.random() * 900000);
        user.otp = otp;
        user.save();
    
        const message = `${payload.email} Your OTP is ${otp}.`;
        console.log("message", message);
        
        const result = await awsSESSender(payload.email);

        if(!result){
            throw new HELPER.BadRequestException(MESSAGES.ERROR.SEND_EMAIL.SOMETHING_WENT_WRONG);
        }

        return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.SEND_OTP_EMAIL, null);
    }catch(err){
        throw new HELPER.BadRequestException(err.message);
    } 
}

exports.RESETPASSWORD = async (payload) => {
    payload.email = payload.email.toLowerCase();
    const user = await db.UserModel.findOne({ where: { email: payload.email } });
    if (!user) throw new HELPER.BadRequestException(MESSAGES.ERROR.LOGIN.USERNAME);

    if(user.otp != payload.otp) throw new HELPER.BadRequestException(MESSAGES.ERROR.OTP.WRONG_OTP);

    if(payload.password !== payload.confirm_password) throw new HELPER.BadRequestException(MESSAGES.ERROR.OTP.PASSWORD_NOT_MATCH);

    const hashedPassword = await bcrypt.generatePassword(payload.password);
    payload.password = hashedPassword;

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.REGISTER_USER, user);
}

