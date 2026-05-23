import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. The Upload Endpoint
router.post('/image', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const fileBase64 = req.file.buffer.toString('base64');
    const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "sovereign_issue_tracking",
    });

    res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router; // Use export default instead of module.exports