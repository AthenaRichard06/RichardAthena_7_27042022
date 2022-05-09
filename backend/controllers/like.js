// Import des modèles
const LikePost = require ("../models/likePublication");
const DislikePost = require ("../models/dislikePublication");
const LikeComment = require ("../models/likeCommentaire");
const DislikeComment = require ("../models/dislikeCommentaire");

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
            .then(() => {
                DislikePost.findOne({ where:
                    { user_dislike_post_id: requete.auth.userId,
                    post_dislike_post_id: requete.params.id }
                })
                .then((dislikepost) => {
                    if(dislikepost) {
                        DislikePost.destroy({ where: 
                            { user_dislike_post_id: requete.auth.userId,
                            post_dislike_post_id: requete.params.id }
                        })
                        .then(() => reponse.status(200).json({ message : "Like crée et dislike supprimé !"}))
                        .catch(erreur => reponse.status(500).json({ erreur }));
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            })
            .catch(erreur => reponse.status(500).json({ erreur }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Dislike d'une publication
exports.dislikePublication = (requete, reponse, next) => {
    // On recherche un dislike selon la publication et l'utilisateur·rice
    DislikePost.findOne({ where:
        { user_dislike_post_id: requete.auth.userId,
        post_dislike_post_id: requete.params.id }
    })
    .then((dislikepost) => {
        // Si un dislike existe déjà, on le supprime
        if(dislikepost) {
            DislikePost.destroy({ where: 
                { user_dislike_post_id: requete.auth.userId,
                post_dislike_post_id: requete.params.id }
            })
            .then(() => reponse.status(200).json({ message : "Dislike supprimé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        // Sinon, si disle like n'existe pas, on le créé
        } else {
            DislikePost.create({
                user_dislike_post_id: requete.auth.userId,
                post_dislike_post_id: requete.params.id
            })
            .then(() => {
                LikePost.findOne({ where:
                    { user_like_post_id: requete.auth.userId,
                    post_like_post_id: requete.params.id }
                })
                .then((likepost) => {
                    if(likepost) {
                        LikePost.destroy({ where: 
                            { user_like_post_id: requete.auth.userId,
                            post_like_post_id: requete.params.id }
                        })
                        .then(() => reponse.status(200).json({ message : "Dislike crée et like supprimé !"}))
                        .catch(erreur => reponse.status(500).json({ erreur }));
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            })
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
            .then(() => {
                DislikeComment.findOne({ where:
                    { user_dislike_comment_id: requete.auth.userId,
                    post_dislike_comment_id: requete.params.id,
                    comment_dislike_comment_id: requete.params.commentId }
                })
                .then((dislikecomment) => {
                    if(dislikecomment) {
                        DislikeComment.destroy({ where: 
                            { user_dislike_comment_id: requete.auth.userId,
                            post_dislike_comment_id: requete.params.id,
                            comment_dislike_comment_id: requete.params.commentId }
                        })
                        .then(() => reponse.status(200).json({ message : "Like créé et dislike supprimé !"}))
                        .catch(erreur => reponse.status(500).json({ erreur }));
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            })
            .catch(erreur => reponse.status(500).json({ erreur }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Dislike d'un commentaire
exports.dislikeCommentaire = (requete, reponse, next) => {
    // On recherche un dislike selon le commentaire, la publication et l'utilisateur·rice
    DislikeComment.findOne({ where:
        { user_dislike_comment_id: requete.auth.userId,
        post_dislike_comment_id: requete.params.id,
        comment_dislike_comment_id: requete.params.commentId }
    })
    .then((dislikecomment) => {
        // Si un dislike existe déjà, on le supprime
        if(dislikecomment) {
            DislikeComment.destroy({ where: 
                { user_dislike_comment_id: requete.auth.userId,
                post_dislike_comment_id: requete.params.id,
                comment_dislike_comment_id: requete.params.commentId }
            })
            .then(() => reponse.status(200).json({ message : "Dislike supprimé !"}))
            .catch(erreur => reponse.status(500).json({ erreur }));
        // Sinon, si le dislike n'existe pas, on le créé
        } else {
            DislikeComment.create({
                user_dislike_comment_id: requete.auth.userId,
                post_dislike_comment_id: requete.params.id,
                comment_dislike_comment_id: requete.params.commentId
            })
            .then(() => {
                LikeComment.findOne({ where:
                    { user_like_comment_id: requete.auth.userId,
                    post_like_comment_id: requete.params.id,
                    comment_like_comment_id: requete.params.commentId }
                })
                .then((likecomment) => {
                    if(likecomment) {
                        LikeComment.destroy({ where: 
                            { user_like_comment_id: requete.auth.userId,
                            post_like_comment_id: requete.params.id,
                            comment_like_comment_id: requete.params.commentId }
                        })
                        .then(() => reponse.status(200).json({ message : "Dislike créé et like supprimé !"}))
                        .catch(erreur => reponse.status(500).json({ erreur }));
                    }
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
            })
            .catch(erreur => reponse.status(500).json({ erreur }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};