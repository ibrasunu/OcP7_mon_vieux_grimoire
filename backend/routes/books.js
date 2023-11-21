const express = require('express');
const router = express.Router();

// Importer un middleware qui sera utilisé dans les routes de livres
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer');
const sharp = require('../middlewares/sharp');

// Importer les livres du contrôleur
const booksCtrl = require('../controllers/books');

// Définition des chemins associés aux livres dans l'application
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/:id/rating', auth, booksCtrl.postRating);
router.post('/', auth, multer, sharp, booksCtrl.createBook);
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;