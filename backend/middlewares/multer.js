const multer = require('multer');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png'
};

// Cette fonction middleware est responsable de la gestion du téléchargement des fichiers image dans l'application à l'aide du package multer.
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
		// Vérification du type de fichier
		if(file.mimetype.split('/')[0] !== 'image') new Error("Uploaded file must be an image");
		// Vérification du type d'image
		if(MIME_TYPES[file.mimetype] === undefined) new Error("Uploaded file must be a : JPG / PNG / WEBP");
		// Création d'un nom de fichier de destination unique (original-date.extension)
		const name = file.originalname.split(' ').join('_');
		const extension = MIME_TYPES[file.mimetype];
		const { name: onlyFileName } = path.parse(name);
		const finalFilename = onlyFileName + '-' + Date.now() + '.' + extension;
		// Envoi au prochain middleware/contrôleur avec le nom de fichier de destination
		callback(null, finalFilename);
	}
});

module.exports = multer({ storage: storage }).single('image');