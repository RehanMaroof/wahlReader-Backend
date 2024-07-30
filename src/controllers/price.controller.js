const SERVICES = require('../services/price.service');
const { HELPER } = require('../helpers');

exports.GETPRICE = async (req, res) => {
    try {
        const response = await SERVICES.GETPRICE(req.body);;
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}