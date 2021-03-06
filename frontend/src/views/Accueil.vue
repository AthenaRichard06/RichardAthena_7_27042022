<template>
  <Navigation />
  <section class="encadre">
    <h1 class="encadre__titre">{{ titre }}</h1>
    <!-- Validation des posts -->
    <p class="erreur" v-if="status == 'erreur_post'">Une erreur est survenue.</p>
    <!-- Structure d'un post -->
    <div class="encadre encadre-post" v-for="publication in publications" :key="publication.id">
      <div class="post__entete">
        <img class="cercle" alt="Photo de profil" :src="publication.photoUser" />
        <div class="post__entete__infos">
          <b>{{ publication.prenom }} {{ publication.nom }}</b>,<br />le {{ publication.createdAt }}
        </div>
        <div class="post__entete__changement"
          v-if="publication.userId === utilisateurId || this.administrateur == true">
          <router-link :to="{ name: 'modifierpublication', params: { id: publication.id } }" title="Modifier">
            <i class="bouton fa-solid fa-pen-to-square" title="Modifier"></i>
          </router-link>
          <i class="bouton fa-solid fa-trash" title="Suppression" @click="supprimer(publication.id)"></i>
        </div>
      </div>
      <div class="post__body">
        <div class="post__body__structure">
          <p class="post__texte">{{ publication.texte }}</p>
          <img v-show="publication.image != ''" class="post__image" :src="publication.image"
            alt="Image de la publication" />
        </div>
        <div class="post__body__picto">
          <i class="fa-solid fa-heart" @click="liker(publication.id)"></i> {{ likeposts[publication.id] }} {{ publicationId }}
          <i class="fa-solid fa-comment"></i> {{ commentaireposts[publication.id] }}
        </div>
        <AfficherCommentaires :publicationId="publication.id" :administrateur="this.administrateur" />
        <AjoutCommentaire :publicationId="publication.id" />
      </div>
    </div>
    <p class="pas_publication" v-show="zeroPublication">Il n'y a pas de publication pour le moment.</p>
  </section>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import AfficherCommentaires from "../components/AfficherCommentaires.vue";
import AjoutCommentaire from "../components/AjoutCommentaire.vue";

export default {
  name: "Accueil",
  components: {
    Navigation, AfficherCommentaires, AjoutCommentaire
  },
  data: function () {
    return {
      titre: "Fil d'actualité",
      status: "",
      publications: [],
      likeposts: [],
      commentaireposts: [],
      publicationId: "",
      utilisateurId: "",
      administrateur: null,
      zeroPublication: false,
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

    // Récupération des infos
    let recupInfos = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + donneesLocalStorage.token
      }
    };

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
                photoUser: donnees[i].user.photo
              });

              let id = donnees[i].id;

              // Compter les likes d'une publication
              fetch(`http://localhost:3000/api/likes/posts/${id}`, recupInfos)
                .then((reponse) => {
                  reponse.json().then((likes) => {
                    this.likeposts[id] = likes.length;
                  })
                })
                .catch((erreur) => console.log(erreur));

              // Compter les commentaires d'une publication
              fetch(`http://localhost:3000/api/comments/posts/${id}`, recupInfos)
                .then((reponse) => {
                  reponse.json().then((comm) => {
                    this.commentaireposts[id] = comm.length;
                  })
                })
                .catch((erreur) => console.log(erreur));
            }
          })
        }
      })
      .catch((erreur) => console.log(erreur));

    // Récupération de l'information sur l'administrateur·rice
    this.utilisateurId = donneesLocalStorage.userId;
    this.administrateur = donneesLocalStorage.administrateur;
  },
  // Methods = permet de calculer à chaque "apparition" de la page
  methods: {
    supprimer: function (publicationId) {
      let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));
      let suppInfos = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + donneesLocalStorage.token
        }
      };
      // Supprimer la publication
      fetch(`http://localhost:3000/api/posts/${publicationId}`, suppInfos)
        .then((reponse) => {
          if (reponse.status == 401 || reponse.status == 400 || reponse.status == 404) {
            this.status = "erreur_post";
          } else {
            console.log(reponse);
            this.status = "succes_suppression";
            window.location.reload();
          }
        })
        .catch((erreur) => console.log(erreur));
    },
    liker: function (publicationId) {
      let donneesLocalStorage = JSON.parse(localStorage.getItem("donnees"));

      const formData = new FormData();
      formData.append("userId", donneesLocalStorage.userId);
      formData.append("postId", this.id);

      // Envoi des infos
      let envoiInfos = {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + donneesLocalStorage.token
        }
      };

      fetch(`http://localhost:3000/api/likes/posts/${publicationId}`, envoiInfos)
        .then(() => {
          window.location.reload();
        })
        .catch((erreur) => console.log(erreur));
    }
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
    font-size: 15px;
    display: flex;
    align-items: center;
    margin-left: 2.5%;
    padding-top: 12px;

    &__changement {
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
      margin-top: 12px;
    }
  }

  &__texte {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 2.5%;
    font-size: 15px;
  }

  &__image {
    max-width: 95%;
    display: flex;
    margin: auto;
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