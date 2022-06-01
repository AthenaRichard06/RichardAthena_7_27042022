<template>
    <section class="bloc__listecomm">
        <!-- Validation des commentaires -->
        <p class="erreur" v-if="status == 'erreur_commentaire'">Une erreur est survenue.</p>
        <p class="erreur" v-if="status == 'erreur_suppression'">Vous ne pouvez pas supprimer le commentaire.</p>
        <p class="succes" v-if="status == 'succes_commentaire'">Votre commentaire a bien été supprimé.</p>

        <!-- Structure d'un commentaire-->
        <div class="commentaire__entete" v-for="commentaire in commentaires" :key="commentaire.id">
            <p><b>{{ commentaire.prenom }} {{ commentaire.nom }}</b>,
                le {{ commentaire.createdAt }}
            </p>
            <div class="commentaire__texte">
                <p>{{ commentaire.texte }}</p>
                <div class="commentaire__texte__changement"
                    v-if="(commentaire.userId === utilisateurId) || (this.administrateur == true)">
                    <router-link :to="{ name: 'modifiercommentaire', params: { id: commentaire.id } }" title="Modifier">
                        <i class="bouton fa-solid fa-pen-to-square" title="Modifier"></i>
                    </router-link>
                    <i class="bouton fa-solid fa-trash" title="Suppression" @click="supprimerComm(commentaire.id)"></i>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "AfficherCommentaires",
    props: {
        publicationId: Number
    },
    data: function () {
        return {
            commentaires: [],
            status: ""
        };
    },
    // Mounted = ce qu'il se passe quand on va se rendre sur la page
    mounted: function () {
        let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));

        // Récupération des infos
        let recupInfos = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + donneesLocalStorage.token
            }
        };
        // Afficher les commentaires
        let publicationId = this.publicationId;
        this.administrateur = donneesLocalStorage.administrateur;
        this.utilisateurId = donneesLocalStorage.userId;

        fetch(`http://localhost:3000/api/comments/posts/${publicationId}`, recupInfos)
            .then((reponse) => {
                if (reponse.status == 404 || reponse.status == 500) {
                    this.status = "erreur_commentaire";
                } else {
                    reponse.json().then((donnees) => {
                        for (let i = 0; i < donnees.length; i++) {
                            this.commentaires.push({
                                id: donnees[i].id,
                                userId: donnees[i].user_comment_id,
                                texte: donnees[i].texte,
                                publicationId: donnees[i].post_comment_id,
                                prenom: donnees[i].user.prenom,
                                nom: donnees[i].user.nom,
                                createdAt: donnees[i].createdAt.slice(0, 10).split('-').reverse().join('/')
                            })
                        }
                    });
                }
            })
            .catch((erreur) => console.log(erreur));
    },
    // Methods = permet de calculer à chaque "apparition" de la page
    methods: {
        supprimerComm: function (commentaireId) {
            let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
            this.utilisateurId = donneesLocalStorage.userId;
            this.administrateur = donneesLocalStorage.administrateur;
            let publicationId = this.publicationId;
            console.log("l'utilisateur est administrateur ? " + this.administrateur);
            console.log("l'id de l'utilisateur est " + this.utilisateurId);
            console.log("l'id de la publication est " + publicationId);
            console.log("l'id du commentaire est " + commentaireId);

            let suppInfos = {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + donneesLocalStorage.token
                }
            };

            // Supprimer le commentaire
            fetch(`http://localhost:3000/api/comments/posts/${publicationId}/${commentaireId}`, suppInfos)
                .then((reponse) => {
                    if (reponse.status == 400 || reponse.status == 401 || reponse.status == 500) {
                        this.status = "erreur_commentaire";
                    } else {
                        this.status = "succes_commentaire";
                        window.location.reload();
                    }
                })
                .catch((erreur) => console.log(erreur));
        }
    }
}
</script>

<style scoped lang="scss">
.bloc__listecomm {
    margin-top: 12px;
}

.commentaire__entete {
    color: black;
    font-size: 14px;
    margin-left: 14px;
    margin-right: 14px;
    margin-top: 12px;
    margin-bottom: 12px;
    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 4px;
}

.commentaire__texte {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__changement {
        display: flex;
    }
}

p {
    overflow: hidden;
    font-size: 0.8rem;
}

.bouton {
    font-size: 14px;
    width: 10%;
    padding: 8px;
    color: black;
    background-color: inherit;

    &:hover {
        color: #1976D2;
    }
}
</style>