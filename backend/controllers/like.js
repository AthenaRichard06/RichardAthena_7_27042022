// Import des modèles
const LikePost = require ("../models/likePublication");
const LikeComment = require ("../models/likeCommentaire");

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
            })
            .then(() => reponse.status(200).json({ message : "Like supprimé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        // Sinon, si le like n'existe pas, on le créé
        } else {
            LikePost.create({
                user_like_post_id: requete.auth.userId,
                post_like_post_id: requete.params.id
            })
            .then(() => reponse.status(200).json({ message : "Like créé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Like d'un commentaire
exports.likeCommentaire = (requete, reponse, next) => {
    // On recherche un like selon le commentaire, la publication et l'utilisateur·rice
    LikeComment.findOne({ where:
        { user_like_comment_id: requete.auth.userId,
        post_like_comment_id: requete.params.id,
        comment_like_comment_id: requete.params.commentId }
    })
    .then((likecomment) => {
        // Si un like existe déjà, on le supprime
        if(likecomment) {
            LikeComment.destroy({ where: 
                { user_like_comment_id: requete.auth.userId,
                post_like_comment_id: requete.params.id,
                comment_like_comment_id: requete.params.commentId }
            })
            .then(() => reponse.status(200).json({ message : "Like supprimé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        // Sinon, si le like n'existe pas, on le créé
        } else {
            LikeComment.create({
                user_like_comment_id: requete.auth.userId,
                post_like_comment_id: requete.params.id,
                comment_like_comment_id: requete.params.commentId
            })
            .then(() => reponse.status(200).json({ message : "Like créé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};