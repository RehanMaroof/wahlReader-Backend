const { JWT } = require('../config');
const { HELPER } = require('../helpers');
const jwt = require('jsonwebtoken');

exports.verifyAccessToken = (token) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new HELPER.BadRequestException('Invalid Token');
            resolve(decoded);
        });
    });
};

exports.verifyRefreshToken = (token) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) throw new HELPER.BadRequestException('Invalid Token');
            resolve(decoded);
        });
    });
};

exports.generateAccessToken = (payload) => {
    return jwt.sign({ ...payload }, JWT.ACCESS_TOKEN_SECRET, {
        expiresIn: JWT.ACCESS_TOKEN_TIME,
    });
};

exports.generateRefreshToken = (payload) => {
    return jwt.sign({ ...payload }, JWT.REFRESH_TOKEN_SECRET, {
        expiresIn: JWT.REFRESH_TOKEN_TIME,
    });
};
