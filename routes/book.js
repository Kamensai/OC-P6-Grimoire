const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.getTop3RatingsBooks);
router.post('/', auth, bookCtrl.createBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);
router.put('/:id', auth, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;