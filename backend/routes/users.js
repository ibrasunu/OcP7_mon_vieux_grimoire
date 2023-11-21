const express = require('express');
const router = express.Router();

// Importer les middlewares qui seront utilisés dans les routes des utilisateurs
const rateLimit = require('../middlewares/rate');
const validateEmail = require('../middlewares/email-validator');
const validatePassword = require('../middlewares/password-validator');

// Importer les utilisateurs du contrôleur
const usersCtrl = require('../controllers/users');

// Définition des routes permettant de gérer l'authentification et l'enregistrement des utilisateurs dans l'application
router.post('/signup', rateLimit, validateEmail, validatePassword, usersCtrl.signup);
router.post('/login', rateLimit, usersCtrl.login);

module.exports = router;