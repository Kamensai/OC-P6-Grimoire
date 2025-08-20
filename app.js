require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const booksRoutes = require('./routes/book');
const usersRoutes = require('./routes/user');

// Connection parameters to MongoDB
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.MONGO_DB;

const app = express();

// Connection to MongoDB
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.jwvhqej.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful !'))
  .catch(() => console.log('Connection to MongoDB failed !'));

app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use('/api/books', booksRoutes);
app.use('/api/auth', usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;