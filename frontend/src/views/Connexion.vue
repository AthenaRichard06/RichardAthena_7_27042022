<template>
    <section class="encadre">
        <!-- Ajout du logo de l'entreprise -->
        <img id="logo" alt="Logo de Groupomania" src="../assets/icon.png" />
        <!-- Affichage des titres selon les modes de création de compte ou de connexion -->
        <h1 class="encadre__titre" v-if="mode == 'connecter'">Connexion</h1>
        <h1 class="encadre__titre" v-else>Inscription</h1>
        <!-- Affichage des sous-titres selon le même mode que précédemment -->
        <p class="encadre__soustitre" v-if="mode == 'connecter'">
            Vous n'avez pas de compte ?
            <a class="encadre__action" @click="changerInscription()">Inscrivez-vous</a>
        </p>
        <p class="encadre__soustitre" v-else>
            Vous avez déjà un compte ?
            <a class="encadre__action" @click="changerConnexion()">Se connecter</a>
        </p>
        <!-- Validation des champs du formulaire -->
        <p class="erreur" v-if="!validationNom">Votre nom doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationPrenom">Votre prénom doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationFonction">Votre fonction doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationEmail">Votre adresse mail n'est pas valide.</p>
        <p class="erreur" v-if="!validationMotDePasse">Votre mot de passe doit comporter au moins huit caratères, avec une majuscule, une miniscule, un caractère spécial et deux chiffres.</p>
        <p class="erreur" v-if="mode == 'connecter' && status == 'erreur_connexion'">Adresse mail et/ou mot de passe incorrect.</p>
        <p class="erreur" v-if="mode == 'creation' && status == 'erreur_creation'">Adresse mail déjà utilisée.</p>
        <p class="erreur" v-if="status == 'erreur_tentatives'">Vous avez tenté trop de fois de vous connecter, votre compte est temporairement bloqué.</p>
        <!-- Formulaire -->
        <form class="formulaire" v-if="mode == 'creation'">
            <input class="formulaire__input" type="text" name="nom" placeholder="Nom" aria-label="Nom" v-model.trim="nom" required />
            <input class="formulaire__input" type="text" name="prenom" placeholder="Prénom" aria-label="Prénom" v-model.trim="prenom" required />
            <input class="formulaire__input" type="text" name="fonction" placeholder="Fonction" aria-label="Fonction" v-model.trim="fonction" required />
        </form>
        <form class="formulaire">
            <input class="formulaire__input" type="email" name="email" placeholder="Email" aria-label="Email" v-model="email" required />
        </form>
        <form class="formulaire">
            <input class="formulaire__input" type="password" name="motdepasse" placeholder="Mot de passe" aria-label="Mot de passe" autocomplete="off" v-model="motdepasse" required />
        </form>
        <!-- Boutons d'inscription et de connexion -->
        <div class="formulaire">
            <!-- Connexion -->
            <button class="bouton" v-if="mode == 'connecter'" :class="{ 'bouton--disabled': !validationChamps || !validationMotDePasse }" @click="connecter()">
                <span>Se connecter</span>
            </button>
            <!-- Création de compte -->
            <button class="bouton" v-else :class="{ 'bouton--disabled': !validationChamps || !validationMotDePasse }" @click="inscrire()">
                <span>Créer un compte</span>
            </button>
        </div>
    </section>
</template>

