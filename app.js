require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/book');
const usersRoutes = require('./routes/user');

// Paramètres de connexion à MongoDB
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DB;

// Connexion à MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.jwvhqej.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//app.use(express.json());

app.use('/api/books', booksRoutes);
//app.use('/api/auth', usersRoutes);

/*
app.get('/api/books', (req, res, next) => {
  const books = [
    {
      userId: 'oeihfzeoi',
      title: 'Mon premier livre',
      author : 'MasterBook',
      description: 'Les infos de mon premier livre',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 1999,
      genre: 'mystère',
      ratings: [
        {
          userId: 'oeihfzeoi',
          grade: 3,
      }],
      averageRating: 3,
    },
    {
      userId: 'oeihfzeoifsdgfsd',
      title: 'Mon deuxième livre',
      author : 'LegendMan',
      description: 'Les infos de mon premier livre',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      year: 2015,
      genre: 'Aventure',
      ratings: [
        {
          userId: 'oeihfzeoifsdgfsd',
          grade: 4,
      }],
      averageRating: 4,
    },
  ];
  res.status(200).json(books);
});
*/

module.exports = app;