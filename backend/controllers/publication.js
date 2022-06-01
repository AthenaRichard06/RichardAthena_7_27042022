// Import des modèles
const Post = require("../models/publication");
const User = require("../models/utilisateur");

// Import de sequelize
const { Op } = require("sequelize");

// Import de file system de Node
const fileSystem = require("fs");

// Logiques métiers des différentes demandes CRUD
// Création d'une publication
exports.creationPublication = (requete, reponse, next) => {
    // On voit s'il y a une photo qui accompagne la publication, si oui, on indique l'emplacement d'enregistrement
    let lienPhoto = "";
    if (requete.file) {
        lienPhoto = `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`;
    }
    if (requete.body.texte == "") {
        reponse.status(400).json({ message: "Vous ne pouvez pas poster" });
        return;
    }
    // On enregistre la publication dans la base de données
    Post.create({
        texte: requete.body.texte,
        photo: lienPhoto,
        user_post_id: requete.body.userId
    })
        .then(() => reponse.status(201).json({ message: "Publication enregistrée !" }))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Afficher une publication
exports.affichagePublication = (requete, reponse, next) => {
    Post.findOne({
        where: { id: requete.params.id },
        include: {
            model: User,
            attributes: ["nom", "prenom", "photo"]
        }
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));
};

// Afficher toutes les publications
exports.affichageToutesPublications = (requete, reponse, next) => {
    Post.findAll({
        include: {
            model: User,
            attributes: ["nom", "prenom", "photo"]
        },
        order: [["createdAt", "DESC"]]
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));
}

// Afficher toutes les publications d'un utilisateur·rice
exports.affichagePublicationsUtilisateur = (requete, reponse, next) => {
    Post.findAll({
        where: { user_post_id: requete.params.id },
        include: {
            model: User,
            attributes: ["nom", "prenom", "photo"]
        },
        order: [["createdAt", "DESC"]]
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));
};

// Modification d'une publication
exports.modificationPublication = (requete, reponse, next) => {
    // On demande si un fichier accompagne la requête/modification
    const postObjet = requete.file ?
        {
            // Si oui, mise à jour complète de la publication, à partir des éléments compris dans la requête du body
            ...requete.body,
            photo: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
            // Si non, mise à jour de la publication, à partir des autres éléments de la requête du body
        } : { ...requete.body };

    Post.findOne({ where: { id: requete.params.id } })
        .then((post) => {
            // Si un fichier est fourni et qu'il ne s'agit pas de la photo déjà enregistrée, on supprime l'image qui existe déjà
            if (requete.file) {
                const nomFichier = post.photo.split("/images/")[1];
                fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
            }
            // On vérifie que l'Id de l'utilisateur·rice est le même que l'Id de celui ou celle qui a crée la publication, sauf si c'est un·e administrateur·rice
            User.findOne({ where: { id: requete.auth.userId } })
                .then((user) => {
                    if (post.user_post_id !== requete.auth.userId && !user.administrateur) {
                        return reponse.status(401).json({ message: "Vous n'avez pas les droits pour modifier cette publication !" })
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            // On enregistre le compte
            Post.update(
                { ...postObjet, id: requete.params.id },
                { where: { id: requete.params.id } }
            )
                .then(() => reponse.status(200).json({ message: "Publication modifiée !" }))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
};

// Suppression d'une publication
exports.suppressionPublication = (requete, reponse, next) => {
    Post.findOne({ where: { id: requete.params.id } })
        .then((post) => {
            // On vérifie que l'Id de l'utilisateur·rice est le même que l'Id de celui ou celle qui a crée la publication, sauf si c'est un·e administrateur·rice
            User.findOne({ where: { id: requete.auth.userId } })
                .then((user) => {
                    if (post.user_post_id !== requete.auth.userId && !user.administrateur) {
                        return reponse.status(401).json({ message: "Vous n'avez pas les droits pour supprimer cette publication !" })
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            const nomFichier = post.photo.split("/images/")[1];
            // On supprime l'image dans le dossier, puis on supprime la publication de la base de données
            fileSystem.unlink(`images/${nomFichier}`, () => {
                Post.destroy({ where: { id: requete.params.id } })
                    .then(() => reponse.status(200).json({ message: "Publication supprimée !" }))
                    .catch(erreur => reponse.status(400).json({ erreur }));
            })
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};