<script>
    export default {
        name: "Connexion",
        data: function () {
            return {
                mode: "connecter",
                nom: "",
                prenom: "",
                fonction: "",
                email: "",
                motdepasse: "",
                status: ""
            };
        },
        // Computed = permet de recalculer uniquement si les valeurs des champs changent
        computed: {
            validationChamps: function () {
                if (this.mode == "creation") {
                    if (this.prenom != "" && this.nom != "" && this.fonction != "" && this.email != "" && this.motdepasse != "") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (this.email != "" && this.motdepasse != "") {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            validationNom: function () {
                if (this.nom == "") {
                    return true;
                }
                let nomRegEx = new RegExp ("^[A-Za-zàâäéèêëïîôöùûüÿçæœÂÊÎÔÛÄËÏÖÜÀÆÇÉÈŒÙ -]{2,}$", "g");
                return nomRegEx.test(this.nom);
            },
            validationPrenom: function () {
                if (this.prenom == "") {
                    return true;
                }
                let prenomRegEx = new RegExp ("^[A-Za-zàâäéèêëïîôöùûüÿçæœÂÊÎÔÛÄËÏÖÜÀÆÇÉÈŒÙ -]{2,}$", "g");
                return prenomRegEx.test(this.prenom);
            },
            validationFonction: function () {
                if (this.fonction == "") {
                    return true;
                }
                let fonctionRegEx = new RegExp ("^[A-Za-zàâäéèêëïîôöùûüÿçæœÂÊÎÔÛÄËÏÖÜÀÆÇÉÈŒÙ ·-]{2,}$", "g");
                return fonctionRegEx.test(this.fonction);
            },
            validationEmail: function () {
                if (this.email == "") {
                    return true;
                }
                let emailRegEx = new RegExp ("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
                return emailRegEx.test(this.email);
            },
            validationMotDePasse: function () {
                if (this.motdepasse == "") {
                    return true;
                }
                let motdepasseRegEx = new RegExp ("^(?=.*[A-Z])(?=.*[a-z])(?=(.*?[0-9]){2,})(?=.*[-+!*$@%_]).{8,100}$", "g");
                return motdepasseRegEx.test(this.motdepasse);
            }
        },
        // Mounted = ce qu'il se passe quand on va se rendre sur la page
        mounted: function () {
            // Ici, si l'utilisateur est déjà connecté, alors il va directement sur la page d'accueil (qui n'est pas la page de connexion/création de compte)
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
            if (donneesLocalStorage) {
                this.$router.push("/accueil");
                return;
            };
        },
        // Methods = permet de calculer à chaque "apparition" de la page
        methods: {
            changerInscription: function () {
                this.mode = "creation";
            },
            changerConnexion: function () {
                this.mode = "connecter";
            },
            inscrire: function () {
                // Récupération des données
                let donnees = {
                nom: this.nom,
                prenom: this.prenom,
                fonction: this.fonction,
                email: this.email,
                motdepasse: this.motdepasse
                };
                // Choix de la méthode d'envoi vers le back
                let envoiDonnees = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(donnees)
                };
                // Envoi via fetch
                fetch("http://localhost:3000/api/auth/signup", envoiDonnees)
                    .then((reponse) => {
                        if (reponse.status == 500 || reponse.status == 401) {
                            this.status = "erreur_creation";
                            console.log(reponse.status);
                        } else if (reponse.status == 429) {
                            this.status = "erreur_tentatives";
                            console.log(reponse.status);
                        } else {
                            this.connecter();
                        }
                    })
                    .catch((erreur) => console.log(erreur));
            },
            connecter: function () {
                // Récupération des données
                let donnees = {
                email: this.email,
                motdepasse: this.motdepasse
                };
                // Choix de la méthode d'envoi vers le back
                let envoiDonnees = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(donnees)
                };
                // Envoi via fetch
                fetch("http://localhost:3000/api/auth/login", envoiDonnees)
                    .then((reponse) => {
                        if (reponse.status == 500 || reponse.status == 401) {
                            this.status = "erreur_connexion";
                        } else if (reponse.status == 429) {
                            this.status = "erreur_tentatives";
                        } else {
                            reponse.json().then((donnees) => {
                                localStorage.setItem("donnees", JSON.stringify(donnees));
                                this.$router.push("/accueil");
                            });
                        }
                    })
                    .catch((erreur) => console.log(erreur));
            }
        }
    }
</script>

<style lang="scss" scoped>
body {
    background-image: linear-gradient(62deg, #FFD7D7 0%, #FD2D01 100%);
}

#logo {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
}
</style>