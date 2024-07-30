const Joi = require('joi');

const SCHEMA = {
    SIGNUP: {
        body: Joi.object().keys({
            name: Joi.string().trim().required(),
            email: Joi.string().trim().email().trim().required(),
            password: Joi.string().trim().required(),
        }),
    },
    UPDATE: {
        body: Joi.object().keys({
            name: Joi.string().trim().optional(),
        }),
    },
    LOGIN: {
        body: Joi.object().keys({
            email: Joi.string().trim().required(),
            password: Joi.string().trim().required(),
        }),
    },
    FORGOTPASSWORD: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().trim().required(),
        }),
    },
    RESETPASSWORD: {
        body: Joi.object().keys({
            email: Joi.string().trim().email().trim().required(),
            new_password: Joi.string().trim().required(),
            confirm_password: Joi.string().trim().required(),
            otp: Joi.number().required(),
        }),
    },
    SEARCH: {
        body: Joi.object().keys({
            query: Joi.string().trim().min(3).required(),
            filter: Joi.object()
                .keys({
                    main_category: Joi.string().optional().allow(null),
                    clinical_categories: Joi.object().keys({
                        is: Joi.array().optional().allow(null),
                        isNot: Joi.array().optional().allow(null),
                    }).optional().allow(null),
                    icd_description: Joi.object().keys({
                        is: Joi.array().optional().allow(null),
                        isNot: Joi.array().optional().allow(null),
                    }).optional().allow(null),
                })
                .optional()
                .allow(null),
        }),
    },
    UPDATEMASTERDATA: {
        body: Joi.object().keys({
            id: Joi.number().required(),
            icd_code: Joi.string().optional().allow(""),
            icd_description: Joi.string().optional().allow(""),
            rxcc_cc: Joi.string().optional().allow(""),
            clinical_category: Joi.string().optional().allow(""),
            main_category: Joi.string().optional().allow(""),
            comorbidity_description: Joi.string().optional().allow(""),
            impact_snf_care_plan: Joi.string().optional().allow(""),
            status: Joi.number().valid(0, 1).required(),
            main_category: Joi.string().valid().optional().allow(""),
            preferred_code: Joi.number().valid(0,1).optional()
        }),
    },
    ADDMASTERDATA: {
        body: Joi.object().keys({
            icd_code: Joi.string().required(),
            icd_description: Joi.string().optional(),
            rxcc_cc: Joi.string().optional(),
            main_category: Joi.string().required(),
            clinical_category: Joi.string().optional(),
            comorbidity_description: Joi.string().optional(),
            impact_snf_care_plan: Joi.string().optional(),
            status: Joi.number().valid(0, 1).required(),
            preferred_code: Joi.number().valid(0,1).required()
        }),
    },
    UPLOADFILE: {
        body: Joi.object().keys({
            category_type: Joi.string().valid('master', 'prescription').required()
        }),
    },
    FETCHPRESCRIPTION: {
        body: Joi.object().keys({
            row: Joi.number().required(),
            page: Joi.number().required(),
        }),
    },
    WITHONLYID:{
        body: Joi.object().keys({
            id: Joi.number().required(),
        }),
    },
    WITHIDANDTYPE: {
        body: Joi.object().keys({
            id: Joi.number().required()
        }),
    },
    REPORTFETCH:{
        body: Joi.object().keys({
            prescription_id: Joi.number().required(),
            row: Joi.number().required(),
            page: Joi.number().required(),
        })
    },
    SAVEREPORTDATA:{
        body:Joi.object().keys({
            prescription_id: Joi.number().required(),
            patient_name: Joi.string().required(),
            patient_id: Joi.number().required(),
            patient_object: Joi.object().required()
        })
    },
    VIEWREPORTDATA:{
        body:Joi.object().keys({
            id: Joi.number().required(),
        })
    },
    UPDATEREPORTDATA:{
        body: Joi.object().keys({
            id: Joi.number().required(),
            prescription_id: Joi.number().optional(),
            patient_name: Joi.string().optional(),
            patient_id: Joi.number().optional(),
            patient_object: Joi.object().optional()        })
    },
};

module.exports = { SCHEMA };
