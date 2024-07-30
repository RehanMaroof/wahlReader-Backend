const express = require('express');
const s3Controller = require('../controllers/s3Upload.controller');
const { MDWR } = require('../middlewares');
const { SCHEMA } = require('../validators/validation');
const multer = require('multer');
const upload = multer({ dest: 'dist/uploads/' })

const uploadsRoutes = express.Router();

uploadsRoutes.post('/v1/fetch-prescription', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.FETCHPRESCRIPTION) , s3Controller.fetchPrescription);

uploadsRoutes.post('/v1/upload-file', MDWR.validateAccessToken(), upload.single('file'), MDWR.validationMiddleware(SCHEMA.UPLOADFILE) , s3Controller.uploadFile);

uploadsRoutes.post('/v1/prescription-details', MDWR.validateAccessToken(), MDWR.validationMiddleware(SCHEMA.WITHONLYID) , s3Controller.prescriptionDetails);
uploadsRoutes.post('/v1/upload-history', MDWR.validateAccessToken(), s3Controller.uploadHistory);

uploadsRoutes.post('/v1/fetch-filter-diseases', MDWR.validateAccessToken() , s3Controller.fetchFilterDiseases);//MDWR.validationMiddleware(SCHEMA.FETCHFILTERDISEASES)

module.exports = uploadsRoutes;