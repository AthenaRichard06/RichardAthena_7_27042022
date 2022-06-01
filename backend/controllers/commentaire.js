// Import des modèles
const Comment = require ("../models/commentaire");
const User = require ("../models/utilisateur");
const Post = require ("../models/publication");

// Import de file system de Node
const fileSystem = require ("fs");

// Logiques métiers des différentes demandes CRUD
// Création d'un commentaire
exports.creationCommentaire = (requete, reponse, next) => {
    // On voit s'il y a une photo qui accompagne la publication, si oui, on indique l'emplacement d'enregistrement
    let lienPhoto = "";
    if (requete.file) {
        lienPhoto = `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`;
    }
    // On enregistre la publication dans la base de données
    Comment.create({
        texte: requete.body.texte,
        photo: lienPhoto,
        user_comment_id: requete.auth.userId,
        post_comment_id: requete.body.postId
    })
        .then(() => reponse.status(201).json ({ message : "Commentaire enregistré !" }))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Afficher ue commentaire
exports.affichageCommentaire = (requete, reponse, next) => {
    Comment.findOne({
        where: { id: requete.params.id },
        include: {
            model: User,
            attributes: ["nom", "prenom"]
        }
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));
};

// Afficher tous les commentaires d'une publication
exports.affichageTousCommentaires = (requete, reponse, next) => {
    Comment.findAll({
        where: { post_comment_id: requete.params.id },
        include: {
            model: User,
            attributes: ["nom", "prenom"]
        },
        order: [["createdAt", "ASC"]]
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));  
};

// Modification d'un commentaire
exports.modificationCommentaire = (requete, reponse, next) => {
    // On demande si un fichier accompagne la requête/modification
    const commentObjet = requete.file ?
    {
    // Si oui, mise à jour complète du commentaire, à partir des éléments compris dans la requête du body
    ...requete.body,
    photo: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
    // Si non, mise à jour du commentaire, à partir des autres éléments de la requête du body
    } : { ...requete.body };

    Comment.findOne({ where: { id: requete.params.id }})
    .then((comment) => {
        // Si un fichier est fourni et qu'il ne s'agit pas de la photo déjà enregistrée, on supprime l'image qui existe déjà
        if (requete.file) {
            const nomFichier = comment.photo.split("/images/")[1];
            fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
        }
        // On vérifie que l'Id de l'utilisateur·rice est le même que l'Id de celui ou celle qui a crée le commentaire, sauf si c'est un·e administrateur·rice
        User.findOne({ where: { id: requete.auth.userId }})
        .then((user) => {
            if(comment.user_comment_id !== requete.auth.userId && !user.administrateur) {
                return reponse.status(401).json({ message : "Vous n'avez pas les droits pour modifier ce commentaire !" })
            }
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
        // On enregistre le compte
        Comment.update(
            { ...commentObjet, id: requete.params.id },
            { where: { id: requete.params.id }}
        )
            .then(() => reponse.status(200).json({ message : "Commentaire modifié !"}))
            .catch(erreur => reponse.status(400).json({ erreur }));
    })
};

// Suppression d'un commentaire
exports.suppressionCommentaire = (requete, reponse, next) => {
    Comment.findOne({ where: { id: requete.params.id }})
        .then((comment) => {
            // On vérifie que l'Id de l'utilisateur·rice est le même que l'Id de celui ou celle qui a crée le commentaire, sauf si c'est un·e administrateur·rice
            User.findOne({ where: { id: requete.auth.userId }})
                .then((user) => {
                    if(comment.user_comment_id !== requete.auth.userId && !user.administrateur) {
                        return reponse.status(401).json({ message : "Vous n'avez pas les droits pour supprimer ce commentaire !" })
                    }
                    const nomFichier = comment.photo.split("/images/")[1];
                        // On supprime l'image dans le dossier, puis on supprime le commentaire de la base de données
                        fileSystem.unlink(`images/${nomFichier}`, () => {
                            Comment.destroy({ where: { id: requete.params.id }})
                                .then(() => reponse.status(200).json({ message : "Commentaire supprimé !"}))
                                .catch(erreur => reponse.status(400).json({ erreur }));
                        })
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};