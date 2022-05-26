<template>
    <Navigation />
    <section class="encadre">
        <!-- Affichage des titres selon les modes d'affichage ou de modification de profil -->
        <h1 class="encadre__titre" v-if="mode == 'afficherProfil'">Mon profil</h1>
        <h1 class="encadre__titre" v-else>Modifier mon profil</h1>
        <!-- Affichage des sous-titres selon le même mode que précédemment -->
        <div class="encadre__soustitre" v-if="mode == 'afficherProfil'">
            <p>Vous voulez modifier votre compte ?</p>
            <a class="encadre__action" @click="changerModification()">Modifiez-le ici</a>
        </div>
        <div class="encadre__soustitre" v-else>
            <p>Vous voulez voir votre profil ?</p>
            <a class="encadre__action" @click="changerAffichage()">Venez le consulter ici</a>
        </div>
        <!-- Validation des champs du formulaire -->
        <p class="erreur" v-if="!validationNom">Votre nom doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationPrenom">Votre prénom doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationFonction">Votre fonction doit comporter au moins deux lettres et ne pas avoir de caractères spéciaux ni de chiffres.</p>
        <p class="erreur" v-if="!validationEmail">Votre adresse mail n'est pas valide.</p>
        <p class="erreur" v-if="mode == 'afficherProfil' && erreurStatus == 'erreur_affichage'">Problème d'affichage de vos informations.</p>
        <p class="erreur" v-if="mode == 'modifierProfil' && erreurStatus == 'erreur_modification'">Problème lors de la modification de vos informations.</p>
        <p class="succes" v-if="mode == 'modifierProfil' && erreurStatus == 'succes_modification'">Votre profil a bien été mis à jour.</p>
        <!-- Formulaire -->
        <img class="carre" alt="Photo de profil" :src="photo" />
        <div id="modification" v-if="mode == 'modifierProfil'">
            <input id="photo_telechargee" type="file" name="photo_telechargee" @change="siPhotoAjoutee($event)" aria-label="Choisir une image" />
            <form class="formulaire">
                <input class="formulaire__input" type="text" name="nom" placeholder="Nom" aria-label="Nom" v-model.trim="nom" required />
                <input class="formulaire__input" type="text" name="prenom" placeholder="Prénom" aria-label="Prénom" v-model.trim="prenom" required />
            </form>
            <form class="formulaire">
                <input class="formulaire__input" type="text" name="fonction" placeholder="Fonction" aria-label="Fonction" v-model.trim="fonction" required />
            </form>
            <form class="formulaire">
                <input class="formulaire__input" type="text" name="biographie" placeholder="Biographie" aria-label="Biographie" v-model.trim="biographie" required />
            </form>
            <form class="formulaire">
                <input class="formulaire__input" type="email" name="email" placeholder="Email" aria-label="Email" v-model="email" required />
            </form>
        </div>
        <div id="affichage" v-else>
            <div class="affichage__section">
                <h2>{{ prenom }} {{ nom }}</h2>
            </div>
            <div class="affichage__section">
                <span>Adresse mail :</span>
                <p>{{ email }}</p>
            </div>
            <div class="affichage__section">
             <span>Fonction :</span>
                <p>{{ fonction }}</p>
            </div>
            <div class="affichage__section">
                <span>Biographie :</span>
                <p>{{ biographie }}</p>
            </div>
        </div>
        <!-- Boutons de modification et de suppression -->
        <div class="formulaire">
            <!-- Suppression -->
            <button class="bouton" v-if="mode == 'afficherProfil'" @click="supprimer()">
                <span>Supprimer mon compte</span>
            </button>
            <!-- Modifier le compte -->
            <button class="bouton" v-else :class="{ 'bouton--disabled':
            !validationChamps ||
            !validationNom ||
            !validationPrenom ||
            !validationFonction ||
            !validationEmail }" @click="modifier()">
                <span>Mettre à jour mon compte</span>
            </button>
        </div>
    </section>
</template>

<script>
import Navigation from "../components/Navigation.vue";

