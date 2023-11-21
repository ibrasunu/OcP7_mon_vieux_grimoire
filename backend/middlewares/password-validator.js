const passwordValidator = require('password-validator');

//Le middleware validatePassword est utilisé pour vérifier si un mot de passe répond à certaines exigences de sécurité
const validatePassword = (req, res, next) => {
    const userPassword = req.body.password;

    const schema = new passwordValidator();
    schema
        .is().min(8)                               
        .has().uppercase()                         
        .has().digits(1)                           
        .has().symbols(1)                          
        .has().not().spaces()                      

    if (!schema.validate(userPassword)) {
        return res.status(400).json({ error: 'Mot de passe invalide' });
    }
    next();
};

module.exports = validatePassword;