const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = multer.diskStorage({ 
	destination: (req, file, cb) => { 
		cb(null, 'routes/uploads') ;
	}, 
	filename: (req, file, cb) => { 
		cb(null, file.originalname + '-' + Date.now()) ;
	} 
});


//for a single file
var uploadFile = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFile);

//for multiple files
var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadMultiFilesMiddleware = util.promisify(uploadFiles);

var uploadMiddleware = {
	uploadFilesMiddleware,
	uploadMultiFilesMiddleware
};


module.exports = uploadMiddleware;