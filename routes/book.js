const express = require('express');
const router = express.Router();



const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const requireImage = require('../middleware/requireImage');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/bestrating', bookCtrl.getTop3RatingsBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, requireImage, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, multer, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;