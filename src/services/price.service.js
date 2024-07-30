const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../config');
const { HELPER } = require('../helpers');
const db = require('../models/index');

exports.GETPRICE = async(payload) =>{
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.CREATED, payload);
}