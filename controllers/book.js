// Handles the business logic for the Book model

const Book = require('../models/Book');
const User = require('../models/User');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

exports.getTop3RatingsBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 }) // sort books from best rating to worst rating
        .limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.createBook = async (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject.userId;

        const user = await User.findOne({ _id: req.auth.userId });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non rencontré.' });
        }

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });

        book.save()
            .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
            .catch(error => {
                res.status(400).json({ error })});
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
    }
};

exports.rateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const userId  = req.auth.userId;
        const rating = req.body.rating;

        const user = await User.findOne({ _id: req.auth.userId });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non rencontré.' });
        }

        // Check valid rating
        if (!rating || rating < 0 || rating > 5) {
            return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
        }

        // Get the book if it exists
        const book = await Book.findOne({ _id: bookId });
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé.' });
        }

        // Check if user already rated
        const existingRating = book.ratings.find(r => r.userId === userId);
        if (existingRating) {
            return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
        }

        // Add rating
        book.ratings.push({ userId, grade: rating });

        // update average rating
        book.averageRating = Math.round((book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length) * 100) / 100;

        await book.save();

        // return the book with id at the root
        // convert to JS object
        const bookResponse = book.toObject(); 
        // add id field
        bookResponse.id = bookResponse._id;   
        
        res.status(201).json(bookResponse);   
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject.userId;
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) return res.status(404).json({ message: 'Book not found' });

            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Unauthorized Request' });
            }

            // If new image uploaded, delete old image
            if (req.file && book.imageUrl) {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, err => {
                    if (err) console.error('Erreur suppression ancienne image:', err);
                });
            } 

            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Book updated successfully!' }))
            .catch(error => res.status(401).json({ error }));                 
        })
        .catch(error => res.status(400).json({ message: 'Book not found', error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Book deleted successfully!' }))
                        .catch(error => res.status(401).json({ error }));
                });
                
            }             
        })
        .catch(error => res.status(500).json({ error }));    
};





