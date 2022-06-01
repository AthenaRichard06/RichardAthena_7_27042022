<template>
    <section class="bloc__commentaire">
        <!-- Validation des commentaires -->
        <p class="erreur" v-if="status == 'erreur_commentaire'">Une erreur est survenue.</p>
        <p class="erreur" v-if="status == 'erreur_envoi'">Merci de compléter le commentaire avant de l'envoyer.</p>
        <p class="succes" v-if="status == 'success_commentaire'">Votre commentaire a bien été publié.</p>
        <!-- Structure du commentaire-->
        <form class="formulaire__commentaire">
            <input v-model="texte" class="formulaire__input" type="text" placeholder="Écrivez un commentaire..."
                name="commentaire" aria-label="commentaire">
            <i class="bouton fa-solid fa-paper-plane" :class="{ 'bouton--disabled': !validationChamps }"
                @click="envoyerCommentaire()" title="Envoyer"></i>
        </form>
    </section>
</template>

<script>
export default {
    name: "AjoutCommentaire",
    props: {
        publicationId: Number
    },
    data: function () {
        return {
            texte: "",
            status: "",
            userId: ""
        };
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
        envoyerCommentaire: function () {
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));

            const formData = new FormData();
            formData.append("texte", this.texte);
            formData.append("userId", donneesLocalStorage.userId);
            formData.append("postId", this.publicationId)

            // Envoi des infos
            let envoiInfos = {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: "Bearer " + donneesLocalStorage.token
                }
            };

            fetch("http://localhost:3000/api/comments/", envoiInfos)
                .then((reponse) => {
                    if (reponse.status == 401 || reponse.status == 404) {
                        this.status = "erreur_commentaire";
                    } else if (reponse.status == 400) {
                        this.status = "erreur_envoi";
                    } else {
                        reponse.json().then(() => {
                            this.status = "succes_commentaire";
                            window.location.reload();
                        });
                    }
                })
                .catch((erreur) => console.log(erreur));
        },
    },
}
</script>

<style scoped lang="scss">
.bloc__commentaire {
    margin-left: 12px;
}

.formulaire {
    &__commentaire {
        display: flex;
        justify-content: space-between;
    }

    &__input {
        padding: 6px;
        font-size: 0.8rem;
    }
}

.bouton {
    font-size: 14px;
    width: 10%;
    margin: 4px;
    padding: 8px;
    color: black;
    background-color: inherit;

    &:hover {
        color: #1976D2;
    }
}
</style>