const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let upload;
try {
  const multer = require("multer");
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const filetypes = /jpe?g|png|webp|svg|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, jpeg, png, webp, svg, gif) are allowed"), false);
    }
  };

  upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter,
  });
} catch (e) {
  // If multer is not installed, fallback placeholder
  upload = {
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next(),
  };
}

module.exports = upload;

