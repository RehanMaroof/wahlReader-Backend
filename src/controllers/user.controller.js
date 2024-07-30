const SERVICES = require('../services/user.service');
const { HELPER } = require('../helpers');

exports.LOGIN = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.LOGIN(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.REGISTER = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.REGISTER(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.REFRESH = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.REFRESH(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.FORGOTPASSWORD = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.FORGOTPASSWORD(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.RESETPASSWORD = async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.RESETPASSWORD(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}