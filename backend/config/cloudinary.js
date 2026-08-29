// Cloudinary Configuration with graceful fallback
let cloudinary;

try {
  cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "lamborghini_demo",
    api_key: process.env.CLOUDINARY_API_KEY || "demo_key",
    api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret",
  });
} catch (error) {
  // If cloudinary module is not installed or configured, provide a safe mock
  cloudinary = {
    uploader: {
      upload: async (filePath) => ({
        secure_url: filePath,
        public_id: "local_" + Date.now(),
      }),
      destroy: async (publicId) => ({ result: "ok" }),
    },
  };
}

module.exports = cloudinary;
