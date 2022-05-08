// Import des modèles
const LikePost = require ("../models/likePublication");

// Logiques métiers des différentes demandes CRUD
// Like d'une publication
exports.likePublication = (requete, reponse, next) => {
    // On recherche un like selon la publication et l'utilisateur·rice
    LikePost.findOne({ where:
        { user_like_post_id: requete.body.userId,
        post_like_post_id: requete.params.id }
    })
    .then((likepost) => {
        if(likepost) {
            LikePost.destroy({ where: 
                { user_like_post_id: requete.body.userId,
                post_like_post_id: requete.params.id }
            })
            .then(() => res.status(200).json({message : "Like supprimé !"}))
            .catch(erreur => res.status(500).json({ erreur : "Problème de like existant" }));
        } else {
            LikePost.create({
                user_like_post_id: requete.body.userId,
                post_like_post_id: requete.params.id
            })
            .then(() => res.status(201).json({message : "Like créé !"}))
            .catch(erreur => res.status(500).json({ erreur : "Problème de création de like" }));
        }
    })
    .catch(erreur => reponse.status(500).json({ erreur : "Problème général" }));
};















//     .then(reponse => {
//         // Si aucun like n'a été fait par l'utilisateur·rice sur cette publication
//         if (reponse == null) {
//             // Si la demande est un like (+1), alors on ajouter le like
//             if (requete.body.like == 1) {
//                 LikePost.create({
//                     like_post: requete.body.like,
//                     user_like_post_id: requete.body.userId,
//                     post_like_post_id: requete.body.postId
//                 });
//                 Post.increment(
//                     { post_like: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(201).json ({ message : "Like enregistré !" })
//             // Si la demande est un dislike (-1), alors on ajouter le dislike
//             } else if (requete.body.like == -1) {
//                 LikePost.create({
//                     like_post: requete.body.like,
//                     user_like_post_id: requete.body.userId,
//                     post_like_post_id: requete.body.postId
//                 });
//                 Post.increment(
//                     { post_dislike: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(201).json ({ message : "Dislike enregistré !" })
//             }
//         // Sinon, si un like (+1) a déjà été fait
//         } else if (reponse.dataValues.like_post == 1) {
//             // Si l'utilisateur·rice fait de nouveau un like, alors on supprime le like pour revenir à 0
//             if (requete.body.like == 1) {
//                 LikePost.destroy({
//                     where: { [Op.and]: [
//                     { user_like_post_id: requete.body.userId },
//                     { post_like_post_id: requete.body.postId }
//                     ]}
//                 });
//                 Post.decrement(
//                     { post_like: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(200).json ({ message : "Like enlevé !" })
//             // Sinon, si l'utilisateur·rice fait un dislike, on met à jour les likes et dislikes
//             } else if (requete.body.like == -1) {
//                 LikePost.update(
//                     { like_post: -1 },
//                     { where: { [Op.and]: [
//                         { user_like_post_id: requete.body.userId },
//                         { post_like_post_id: requete.body.postId }
//                     ]}
//                 });
//                 Post.increment(
//                     { post_dislike: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 Post.decrement(
//                     { post_like: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(200).json ({ message : "Like enlevé et dislike mis !" })
//             }
//         // Sinon, si un dislike (-1) a déjà été fait
//         } else if (reponse.dataValues.like_post == -1) {
//             // Si l'utilisateur·rice fait de nouveau un dislike, alors on supprime le dislike pour revenir à 0
//             if (requete.body.like == -1) {
//                 LikePost.destroy({
//                     where: { [Op.and]: [
//                         { user_like_post_id: requete.body.userId },
//                         { post_like_post_id: requete.body.postId }
//                     ]}
//                 });
//                 Post.decrement(
//                     { post_dislike: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(200).json ({ message : "Dislike enlevé !" })
//             // Sinon, si l'utilisateur·rice fait un dislike, on met à jour les likes et dislikes
//             } else if (requete.body.like == 1) {
//                 LikePost.update(
//                     { like_post: 1 },
//                     { where: { [Op.and]: [
//                         { user_like_post_id: requete.body.userId },
//                         { post_like_post_id: requete.body.postId }
//                     ]}}
//                 );
//                 Post.increment(
//                     { post_like: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 Post.decrement(
//                     { post_dislike: 1 },
//                     { where: { id: requete.body.postId }}
//                 );
//                 reponse.status(200).json ({ message : "Dislike enlevé et like mis !" })
//             }
//         } 
//     })
//     .catch(erreur => reponse.status(400).json({ erreur : "mais putaaaaaain" }))
// };