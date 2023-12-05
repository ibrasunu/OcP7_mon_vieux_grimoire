const sharp = require('sharp');
const fs = require('fs');

// Middleware pour compresser l'image téléchargée au format webp, et la redimensionner
module.exports = async (req, res, next) => {
	// Vérifier si un fichier image a été téléchargé
	if (!req.file) {
        return next()
	};
	try {
			// Création du nom du fichier + chemin pour la version compressée
			req.file.compressedFilename = req.file.filename + '.webp';
			req.file.compressedFilePath = req.file.path + '.webp';
		
			await sharp(req.file.path)
			.resize(400)
			.webp(90)
			.toFile(req.file.compressedFilePath) 
		
			// Si la compression réussit, nous supprimons simplement l'image originale
			fs.unlink(req.file.path, (error) => {
				if(error) console.log(error);
			});
			next();
		} 	catch(error) {
				res.status(403).json({ error });
			}
};