const fs = require("fs")
const https = require('https');
const Readable = require('stream').Readable

const { HELPER } = require('../helpers');

// Function to get file extension from a Base64 image string
exports.getFileExtension = (base64String)=> {
    // Regular expression to extract the MIME type from the Base64 string
    const regex = /^data:(image\/[a-zA-Z]*);base64,/;

    // Extract the MIME type
    const matches = base64String.match(regex);
    if (matches && matches.length > 1) {
        const mimeType = matches[1];

        // Define a mapping of MIME types to file extensions
        const mimeTypes = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            // Add more MIME types and their corresponding file extensions if needed
        };

        // Return the corresponding file extension or null if MIME type is not found
        return mimeTypes[mimeType] || null;
    } else {
        // Return null if the MIME type could not be extracted
        return null;
    }
};

exports.getFsBuffer = (fileBase64) => Buffer.from(fileBase64,'base64');

exports.bufferToStream = (buffer) =>{
    const readableStream = new Readable();
    readableStream._read = () => {}; // No-op _read method
    readableStream.push(buffer);
    readableStream.push(null); // End of the stream
    return readableStream;
}

exports.convertToBase64 = (file) => {
    console.log(file)
    const image = fs.readFileSync(file);
    const base64String = Buffer.from(image).toString('base64');

    return base64String;
}


exports.urlToBase64 = async(url) =>  {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = [];

            // Check for response status
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get URL, status code: ${response.statusCode}`));
                return;
            }

            response.on('data', (chunk) => {
                data.push(chunk);
            });

            response.on('end', () => {
                // Combine all data chunks into one buffer
                const buffer = Buffer.concat(data);
                // Convert buffer to Base64 string
                const base64 = buffer.toString('base64');
                resolve(base64);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}