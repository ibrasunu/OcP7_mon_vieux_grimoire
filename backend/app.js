const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Charger variables d'environnement du fichier .env
require('dotenv').config();

// Import des deux fichiers routes  de l'application
const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

// Création de l'application express
const app = express();

// Connection à la base de donnée MongoDb
mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_CLUSTER + '.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// Middleware utilisé pour l'analyse du body des requetes avenir au format JSON
app.use(express.json());

// Securisation dee l'application
app.use(mongoSanitize());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Tous les routes définis dans booksRoutes seront accessibles sous l'URL /api/books/
app.use('/api/books', booksRoutes);
// Tous les routes définis dans booksRoutes seront accessibles sous l'URL /api/users/
/api/users/
app.use('/api/auth', userRoutes);  
// Configuration d'un point d'accès pour gérer les requêtes vers le répertoire 'image', pour y accéder via l'URL/images/example.jpg
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;