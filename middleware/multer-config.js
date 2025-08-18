const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// On ne stocke plus sur le disque, mais en mémoire
const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

const uploadAndConvert = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ error: err.message });
        if (!req.file) return res.status(400).json({ error: 'No file uploaded!' });

        try {
            const timestamp = Date.now();
            const nameWithoutExt = req.file.originalname.split(' ').join('_').split('.')[0];
            const outputFilename = `${nameWithoutExt}-${timestamp}.webp`;
            const outputPath = path.join('images', outputFilename);

            // Sharp prend le buffer en entrée et écrit directement en WebP
            await sharp(req.file.buffer)
                .webp({ quality: 80 }) // compression
                .toFile(outputPath);

            // On remplace les infos du fichier pour le reste du traitement
            req.file.filename = outputFilename;
            req.file.path = outputPath;

            next();
        } catch (error) {
            return res.status(500).json({ error: 'Image processing failed: ' + error.message });
        }
    });
};

module.exports = uploadAndConvert;