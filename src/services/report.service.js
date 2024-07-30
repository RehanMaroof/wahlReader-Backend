const { HTTP_CODES, MESSAGES, CONSTANTS } = require('../config');
const { HELPER } = require('../helpers');
const db = require('../models/index');

exports.FETCHLIST = async (payload,user) => {
    const prescription_details = await db.S3UploadModel.findOne({
        attributes: { exclude: ['is_deleted', 'deleted_at'] },
        where: { id: payload.prescription_id, category_type: 'prescription' },
    })
    const { count: total_count, rows: report_list } = await db.ReportModel.findAndCountAll({
        attributes: { exclude: ['is_deleted', 'deleted_at','patient_object', 'prescription_id'] },
        where: { is_deleted: false, prescription_id: payload.prescription_id, created_by: user?.id },
        offset: (payload.page - 1) * payload.row,
        limit: payload.row,
        order: [['created_date', 'DESC']], 
    });
    const totalPages = Math.ceil(total_count / payload.row);
    const responseData = {
        prescription_details: prescription_details,
        total_data_count: total_count,
        total_page_number: totalPages,
        has_next_page: payload.page < totalPages,
        has_previous_page: payload.page > 1,
        page_number: payload.page,
        data_count: report_list.length,
        report_list: report_list,
    };
    if (!report_list) throw new HELPER.BadRequestException(MESSAGES.NO_RECORD_FOUND(("Reports List")));
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.GET_RECORD_SUCCESS("Reports List"),responseData);
}

exports.SAVEREPORTDATA = async (payload,user) => {    
    const reportData = {
        prescription_id: payload?.prescription_id,
        patient_name: payload?.patient_name,
        patient_id: payload?.patient_id,
        patient_object: payload?.patient_object,
        status: 1,
        created_date: new Date(),
        created_by: user?.id
    }
    const report = await db.ReportModel.create(reportData)
    if (!report) throw new HELPER.BadRequestException(MESSAGES.DATA_UPLOADED_FAILED);
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.DATA_UPLOADED_SUCCESSFULLY,{});
}

exports.VIEWREPORTDATA = async (payload) => {
    const report = await db.ReportModel.findOne({ where: { id: payload.id } })
    if (!report) throw new HELPER.BadRequestException(MESSAGES.DATA_FETCHED_ERROR);
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.DATA_FETCHED_SUCCESSFULLY, report);
}

exports.UPDATEREPORTDATA = async (payload) => {
    const reportData = await db.ReportModel.findOne({ where: { id: payload.id } })
    const reportUpdate = {
        prescription_id: payload.prescription_id ? payload.prescription_id : reportData.prescription_id,
        report_type: payload.report_type ? payload.report_type : reportData.report_type,
        report_date: payload.report_date ? payload.report_date : reportData.report_date,
        report_description: payload.report_description ? payload.report_description : reportData.report_description,
        report_status: payload.report_status ? payload.report_status : reportData.report_status,
    }
    const report = await db.ReportModel.update(reportUpdate, { where: { id: payload.id } })
    if (!report) throw new HELPER.BadRequestException(MESSAGES.ERROR.SAVE.RECORD);
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.REGISTER_USER, report);
}

exports.DELETEREPORTDATA = async (payload) => {
    const report = await db.ReportModel.destroy({ where: { id: payload.id } })
    if (!report) throw new HELPER.BadRequestException(MESSAGES.ERROR.SAVE.RECORD);
    return HELPER.serviceResponse(true, HTTP_CODES.OK, MESSAGES.REGISTER_USER, report);
}