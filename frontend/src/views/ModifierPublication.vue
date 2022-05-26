<template>
    <Navigation />
    <section class="encadre">
        <h1 class="encadre__titre">{{ titre }}</h1>
        <!-- Validation des posts -->
        <p class="erreur" v-if="status == 'erreur_post'">Une erreur est survenue.</p>
        <p class="succes" v-if="status == 'succes_modification'">Votre publication a bien été mise à jour.</p>
        <!-- Modification de la publication -->
        <form class="formulaire">
            <textarea class="formulaire__input" type="text" name="texte" placeholder="Une nouvelle info' à nous partager ?"
                aria-label="Texte" v-model="texte" required>{{ texte }}</textarea>
        </form>
        <img v-show="photoPubli != ''" class="post__image" :src="photoPubli"
            alt="Image de la publication" />
        <input id="photo_telechargee" type="file" name="photo_telechargee" @change="siPhotoAjoutee($event)" aria-label="Choisir une image" />
        <button @click="majPublication()" class="bouton"
            :class="{ 'bouton--disabled': !validationChamps }">Publier</button>
    </section>
</template>

<script>
import Navigation from "../components/Navigation.vue";

export default {
    name: "ModificationPublication",
    data: function () {
        return {
            titre: "Mise à jour de la publication",
            texte: "",
            photoPubli: "",
            photo_telechargee: "",
            status: ""
        }
    },
    components: {
        Navigation
    },
    // Computed = permet de recalculer uniquement si les valeurs des champs changent
    computed: {
        validationChamps: function () {
            if (this.texte !== "") {
                return true;
            } else {
                return false;
            }
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

        let publicationId = this.$route.params.id;

        // Récupération des infos
        let recupInfos = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + donneesLocalStorage.token
            }
        };
        
        fetch(`http://localhost:3000/api/posts/${publicationId}`, recupInfos)
            .then((reponse) => {
                if (reponse.status == 401 || reponse.status == 500) {
                    this.status = "erreur_post";
                } else {
                    reponse.json().then((donnees) => {   
                        this.texte = donnees.texte,
                        this.photoPubli = donnees.photo
                    })
                    .catch((erreur) => console.log(erreur));
                }
            })
            .catch((erreur) => console.log(erreur));
    },
    // Methods = permet de calculer à chaque "apparition" de la page
    methods: {
        siPhotoAjoutee: function (event) {
            this.photo_telechargee = event.target.files[0];
        },
        majPublication: function () {
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));

            const formData = new FormData();
            formData.append("texte", this.texte);
            if (this.photo_telechargee) {
                formData.append("photo", this.photo_telechargee);
            }

            let publicationId = this.$route.params.id; 

            // Envoi des infos
            let envoiInfos = {
                method: "PUT",
                body: formData,
                headers: {
                    Authorization: "Bearer " + donneesLocalStorage.token
                }
            };

            fetch(`http://localhost:3000/api/posts/${publicationId}`, envoiInfos)
                .then((reponse) => {
                    if (reponse.status == 401 || reponse.status == 500) {
                        this.status = "erreur_post";
                    } else {
                        reponse.json().then(() => {
                            this.status = "succes_modification",
                            this.$router.push("/accueil")
                        })
                    }
                })
        }
    }
}
</script>

<style scoped lang="scss">
.encadre__titre, .encadre__soustitre, input {
    margin-bottom: 12px;
}
</style>