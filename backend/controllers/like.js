// Import des modèles
const LikePost = require ("../models/likePublication");
const Post = require ("../models/publication");

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
            Post.decrement(
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
            Post.increment(
                { likes: 1 },
                { where: { id: requete.params.id }}
            )
            reponse.status(201).json({ message : "Like créé !"});
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

exports.compteLikes = (requete, reponse, next) => {
    LikePost.count({ where:
        { post_like_post_id: requete.params.id }
    })
        .then((compte) => {
            reponse.status(200).json({ message : compte });
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
}