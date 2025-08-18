const requireImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Image is required for this operation.' });
    }
    next();
};

module.exports = requireImage;