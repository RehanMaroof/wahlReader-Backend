const { HTTP_CODES, CONSTANTS, MESSAGES } = require('../config');

exports.routeHandler = async (req, res) => {
    res.status(HTTP_CODES.NOT_FOUND || 500).json({
        success: false,
        code: HTTP_CODES.NOT_FOUND || 500,
        message: MESSAGES.ROUTE_NOT_FOUND,
        data: {},
    });
};
