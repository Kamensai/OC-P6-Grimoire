const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// We no longer store on disk, but in memory
const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

const uploadAndConvert = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });

        // If no file is uploaded, continue (useful for PUT requests)
        if (!req.file) return next();

        // Check allowed file types
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: 'Only PNG, JPEG and JPG files are allowed.' });
        }

        try {
            const timestamp = Date.now();
            const nameWithoutExt = req.file.originalname.split(' ').join('_').split('.')[0];
            const outputFilename = `${nameWithoutExt}-${timestamp}.webp`;
            const outputPath = path.join('images', outputFilename);

            // Sharp takes the buffer as input and writes directly in WebP format
            await sharp(req.file.buffer)
                .webp({ quality: 80 })
                .toFile(outputPath);

             // Replace file info for further processing
            req.file.filename = outputFilename;
            req.file.path = outputPath;

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Image processing failed: ' + error.message });
        }
    });
};

module.exports = uploadAndConvert;