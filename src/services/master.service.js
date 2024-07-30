const sequelize = require('sequelize');

const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../config');
const { HELPER } = require('../helpers');
const { minisearchArr } = require('../utils/mini-search');
const db = require('../models/index');
const { urlToBase64 } = require('../utils/file.utils');
const {  readCSVFile } = require('../utils/csvReader.utils');
const { fileUtils } = require('../utils');
const { filterdiagnosisData, } = require('../utils/filter.utils');


exports.search = async (payload) => {
    const query= payload.query;
    const filter = payload?.filter;
    // validate query
    if (!query) {
        throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);
    }
    let result = filterdiagnosisData(query,filter);
    const response = { query: query, count: result.length, result: result };
    if (result.length == 0) {
        return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.NO_RECORD_FOUND('Master Data Table'), response);
    }
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.GET_RECORD_SUCCESS('Master Data'), response);
};

exports.editMasterData = async (payload, user) => {
    const current = await db.MasterModel.findOne({ where: { id: payload.id } });

    if (!current) throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);

    const editdata = {
        main_category: payload.main_category ? payload.main_category : undefined,
        icd_code: payload.icd_code ? payload.icd_code : undefined,
        icd_description: payload.icd_description ? payload.icd_description : undefined,
        rxcc_cc: payload.rxcc_cc ? payload.rxcc_cc : undefined,
        clinical_category: payload.clinical_category ? payload.clinical_category : undefined,
        main_category: payload.main_category ? payload.main_category : undefined,
        comorbidity_description: payload.comorbidity_description ? payload.comorbidity_description : undefined,
        impact_snf_care_plan: payload.impact_snf_care_plan ? payload.impact_snf_care_plan : undefined,
        preferred_code: payload.preferred_code ? payload.preferred_code : undefined,
        updated_by: user.id,
        updated_date: new Date(),
        status: payload.status ? payload.status : undefined,
    };

    Object.keys(editdata).forEach((key) => {
        if (!editdata[key]) {
            delete editdata[key];
        }
    });

    const result = await db.MasterModel.update({ ...current, ...editdata }, { where: { id: payload.id } });

    if (!result) throw new HELPER.BadRequestException('while updating master data data');
    const newdata = await db.MasterModel.findOne({ where: { id: payload.id } });
    if (!newdata) throw new HELPER.BadRequestException('while getting updated master data data');
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.EDIT_RECORD_SUCCESS('master data'), newdata);
};

exports.addMasterData = async (payload, user) => {
    const addeddata = {
        icd_code: payload.icd_code,
        icd_description: payload?.icd_description,
        rxcc_cc: payload?.rxcc_cc,
        main_category: payload.main_category,
        clinical_category: payload?.clinical_category,
        comorbidity_description: payload?.comorbidity_description,
        impact_snf_care_plan: payload?.impact_snf_care_plan,
        preferred_code: payload?.preferred_code,
        status: payload?.status,
    };
    // execute query for adding master data
    const result = await db.MasterModel.create({
        ...addeddata,
        created_by: user.id,
        created_date: new Date(),
    });
    if (!result) throw new HELPER.BadRequestException(MESSAGES.ERROR.ADD_RECORD_FAILURE('master data'));

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.ADD_RECORD_SUCCESS('master data'), result);
};

// for delete master data
exports.DELETEMASTERDATA = async (payload) => {
    //execute query for deleting master data
    const result = await db.MasterModel.destroy({ where: { id: payload.id } });
    if (!result) throw new HELPER.BadRequestException(MESSAGES.ERROR.DELETE.NOT_FOUND);

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.DELETE_SUCCESS, result);
};

// for bluk insert master data from csv
exports.BULKINSERTMASTERDATA = async (payload, user) => {
    const s3FetchObj = await db.S3UploadModel.findOne({
        attributes: { exclude: ['is_deleted', 'deleted_at'] },
        where: { id: payload.id, category_type: 'master' },
    });

    if (!s3FetchObj) throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);

    const base64String = await urlToBase64(s3FetchObj.data_url);
    if (!base64String) throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);

    // Convert base64 string to a buffer
    const base64Buffer = fileUtils.getFsBuffer(base64String);

    // Convert convert buffer to a stream that is readable
    const base64Stream = fileUtils.bufferToStream(base64Buffer);

    // get fetched json data from the csv file
    const jsonData = await readCSVFile(base64Stream);
 
    // condition for bulk insert check for duplicate if icd_code matches
    const duplicate = await db.MasterModel.findAll({
        where: {
            [sequelize.Op.and]: [
                { icd_code: { [sequelize.Op.in]: jsonData.map((row) => row.icd_code) } },
                { main_category: { [sequelize.Op.in]: jsonData.map((row) => row.main_category) } }
            ]
        }
    });

    // remove all duplicate icd_code and main_category
    const uniqueData = jsonData.filter((obj) => !duplicate.some((item) => item.icd_code === obj.icd_code && item.main_category === obj.main_category));

    const insertData = uniqueData.map((obj) => ({
        ...obj,
        status: 1,
        preferred_code: 0,
        created_by: user.id,
        created_date: new Date(),
    }));

    const result = await db.MasterModel.bulkCreate(insertData, { returning: ['id'] });

    if (!result) throw new HELPER.BadRequestException(MESSAGES.ADD_RECORD_FAILURE('master data in insert bulk'));

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.ADD_RECORD_SUCCESS('master data in insert bulk'), {
        duplicate: duplicate.length,
        unique: uniqueData.length,
        inserted_data: result,
    });
};

exports.FETCHALLCATEGORY = async () =>{
    const main_category = await db.MasterModel.findAll({
        attributes: [
          'main_category',
          [sequelize.fn('COUNT', sequelize.col('main_category')), 'count']
        ],
        group: ['main_category']
      });
    const all_category = await db.MasterModel.findAll({
        attributes: ['clinical_category'],
        group: ['clinical_category'],
        order: [
            ['clinical_category', 'ASC']
        ],
      })
    const clinical_category_list = await db.MasterModel.findAll({
        attributes: [
          'main_category',
          'clinical_category',
        ],
        group: ['main_category', 'clinical_category'],
        order: [
            ['main_category', 'ASC'],
            ['clinical_category', 'ASC']
        ],
      });
    const categories = clinical_category_list.reduce((acc, item) => {
        if (!acc[item.main_category]) {
            acc[item.main_category] = [];
        }
        if (item.clinical_category) {
            acc[item.main_category].push(item.clinical_category.trim());
        }
        return acc;
    }, {});
    const clinical_category = Object.entries(categories).map(([main, clinical]) => ({
        main_category: main,
        clinical_category: clinical,
    })); 
    if (!main_category || !clinical_category) {
        return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.NO_RECORD_FOUND('Main Categories'),null);
    }
    clinical_category.push({ main_category: 'ALL', clinical_category: all_category.map(item => item.clinical_category) });

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.GET_RECORD_SUCCESS('Main Categories'),
        {   main_category,
            clinical_category
        });
}