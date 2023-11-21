const rateLimit = require('express-rate-limit');

// Ce middleware limitera le nombre de requêtes qu'un client pourra envoyer à l'application (lors de son inscription ou de sa connexion), dans un délai donné.
module.exports = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    handler: function (req, res, next) {
        return res.status(429).json({ error: 'Vous avez envoyé trop de requêtes, attendez une minute' })
    }
});