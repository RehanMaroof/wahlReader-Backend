require('dotenv').config();
const AWS = require('aws-sdk');
const path = require('path');
const logger = require('./logger');
const fileUtils = require('./file.utils');

const PDF_DIR = `${process.env.FOLDER_NAME}/prescription`;
const CSV_DIR = `${process.env.FOLDER_NAME}/inputformdata`;

AWS.config.apiVersions = { s3: '2012-10-17' };

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.S3_ENDPOINT,
});

const s3 = new AWS.S3();
const ses = new AWS.SES();

exports.uploadBase64File = async (base64File, userId, contentType) => {
    try {
        // Remove the data:image/png;base64, part if present
        const base64Data = base64File.split(',')[1];

        // Convert base64 string to a buffer
        const buffer = fileUtils.getFsBuffer(base64Data);
        const fileType = contentType.split('/')[1]; // application/pdf
       
        const s3FileName = `_${userId}_${Date.now()}.${fileType}`;

        // S3 file extension and folder path
        let s3Key=`${process.env.FOLDER_NAME}/unknown`;
        switch (fileType) {
            case "pdf":
                s3Key = `${PDF_DIR}/${s3FileName}`;
                break;
            case "csv":
                s3Key = `${CSV_DIR}/${s3FileName}`;
                break;
            default:
                break;
        }

        // Upload to S3
        logger.info(s3Key);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: s3Key,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: contentType,
        };
        return await s3.upload(params).promise();
    } catch (error) {
        logger.error(error);
        return null;
    }
};

exports.deleteObject = (fileKey) => {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,
    };

    s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
    });
};

exports.awsSESSender = async(email) => {
    const params = {
        Source: 'darkinstarpro@gmail.com', 
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Subject: {
                Data: 'Test Email from SES',
                Charset: 'UTF-8',
            },
            Body: {
                Text: {
                    Data: 'This is a test email sent using AWS SES.',
                    Charset: 'UTF-8',
                },
                Html: {
                    Data: '<h1>This is a test email sent using AWS SES.</h1>',
                    Charset: 'UTF-8',
                },
            },
        },
    };
    return ses.sendEmail(params, (err, data) => {
        if (err) {
            console.error('Error sending email:', err);
            return null;
        } else {
            return('Email sent successfully:', data);
        }
    });
};
