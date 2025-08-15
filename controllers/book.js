// Gestion de la logique de l'application du model Book

const Book = require('../models/Book');

exports.getAllBooks = (req, res, next) => {
    res.status(200).json({
        message: 'List of books',
    });
};

exports.getOneBook = (req, res, next) => {
    res.status(200).json({
        message: 'Single book',
    });
};

exports.getBestRatingsBooks = (req, res, next) => {
    res.status(200).json({
        message: 'Best ratings books',
    });
}

exports.createBook = (req, res, next) => {
    res.status(201).json({
        message: 'Book created successfully!',
    });
};

exports.rateBook = (req, res, next) => {
    res.status(200).json({
        message: 'Book rated successfully!',
    });
};

exports.updateBook = (req, res, next) => {
    res.status(200).json({
        message: 'Book updated successfully!',
    });
};

exports.deleteBook = (req, res, next) => {
    res.status(200).json({
        message: 'Book deleted successfully!',
    });
};





