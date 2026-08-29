let upload;

try {
  const multer = require("multer");
  const storage = multer.memoryStorage();

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter,
  });
} catch (_) {
  // If multer is not installed, pass through middleware
  upload = {
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next(),
  };
}

module.exports = upload;
