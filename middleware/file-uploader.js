const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});
var upload = multer({
    storage: storage
}).array('file', 10);

module.exports = (req, res, next) => {
    upload(req, res, function (err) {
        req.uploadError = false;
        if (err) {
            req.uploadError = true;
        }
        next();
    });
}