const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', (req, res, next) => {
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

module.exports = app;