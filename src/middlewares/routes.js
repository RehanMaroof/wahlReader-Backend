const express = require('express');
const CONTROLLER = require('./controller');
const { MDWR } = require('../../middlewares');
const { SCHEMA } = require('./validation');
const { CONSTANTS } = require('../../config');

const router = express.Router();

router.post('/register', MDWR.validationMiddleware(SCHEMA.SIGNUP), CONTROLLER.REGISTER);

router.post('/login', MDWR.validationMiddleware(SCHEMA.LOGIN), CONTROLLER.LOGIN);

router.get('/profile', MDWR.validateAccessToken(CONSTANTS.USER.ROLES.USER), CONTROLLER.VIEW);

router.patch('/update', MDWR.validateAccessToken(CONSTANTS.USER.ROLES.USER), MDWR.validationMiddleware(SCHEMA.UPDATE), CONTROLLER.UPDATE);

router.delete('/delete', MDWR.validateAccessToken(CONSTANTS.USER.ROLES.USER), CONTROLLER.DELETE);

module.exports = router;
