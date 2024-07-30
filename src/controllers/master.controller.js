const SERVICES = require('../services/master.service');
const { HELPER } = require('../helpers');
const { refreshServerCache, updateServerCache } = require('../utils/cache.utils');
const { deleteItemCached, updateItemCached, addItemCached, addMultipleItemCached } = require('../utils/redis.cache');

exports.SEARCH= async (req, res, next) => {
    try {
        const { body } = req;
        const response = await SERVICES.search(body);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

exports.ADD = async (req, res, next) => {
    try {
        const response = await SERVICES.addMasterData(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }else{
            updateServerCache(async()=>await addItemCached(response.data));
        }
        
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}

exports.EDIT = async (req, res, next) => {
    try {
        const response = await SERVICES.editMasterData(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse( res, response.code, response.message, response.data);
        }else{
            updateServerCache(async()=>await updateItemCached(response.data, req.body.id));
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}


// for DELETE
exports.DELETE = async (req, res, next) => {
    try {
        const response = await SERVICES.DELETEMASTERDATA(req.body);
        if (!response.success) {
            return HELPER.errorResponse(res, response.code, response.message, response.data);
        }else{
            updateServerCache(async()=>await deleteItemCached(req.body.id));
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
};

// for bulk insert
exports.BULKINSERT = async (req, res, next) => {
    try {
        const response = await SERVICES.BULKINSERTMASTERDATA(req.body, req.user);
        if (!response.success) {
            return HELPER.errorResponse(res, response.code, response.message, response.data);
        }
        else if(response?.data?.unique > 0){
            updateServerCache(async()=>await addMultipleItemCached(response?.data?.inserted_data));           
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
    } catch (error) {
        next(error);
    }
}
exports.FETCHALLCATEGORY = async (req,res, next)=>{
    try{
        const response = await SERVICES.FETCHALLCATEGORY();
        if (!response.success) {
            return HELPER.errorResponse(res, response.code, response.message, response.data);
        }
        return HELPER.successResponse(res, response.code, response.message, response.data);
        } catch (error) {
            next(error);
        }
}