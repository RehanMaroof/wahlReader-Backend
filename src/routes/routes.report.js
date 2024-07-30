const express = require('express');
const reportController = require('../controllers/report.controller');
const { MDWR } = require('../middlewares');
const { SCHEMA } = require('../validators/validation');

const reportRoutes = express.Router();


reportRoutes.post('/v1/fetch-list', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.REPORTFETCH), reportController.FETCHLIST);

reportRoutes.post('/v1/save-report-data', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.SAVEREPORTDATA), reportController.SAVEREPORTDATA);

reportRoutes.post('/v1/get-report-data', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.WITHONLYID), reportController.VIEWREPORTDATA);

// reportRoutes.post('/v1/update-report-data', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.UPDATEREPORTDATA),reportController.UPDATEREPORTDATA);

reportRoutes.post('/v1/delete-report-data', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.WITHONLYID), reportController.DELETEREPORTDATA);

module.exports = reportRoutes;