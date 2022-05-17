<template>
    <section class="encadre">
        <h1 class="encadre__titre">{{ titre }}</h1>
        <!-- Validation des posts -->
        <p class="erreur" v-if="status == 'erreur_post'">Une erreur est survenue.</p>
        <p class="succes" v-if="status == 'succes_suppression'">Publlication bien supprimée.</p>
        <!-- Structure d'un post -->
        <div class="encadre encadre-post" v-for="publication in publications" :key="publication.id">
            <div class="post__entete">
                <img class="cercle" alt="Photo de profil" :src="publication.photoUser" />
                <div class="post__entete__infos">
                    <b>{{ publication.prenom }} {{ publication.nom }}</b>,<br />
                    le {{ publication.createdAt }}
                </div>
                <div class="post__entete__changement">
                    <i class="bouton fa-solid fa-pen-to-square" title="Modifier"
                        v-show="(publication.userId === utilisateurId) || (this.administrateur === true)"
                        @click="modifierPost(publication.id)"></i>
                    <i class="bouton fa-solid fa-trash" title="Suppression"
                        v-show="(publication.userId === utilisateurId) || (this.administrateur === true)"
                        @click="supprimerPost(publication.id)"></i>
                </div>
            </div>
            <div class="post__body">
                <div class="post__body__structure">
                    <p class="post__texte">{{ publication.texte }}</p>
                    <img v-show="publication.image != ''" class="post__image" :src="publication.image"
                        alt="Image de la publication" />
                </div>
                <div class="post__body__picto">
                    <i class="fa-solid fa-heart"></i> 0 like
                    <i class="fa-solid fa-comment"></i> 0 commentaire
                </div>
                <AjoutCommentaire :publicationId="publication.id" />
                <ListeCommentaires :publicationId="publication.id" />
            </div>
        </div>
        <p class="pas_publication" v-show="zeroPublication">Il n'y a pas de publication pour le moment.</p>
    </section>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import AjoutCommentaire from "../components/AjoutCommentaire.vue";
import ListeCommentaires from "../components/ListeCommentaires.vue";

export default {
    name: 'AfficherPublications',
    components: {
        Navigation, AjoutCommentaire, ListeCommentaires
    },
    props: ['titre'],
    data: function () {
        return {
            status: "",
            publications: [],
            utilisateurId: "",
            administrateur: false,
            zeroPublication: false,
            like: 0
        }
    },
    // Mounted = ce qu'il se passe quand on va se rendre sur la page
    mounted: function () {
        // Ici, si l'utilisateur n'est pas connecté, alors il est redirigé vers la page de connexion
        let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
        if (donneesLocalStorage == null) {
            this.$router.push("/");
            return;
        }
        // Récupération des infos
        let recupInfos = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + donneesLocalStorage.token
            }
        };
        // Afficher les publications
        fetch("http://localhost:3000/api/posts/", recupInfos)
            .then((reponse) => {
                if (reponse.status == 401 || reponse.status == 500) {
                    this.status = "erreur_post";
                } else {
                    reponse.json().then((donnees) => {
                        if (donnees.length === 0) {
                            this.zeroPublication = true;
                        }
                        for (let i = 0; i < donnees.length; i++) {
                            this.publications.push({
                                id: donnees[i].id,
                                userId: donnees[i].user_post_id,
                                prenom: donnees[i].user.prenom,
                                nom: donnees[i].user.nom,
                                createdAt: donnees[i].createdAt.slice(0, 10).split('-').reverse().join('/'),
                                texte: donnees[i].texte,
                                image: donnees[i].photo,
                                photoUser: donnees[i].user.photo,
                                administrateur: donnees[i].user.administrateur
                            });
                        }
                    });
                }
            })
            .catch((erreur) => console.log(erreur));
        // Récupération de l'information sur l'administrateur
        this.utilisateurId = donneesLocalStorage.userId;
        fetch(`http://localhost:3000/api/profiles/${this.utilisateurId}`, recupInfos)
            .then((reponse) => {
                reponse.json().then((donnees) => {
                    this.administrateur = donnees.user.administrateur;
                });
            })
            .catch((erreur) => console.log(erreur));
    }
}
</script>

<style scoped lang="scss">
.encadre {
    &__titre {
        padding: 1rem;
    }

    &-post {
        padding: 0;
        margin-bottom: 1rem;
        background-color: #F1F2F3;
    }
}

.post {
    &__entete {
        position: relative;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        margin-left: 2.5%;
        padding-top: 12px;

        &__changement {
            position: absolute;
            right: 5px;
        }
    }

    &__body {
        font-size: 14px;

        &__structure {
            color: black;
        }

        &__picto {
            padding-bottom: 6px;
        }
    }

    &__texte {
        margin-top: 1rem;
        margin-left: 2.5%;
        white-space: pre;
    }

    &__image {
        margin-top: 12px;
        margin-bottom: 6px;
        margin-left: 2.5%;
        margin-right: 2.5%;
        max-width: 95%;
    }
}

.cercle {
    width: 3rem;
    object-fit: cover;
    margin-right: 1rem;
    border-radius: 25%;
}

.bouton {
    font-size: 14px;
    width: 5%;
    margin: 4px;
    padding: 8px;
    color: black;
    background-color: inherit;

    &:hover {
        color: #1976D2;
    }
}

.fa-heart {
    margin-left: 2.5%;
    transition: 0.4s;

    &:hover {
        cursor: pointer;
        color: red;
    }
}

.fa-comment {
    margin-left: 2.5%;
    transition: 0.4s;

    &:hover {
        cursor: pointer;
        color: #1976D2;
    }
}
</style>