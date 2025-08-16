
require('dotenv').config();
const jwt = require('jsonwebtoken');

const RANDOM_TOKEN_SECRET = process.env.RANDOM_TOKEN_SECRET;

module.exports = (req, res, next) => {
    try {
        console.log(RANDOM_TOKEN_SECRET);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw 'Authorization header missing';
        }
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, RANDOM_TOKEN_SECRET);
        console.log(decodedToken);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            req.auth = {
                userId: userId
            };
            next();
        }
    } catch(error) {
        res.status(401).json({error});
    }
};