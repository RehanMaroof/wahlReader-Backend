const { MESSAGES } = require('../config');
const db = require('../models/index');
const { UserModel } = require('../models/users.model');
const { UnauthorizedException } = require('../helpers/errorResponse');
const { jwt } = require('../utils');

module.exports = {
    validateAccessToken:
        (allowedRoles = []) =>
        async (req, res, next) => {
            try {
                if (!req.headers.authorization) throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.TOKEN_HEADER);

                const token = req.headers.authorization.split(' ')[1]; // Extracting Bearer token from header.

                if (!token) throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.TOKEN);

                const decoded = await jwt.verifyAccessToken(token);
                const user = await db.UserModel.findOne({
                    where: {
                        id: decoded.id,
                    }
                });
                
                if (!user) {
                    throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.UNAUTHORIZED);
                }

                if (user.isBlock) {
                    throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.BLOCKED);
                }

                // if (allowedRoles.includes(decoded.role)) {
                    req.user = decoded;
                    next();
                // } else {
                    // throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.UNAUTHORIZED);
                // }
            } catch (error) {
                next(error);
            }
        },
    validateRefreshToken:
        (allowedRoles = []) =>
        async (req, res, next) => {
            try {
                if (!req.headers.authorization) throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.TOKEN_HEADER);

                const token = req.headers.authorization.split(' ')[1]; // Extracting Bearer token from header.s
                if (!token) throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.TOKEN);
                const decoded = await jwt.verifyRefreshToken(token);

                // if (allowedRoles.includes(decoded.role)) {
                    req.user = decoded;
                    next();
                // } else {
                    // throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.UNAUTHORIZED);
                // }
            } catch (error) {
                next(error);
            }
        },

    isAuthenticated: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            throw new UnauthorizedException(MESSAGES.AUTH_ERRORS.UNAUTHORIZED);
        }

        // if (!req.isAuthenticated()) {
        //   throw new UnauthorizedException("Oops! Unauthorised access");
        // }
        // next();
    },
};
