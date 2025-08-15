// Gestion de la logique de l'application du model Book

const Book = require('../models/Book');

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

exports.createBook = (req, res, next) => {
    delete req.body._id;
    const book = new Book({
        ...req.body,
    });
    book.save()
    .then(() => res.status(201).json({ message: 'Book created successfully!' }))
    .catch(error => {
        console.log(error);
        res.status(400).json({ error });
    })
};

exports.rateBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const userId  = req.auth.body;
        const rating = req.body.rating;

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
        book.averageRating = book.ratings.reduce((sum, r) => sum + r.grade, 0) / book.ratings.length;

        await book.save();

        res.status(201).json({ message: 'Livre noté avec succès !', averageRating: book.averageRating });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur : ' + error.message });
    }
};

exports.updateBook = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book updated successfully!' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Book deleted successfully!' }))
        .catch(error => res.status(400).json({ error }));
};