export default {
    name: "MonProfil",
    components: {
        Navigation
    },
    data: function () {
        return {
            mode: "afficherProfil",
            nom: "",
            prenom: "",
            fonction: "",
            biographie: "",
            photo: "",
            photo_telechargee: "",
            email: "",
            erreurStatus: null
        }
    },
    // Computed = permet de recalculer uniquement si les valeurs des champs changent
    computed: {
            validationChamps: function () {
                if (this.mode == "modifierProfil") {
                    if (this.prenom != "" && this.nom != "" && this.fonction != "" && this.email != "") {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (this.email != "") {
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
                let fonctionRegEx = new RegExp ("^[A-Za-zàâäéèêëïîôöùûüÿçæœÂÊÎÔÛÄËÏÖÜÀÆÇÉÈŒÙ -]{2,}$", "g");
                return fonctionRegEx.test(this.fonction);
            },
            validationEmail: function () {
                if (this.email == "") {
                    return true;
                }
                let emailRegEx = new RegExp ("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
                return emailRegEx.test(this.email);
            }
        },
        // Mounted = ce qu'il se passe quand on va se rendre sur la page
        mounted: function () {
            // Ici, si l'utilisateur·rice est déjà connecté·e, alors iel va directement sur la page de oonnexion
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
            if (donneesLocalStorage == null) {
                this.$router.push("/");
                return;
            };

            // Récupération des infos
            let recupInfos = {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + donneesLocalStorage.token
                }
            };

            let userId = donneesLocalStorage.userId;

            // Afficher le profil de l'utilisateur·rice
            fetch(`http://localhost:3000/api/profiles/${userId}`, recupInfos)
                .then((reponse) => {
                    reponse.json().then((donnees) => {
                        this.prenom = donnees.prenom;
                        this.nom = donnees.nom;
                        this.fonction = donnees.fonction;
                        this.biographie = donnees.biographie;
                        this.email = donnees.email;
                        this.photo = donnees.photo;
                    })
                })
                .catch((erreur) => console.log(erreur));
        },
        // Methods = permet de calculer à chaque "apparition" de la page
        methods: {
            changerModification: function () {
                this.mode = "modifierProfil";
            },
            changerAffichage: function () {
                this.mode = "afficherProfil";
            },
            siPhotoAjoutee: function (event) {
                this.photo_telechargee = event.target.files[0];
            },
            modifier: function () {
                let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
                const formData = new FormData();
                if (this.photo_telechargee != "") {
                    formData.append("photo", this.photo_telechargee);
                } else {
                    formData.append("photo", this.photo);
                }
                formData.append("prenom", this.prenom);
                formData.append("nom", this.nom);
                formData.append("email", this.email);
                formData.append("fonction", this.fonction);
                formData.append("biographie", this.biographie);

                // Envoi des infos
                let envoiInfos = {
                    method: "PUT",
                    body: formData,
                    headers: {
                        Authorization: "Bearer " + donneesLocalStorage.token
                    }
                };

                let userId = donneesLocalStorage.userId;

                fetch(`http://localhost:3000/api/profiles/${userId}`, envoiInfos)
                    .then((reponse) => {
                        if (reponse.status == 401) {
                            this.erreurStatus = "erreur_modification";
                        } else {
                            reponse.json().then(() => {
                                this.erreurStatus = "succes_modification";
                                location.reload();
                            })
                        }
                    })
                    .catch((erreur) => console.log(erreur));
            },
            supprimer: function () {
                let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
                // Suppression des infos
                let suppInfos = {
                    method: "DELETE",
                    headers: {
                        Authorization: "Bearer " + donneesLocalStorage.token
                    }
                };

                let userId = donneesLocalStorage.userId;

                fetch(`http://localhost:3000/api/profiles/${userId}`, suppInfos)
                    .then((reponse) => {
                        if (reponse.status == 400 || reponse.status == 401 || reponse.status == 403) {
                            this.erreurStatus = "erreur_modification";
                        } else {
                            localStorage.clear();
                            this.$router.push("/");
                        }
                    })
            }
        }
}
</script>

<style scoped lang="scss">
.encadre__titre, .encadre__soustitre {
    margin-bottom: 12px;
}

.affichage__section {
    margin-bottom: 15px;
    margin-top: 15px;
}

span {
    font-weight: 800;
}

h2, p, span {
    display: flex;
    justify-content: center;
}
</style>