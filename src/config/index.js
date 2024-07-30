const constants = require('./constants');
const messages = require('./messages');
const httpCodes = require('./httpCodes');

module.exports = {
    CONSTANTS: constants,
    MESSAGES: messages,
    HTTP_CODES: httpCodes,
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'secret_key',
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'secret_key',
        ACCESS_TOKEN_TIME: process.env.ACCESS_TOKEN_TIME || '1d',
        REFRESH_TOKEN_TIME: process.env.REFRESH_TOKEN_TIME || '7d',
    },
};
