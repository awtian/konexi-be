var multer = require("multer");
var multerGoogleStorage = require("multer-cloud-storage");
var uploadHandler = multer({
  storage: multerGoogleStorage.storageEngine({
    autoRetry: true,
    bucket: "awtstorage",
    projectId: "awtian",
    keyFilename: "./google-key.json",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
    publicRead: "publicRead",
  }),
});

module.exports = uploadHandler;
