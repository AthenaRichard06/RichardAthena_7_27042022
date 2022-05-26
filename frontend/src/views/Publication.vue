<template>
    <Navigation />
    <section class="encadre">
        <h1 class="encadre__titre">{{ titre }}</h1>
        <!-- Validation des posts -->
        <p class="erreur" v-if="status == 'erreur_post'">Une erreur est survenue.</p>
        <p class="succes" v-if="status == 'succes_creation'">Votre publication a bien été créée.</p>
        <!-- Création de la publication -->
        <form class="formulaire">
            <textarea class="formulaire__input" type="text" name="texte" placeholder="Une nouvelle info' à nous partager ?"
                aria-label="Texte" v-model="texte" required></textarea>
        </form>
        <input id="photo" type="file" name="photo" @change="siPhotoAjoutee($event)"
            aria-label="Ajouter une image" /><br />
        <button @click="envoyerPublication()" class="bouton"
            :class="{ 'bouton--disabled': !validationChamps }">Publier</button>
    </section>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import FormData from 'form-data';

export default {
    name: "Publication",
    components: {
        Navigation
    },
    data: function () {
        return {
            titre: "Nouvelle publication",
            status: "",
            utilisateurId: "",
            texte: "",
            photo: "",
        }
    },
    // Computed = permet de recalculer uniquement si les valeurs des champs changent
    computed: {
        validationChamps: function () {
            if (this.texte != "") {
                return true;
            } else {
                return false;
            }
        }
    },
    // Methods = permet de calculer à chaque "apparition" de la page
    methods: {
        siPhotoAjoutee: function (event) {
            this.photo = event.target.files[0];
        },
        envoyerPublication: function () {
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));

            const formData = new FormData();
            formData.append("texte", this.texte);
            formData.append("user_post_id", donneesLocalStorage.userId);
            if (this.photo != "") {
                formData.append("photo", this.photo);
            }

            // Envoi des infos
            let envoiInfos = {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: "Bearer " + donneesLocalStorage.token
                }
            };

            fetch("http://localhost:3000/api/posts/", envoiInfos)
                .then((reponse) => {
                    if (reponse.status == 400 || reponse.status == 401 || reponse.status == 404) {
                        this.status = "erreur_post";
                    } else {
                        reponse.json().then(() => {
                            this.status = "succes_creation";
                            this.$router.push("/accueil");
                        })
                    }
                })
                .catch((erreur) => console.log(erreur));
        }
    },
    // Mounted = ce qu'il se passe quand on va se rendre sur la page
    mounted: function () {
        // Ici, si l'utilisateur·rice n'est pas connecté·e, alors iel est redirigé·e vers la page de connexion
        let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
        if (donneesLocalStorage == null) {
            this.$router.push("/");
            return;
        };
    }
}
</script>

<style scoped lang="scss">
.encadre__titre, .encadre__soustitre, input {
    margin-bottom: 12px;
}
</style>