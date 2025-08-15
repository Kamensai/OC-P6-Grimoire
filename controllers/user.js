// Gestion de la logique de l'application du model Book

const User = require('../models/User');

exports.signup = (req, res, next) => {
    res.status(201).json({
        message: 'User created successfully!',
    });
};

exports.login = (req, res, next) => {
    res.status(200).json({
        message: 'User logged in successfully!',
    });
};