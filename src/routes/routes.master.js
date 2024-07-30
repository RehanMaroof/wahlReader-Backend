const express = require('express');
const masterController = require('../controllers/master.controller');

const { MDWR } = require('../middlewares');
const { SCHEMA } = require('../validators/validation');

const masterRoutes = express.Router();

masterRoutes.post('/v1/search-disease', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.SEARCH), masterController.SEARCH);

masterRoutes.post('/v1/master-add', MDWR.validateAccessToken(),MDWR.validationMiddleware(SCHEMA.ADDMASTERDATA), masterController.ADD);

masterRoutes.post('/v1/master-edit', MDWR.validateAccessToken(),  MDWR.validationMiddleware(SCHEMA.UPDATEMASTERDATA), masterController.EDIT);

masterRoutes.delete('/v1/master-delete', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.WITHONLYID), masterController.DELETE);

masterRoutes.post('/v1/scan-input-file', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.WITHIDANDTYPE), masterController.BULKINSERT);

masterRoutes.get('/v1/fetch-category-list', MDWR.validateAccessToken(), masterController.FETCHALLCATEGORY);

module.exports = masterRoutes