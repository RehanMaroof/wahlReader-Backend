const multer = require('multer');
const fileFilter = (req, file, cb) => {
    cb(null, true);
};
module.exports = {
    uploadFile: multer({ storage: multer.memoryStorage(), fileFilter }).single('file'),
};
