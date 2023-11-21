const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définir un schéma modèle pour les livres dans l'application en utilisant Mongoose
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true }
        }
    ],
    averageRating: { type: Number, required: true }
});
// Les titres d'un livre dans la base de données sont uniques
// Ce plugin Mongoose approprié est utilisé pour garantir l'unicité et signaler les erreurs
bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);