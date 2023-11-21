const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition d'un schéma de modèle pour les utilisateurs de l'application utilisant Mongoose
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Les adresses email de la base de données sont uniques
// Ce plugin Mongoose approprié est utilisé pour garantir l'unicité et signaler les erreurs
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);