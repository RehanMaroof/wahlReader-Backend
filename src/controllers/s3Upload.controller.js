const SERVICES = require('../services/s3Upload.service');
const { HELPER } = require('../helpers');
const { refreshServerCache } = require('../utils/cache.utils');


exports.fetchPrescription = async (req, res, next) => {
    try {
        const response = await SERVICES.fetchPrescription(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.uploadFile = async (req, res, next) => {
    try {
        const response = await SERVICES.uploadFile(req.file, req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.prescriptionDetails = async (req, res, next) => {
    try {
        const response = await SERVICES.prescriptionDetails(req.body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.uploadHistory = async (req, res, next) => {
    try {
        let payload = {...req.body, ...req.user};
        const response = await SERVICES.uploadHistory(payload);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.fetchFilterDiseases = async (req, res, next) => {
    try {
        const response = await SERVICES.fetchFilterDiseases(req.body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}