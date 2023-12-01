const Book = require("../models/books");
const fs = require("fs");
const path = require("path");

// Ajout de nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.compressedFilename
        }`,
        averageRating: bookObject.ratings[0].grade,
    });
    book.save()
        .then(() => {
            res.status(201).json({ message: "Livre enregistré !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Modifier un livre
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.compressedFilename
        }`,
    }
        : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "403: unauthorized request" });
            } else {
                if (req.file) {
                    const imagePath = path.join(
                        __dirname,
                        "..",
                        "images",
                        path.basename(book.imageUrl)
                    );
                    fs.unlink(imagePath, (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: "Livre modifié!" })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Liste de tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// Un seul livre
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Livre supprimé !",
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

// Rate: les 3 meilleurs livres
exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3) // Seulemen 3 livres
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// Noter un livre
exports.postRating = (req, res, next) => {
    const { userId, rating } = req.body;

    const user = req.body.userId;

    if (user !== req.auth.userId) {
        return res.status(401).json({ message: "Non autorisé" });
    }

    // Vérifier que la  note se situe enntre 0 et 5
    if (rating < 0 || rating > 5) {
        return res
            .status(400)
            .json({ error: "La note doit être un nombre entre 0 et 5." });
    }

    Book.findById(req.params.id)
        .then((book) => {
            if (!book) {
                return res.status(404).json({ error: "Livre non trouvé." });
            }

            // Vérifier si l'utilisateur a déjà noté le livre
            const userRating = book.ratings.find(
                (rating) => rating.userId === userId
            );

            if (userRating) {
                return res
                    .status(400)
                    .json({ error: "L'utilisateur a déjà noté ce livre." });
            }

            // Ajouter la note à la liste de notation
            book.ratings.push({ userId, grade: rating });

            // Calculer la nouvelle note moyenne
            const totalRatings = book.ratings.length;
            const sumRatings = book.ratings.reduce(
                (sum, rating) => sum + rating.grade,
                0
            );
            const averageRating = (sumRatings / totalRatings);
            book.averageRating = averageRating;

            // Sauvegarder les modifications
            book.save()
                .then((updatedBook) => {
                    res.status(200).json(updatedBook);
                })
                .catch((error) => {
                    res.status(500).json({ error });
                });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
