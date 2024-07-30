const SERVICES = require('../services/report.service');
const { HELPER } = require('../helpers');

exports.FETCHLIST = async (req, res, next) => {
    try {
        const response = await SERVICES.FETCHLIST(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.SAVEREPORTDATA = async (req,res,next) =>{
    try {
        const response = await SERVICES.SAVEREPORTDATA(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.VIEWREPORTDATA = async (req,res,next) =>{
    try {
        const response = await SERVICES.VIEWREPORTDATA(req.body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.UPDATEREPORTDATA = async (req,res,next) =>{
    try {
        const response = await SERVICES.UPDATEREPORTDATA(req.body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.DELETEREPORTDATA = async (req,res,next) =>{
    try {
        const response = await SERVICES.DELETEREPORTDATA(req.body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}