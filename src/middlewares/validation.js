const { PreconditionException } = require('../helpers/errorResponse');

const options = {
    basic: {
        abortEarly: false,
        convert: true,
    },
    array: {
        abortEarly: false,
        convert: true,
    },
};

module.exports = (schema) => (req, res, next) => {
    Object.keys(schema).forEach((key) => {
        const { error } = schema[key].validate(req[key], options);
        if (error) {
            console.log(error);
            const message = error.details[0].message || 'Invalid Inputs';
            throw new PreconditionException(message);
        }
    });
    next();
};
