// Import du modèle postModel
const Post = require ("../models/publication");
const User = require ("../models/utilisateur");

// Import de file system de Node
const fileSystem = require ("fs");

// Logiques métiers des différentes demandes CRUD
// Création d'une publication
exports.creationPublication = (requete, reponse, next) => {
    // On voit s'il y a une photo qui accompagne la publication, si oui, on indique l'emplacement d'enregistrement
    let lienPhoto = "";
    if (requete.file) {
        lienPhoto = `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`;
    }
    // On enregistre la publication dans la base de données
    Post.create({
        texte: requete.body.texte,
        photo: lienPhoto,
        user_post_id: requete.body.userId
    })
        .then(() => reponse.status(201).json ({ message : "Publication enregistrée !" }))
        .catch(erreur => reponse.status(400).json({ erreur }));
};

// Afficher une publication
exports.affichagePublication = (requete, reponse, next) => {
    Post.findOne({
        where: { id: requete.params.id },
        include: {
            model: User,
            attributes: {
                exclude: ["id", "motdepasse", "email", "createdAt", "administrateur", "biographie", "fonction"],
            }
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
            attributes: {
                exclude: ["id", "motdepasse", "email", "createdAt", "administrateur", "biographie", "fonction"],
            }
        },
        order: [["createdAt", "DESC"]]
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));
}

// Afficher toutes les publications d'un utilisateur
exports.affichagePublicationsUtilisateur = (requete, reponse, next) => {
    Post.findAll({
        where: { user_post_id: requete.params.id },
        include: {
            model: User,
            attributes: {
                exclude: ["id", "motdepasse", "email", "createdAt", "administrateur", "biographie", "fonction"],
            }
        },
        order: [["createdAt", "DESC"]]
    })
        .then(post => reponse.status(200).json(post))
        .catch(erreur => reponse.status(404).json({ erreur }));  
};

exports.modificationPublication = (requete, reponse, next) => {
    // On demande si un fichier accompagne la requête/modification
    const postObjet = requete.file ?
    {
    // Si oui, mise à jour complète de la publication, à partir des éléments compris dans la requête du body
    ...requete.body,
    photo: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
    // Si non, mise à jour de la publication, à partir des autres éléments de la requête du body
    } : { ...requete.body };

    Post.findOne({ where: { id: requete.params.id }})
    .then((post) => {
        // Si un fichier est fourni et qu'il ne s'agit pas de la photo déjà enregistrée, on supprime l'image qui existe déjà
        if (requete.file) {
            const nomFichier = post.photo.split("/images/")[1];
            fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
        }
        // On vérifie que l'Id de l'utilisateur est le même que l'Id de celui qui a crée le compte, sauf si c'est un administrateur
        if (post.user_post_id !== requete.auth.userId && requete.params.administrateur == false) {
            return reponse.status(401).json({ erreur })
        }
        // On enregistre le compte
        Post.update(
            { ...postObjet, id: requete.params.id },
            { where: { id: requete.params.id }}
        )
            .then(() => reponse.status(200).json({ message : "Publication modifiée !"}))
            .catch(erreur => reponse.status(400).json({ erreur }));
    })
};