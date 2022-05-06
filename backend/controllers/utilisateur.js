// Import de bcrypt pour hacher les mots de passe
const bcrypt = require ("bcrypt");

// Import du modèle utilisateurModel
const User = require ("../models/utilisateur");

// Import de jsonwebtoken pour créer et vérifier les token
const jsonwebtoken = require ("jsonwebtoken");

// Logiques métiers des différentes demandes CRUD
// Créer un compte
exports.creationCompte = (requete, reponse, next) => {
    // On hache le mot de passe et on le sale dix fois
    bcrypt.hash(requete.body.motdepasse, 10)
        .then(hash => {
            User.create({
                nom: requete.body.nom,
                prenom: requete.body.prenom,
                email: requete.body.email,
                motdepasse: hash,
                fonction: requete.body.fonction,
                biographie: requete.body.biographie,
                administrateur: requete.body.administrateur
            })
                .then(() => reponse.status(201).json({ message : "Utilisateur·rice créé·e !"}))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};

// Créer un compte administrateur·rice
exports.creationCompteAdmin = (requete, reponse, next) => {
    // On hache le mot de passe et on le sale dix fois
    bcrypt.hash(requete.body.motdepasse, 10)
        .then(hash => {
            User.create({
                nom: requete.body.nom,
                prenom: requete.body.prenom,
                email: requete.body.email,
                motdepasse: hash,
                fonction: requete.body.fonction,
                biographie: requete.body.biographie,
                administrateur: true
            })
                .then(() => reponse.status(201).json({ message : "Administrateur·rice créé·e !"}))
                .catch(erreur => reponse.status(400).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};

// Se connecter
exports.connexionCompte = (requete, reponse, next) => {
    // On vérifie si l'email utilisé existe dans la base de données
    User.findOne({ where: { email: requete.body.email }})
        .then(user => {
            // Si on ne le trouve pas
            if (!user) {
                return reponse.status(401).json({ erreur });
            }
            // Si on le trouve, on compare le hash du mot de passe utilisé avec celui du mot de passe dans la base de données
            bcrypt.compare(requete.body.motdepasse, user.motdepasse)
                .then(valid => {
                    if (!valid) {
                        return reponse.status(401).json({ erreur }); 
                    }
                    reponse.status(200).json({
                        userId: user.id,
                        // On ajoute ici le token qui contient l'Id de l'utilisateur·rice
                        token: jsonwebtoken.sign(
                            { userId: user.id },
                            process.env.Token,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(erreur => reponse.status(500).json({ erreur }));
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};

// Afficher le profil d'un·e utilisateur·rice
exports.affichageCompte = (requete, reponse, next) => {
    User.findOne({ where: { id: requete.params.id }})
        .then(user => reponse.status(200).json(user))
        .catch(erreur => reponse.status(404).json({ erreur }));
};

// Modifier le profil d'un·e utilisateur·rice
exports.modificationCompte = (requete, reponse, next) => {
    // On demande si un fichier accompagne la requête/modification
    const userObjet = requete.file ?
    {
    // Si oui, mise à jour complète du compte, à partir des éléments compris dans la requête du body
    ...requete.body,
    photo: `${requete.protocol}://${requete.get("host")}/images/${requete.file.filename}`
    // Si non, mise à jour du compte, à partir des autres éléments de la requête du body
    } : { ...requete.body };
    
    User.findOne({ where: { id: requete.params.id }})
    .then((user) => {
        // Si un fichier est fourni et qu'il ne s'agit pas de la photo de profil par défaut, on supprime l'image qui existe déjà
        if (requete.file && user.photo != "http://localhost:3000/images/default-profile.jpg") {
            const nomFichier = user.photo.split("/images/")[1];
            fileSystem.unlink(`images/${nomFichier}`, (erreur) => { erreur })
        }
        // On vérifie que l'Id de l'utilisateur est le même que l'Id de celui ou celle qui a crée le compte, sauf si c'est un·e administrateur·rice
        if (user.id !== requete.auth.userId && requete.params.administrateur == false) {
            return reponse.status(401).json({ erreur })
        }
        // On enregistre le compte
        User.update(
            { ...userObjet, id: requete.params.id },
            { where: { id: requete.params.id }}
        )
            .then(() => reponse.status(200).json({ message : "Profil modifié !"}))
            .catch(erreur => reponse.status(400).json({ erreur }));
    })
    .catch(erreur => reponse.status(500).json({ erreur }));
};

// Suppression d'un compte
exports.suppressionCompte = (requete, reponse, next) => {
    User.findOne({ where: { id: requete.params.id }})
        .then((user) => {
            // On vérifie si on trouve l'utilisateur·rice, sinon erreur
            if (!user) {
                return reponse.status(404).json({ erreur })
            }
            // On vérifie que l'Id de l'utilisateur·rice est le même que l'Id de celui ou celle qui a crée le compte, sauf si c'est un·e administrateur·rice
            if (user.id !== requete.auth.userId && requete.auth.user.administrateur == false) {
                return reponse.status(401).json({ erreur })
            }
            if (user.photo = "http://localhost:3000/images/default-profile.jpg") {
                User.destroy({ where: { id: requete.params.id }})
                    .then(() => reponse.status(200).json({ message : "Compte supprimé !"}))
                    .catch(erreur => reponse.status(400).json({ erreur }));
            } else {
                const nomFichier = user.photo.split("/images/")[1];
                // On supprime l'image dans le dossier, puis on supprime le compte de la base de données
                fileSystem.unlink(`images/${nomFichier}`, () => {
                    User.destroy({ where: { id: requete.params.id }})
                        .then(() => reponse.status(200).json({ message : "Compte supprimé !"}))
                        .catch(erreur => reponse.status(400).json({ erreur }));
                })
            }
        })
        .catch(erreur => reponse.status(500).json({ erreur }));
};