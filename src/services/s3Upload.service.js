const path = require('path');
const fs = require('fs');

const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../config');
const { HELPER } = require('../helpers');
const db = require('../models/index');
const { awsUtils } = require('../utils');
const { convertToBase64, urlToBase64 } = require('../utils/file.utils');
const {
    getFamilyDetails,
    parseDataFromPrescriptionPDF,
    getProblemList,
    getProcedureSurgicalHistory,
    getFamilyHistory,
    getHomeMedication,
    getPhysicalExam,
} = require('../utils/pdfreader.utils');
const { minisearchArr } = require('../utils/mini-search');
const { filterdiagnosisData } = require('../utils/filter.utils');

exports.uploadFile = async (file, payload, user) => {
    let s3UploadObj = {};
    if (!file) {
        throw new HELPER.BadRequestException(MESSAGES.ERROR.UPLOAD.FILE_IS_MISSING);
    }
    if (!payload.category_type) {
        throw new HELPER.BadRequestException(MESSAGES.ERROR.UPLOAD.CATEGORY_TYPE_IS_MISSING);
    }
    const base64url = `data:${file.mimetype};base64,` + convertToBase64(file.path);
    if (base64url && base64url.length > 0) {
        // s3 upload
        const resultS3Upload = await awsUtils.uploadBase64File(base64url, user.id, file.mimetype);
        if (!resultS3Upload) throw new HELPER.BadRequestException(MESSAGES.ERROR.UPLOAD.SOMETHING_WENT_WRONG);

        // Store upload information into table
        const s3Obj = {
            file_name: file.originalname,
            file_size: file.size,
            file_type: file.mimetype,
            data_url: resultS3Upload.Location,
            e_tag: resultS3Upload.ETag,
            created_by: user.id,
            category_type: payload.category_type,
        };
        const resultS3 = await db.S3UploadModel.create(s3Obj);
        if (!resultS3) throw new HELPER.BadRequestException(MESSAGES.INTERNAL_SERVER_ERROR);

        s3UploadObj = await db.S3UploadModel.findOne({ attributes: { exclude: ['is_deleted', 'deleted_at'] }, where: { id: resultS3.id } });

        const filePath = path.resolve(__dirname, '..//..//dist//uploads//', file.filename);
        fs.unlinkSync(filePath);

        return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.FILE_UPLOADED_SUCCESSFULLY, {
            upload_result: s3UploadObj,
        });
    } else throw new HELPER.BadRequestException(MESSAGES.ERROR.UPLOAD.FILE_IS_MISSING);
};

exports.prescriptionDetails = async (payload) => {
    const s3FetchObj = await db.S3UploadModel.findOne({
        attributes: { exclude: ['is_deleted', 'deleted_at'] },
        where: { id: payload.id, category_type: 'prescription' },
    });

    if (!s3FetchObj) throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);

    const base64String = await urlToBase64(s3FetchObj.data_url);

    if (!base64String) throw new HELPER.BadRequestException(MESSAGES.ERROR.FETCH.RECORDS);

    const dataLines = await parseDataFromPrescriptionPDF(base64String);

    const patient_details = getFamilyDetails(dataLines);
    const pdfDiseaseData = getProblemList(dataLines, patient_details.name);
    const surgical_history = getProcedureSurgicalHistory(dataLines, patient_details.name);
    const family_history = getFamilyHistory(dataLines, patient_details.name);
    const home_medications = getHomeMedication(dataLines, patient_details.name);
    const physical_exam = getPhysicalExam(dataLines, patient_details.name);

    const prescription_details = { patient_details, surgical_history, family_history, home_medications, physical_exam };
    //mini-search
    let parse_result = [];
    pdfDiseaseData.forEach((query) => {
        const result = minisearchArr.search(query).map((item) => {
            delete item.score;
            delete item.terms;
            delete item.queryTerms;
            delete item.match;
            Object.keys(item).forEach((key) => {
                if (!item[key]) {
                    delete item[key];
                }
            });
            return item;
        });

        parse_result.push({ disease_name: query, total_count: result.length });
    });


    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.FILE_FETCHED_SUCCESSFULLY, {
        file_id: payload.id,
        file_url: s3FetchObj.data_url,
        prescription_details,
        parse_result,
    });
};

exports.uploadHistory = async (payload) => {
    const row = payload.row || 10;
    const page = payload.page || 1;
    const { count: total_count, rows: s3UploadList } = await db.S3UploadModel.findAndCountAll({
        attributes: { exclude: ['is_deleted', 'deleted_at'] },
        where: { is_deleted: false, category_type: 'prescription', created_by: payload.id },
        offset: (page - 1) * row,
        limit: row,
        order: [['created_at', 'DESC']], 
    });
    const totalPages = Math.ceil(total_count / row);
    const responseData = {
        total_data_count: total_count,
        total_page_number: totalPages,
        has_next_page: page < totalPages,
        has_previous_page: page > 1,
        page_number: page,
        data_count: s3UploadList.length,
        upload_list: s3UploadList,
    };

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.GET_RECORD_SUCCESS('Prescription'), responseData);
};

exports.fetchFilterDiseases= async(payload)=>{
    let parseResult = payload.parse_result;
    let disease_names = parseResult.map(result => result.disease_name);
    let filter = payload.filter;
    // mini-search
    let parse_result = [];
    disease_names.forEach((query) => {
        let result = filterdiagnosisData(query,filter);
        if(result !== null){
            parse_result.push({ disease_name: query, total_count: result.length });
        }
    });

    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.FILE_FETCHED_SUCCESSFULLY, {
        parse_result,
        current_filter: payload.filter,
    });
}