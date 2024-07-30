exports.MDWR = {
    ...require('./authorisation'),
    ...require('./upload.files'),
    validationMiddleware: require('./validation')
};
