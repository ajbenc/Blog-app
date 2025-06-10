import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    try {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'blogapp' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({ message: 'Cloudinary upload error', error });
          }
          console.log('File uploaded to Cloudinary successfully:', result.secure_url);
          res.json({
            message: 'File uploaded successfully',
            url: result.secure_url,
          });
        }
      );
      stream.end(req.file.buffer);
    } catch (err) {
      console.error('Upload failed:', err);
      res.status(500).json({ message: 'Upload failed', error: err });
    }
  }
];