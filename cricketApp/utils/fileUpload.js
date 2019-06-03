const multer = require('multer');
const path = require('path');
const R = require('ramda');

module.exports.fileUploader = (folderName, fieldName, settings = {}) => {

    const storage = multer.diskStorage({
        destination: './public/uploads/' + folderName + '/',
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })

    defualtSettings = {
        storage: storage,
    }

    let newSettings = R.merge(defualtSettings, settings)

    return upload = multer(newSettings).single(fieldName)
}

const filePath = R.compose(R.prop('destination'), R.prop('file'));
// req => trimedFilePath
module.exports.trimedFilePath = R.compose(R.replace('public', ''), R.replace('./', ''), filePath);