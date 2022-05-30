// Import des modèles
const LikePost = require ("../models/likePublication");
const Publication = require ("../models/publication");

// Logiques métiers des différentes demandes CRUD
// Like d'une publication
exports.likePublication = (requete, reponse, next) => {
    // On recherche un like selon la publication et l'utilisateur·rice
    LikePost.findOne({ where:
        { user_like_post_id: requete.auth.userId,
        post_like_post_id: requete.params.id }
    })
    .then((likepost) => {
        // Si un like existe déjà, on le supprime
        if(likepost) {
            LikePost.destroy({ where: 
                { user_like_post_id: requete.auth.userId,
                post_like_post_id: requete.params.id }
            });
            Publication.decrement(
                { likes: 1 },
                { where: { id: requete.params.id }}
            );
            reponse.status(200).json({ message : "Like supprimé !"});
        // Sinon, si le like n'existe pas, on le créé
        } else {
            LikePost.create({
                user_like_post_id: requete.auth.userId,
                post_like_post_id: requete.params.id
            });
            Publication.increment(
                { likes: 1 },
                { where: { id: requete.params.id }}
            )
            reponse.status(201).json({ message : "Like créé !"});
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Vérification du like d'une publication
exports.checkLikePubli = (requete, reponse, next) => {
    LikePost.findOne({ where:
        { user_like_post_id: requete.auth.userId,
        post_like_post_id: requete.params.id }
    })
    .then ((likepost) => {
        // Si le like existe déjà, on renvoie l'information
        if (likepost) {
            return reponse.status(200).json({ message: "Like existant"});
        } else {
            return reponse.status(404).json({ message: "Like inexistant"});
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};