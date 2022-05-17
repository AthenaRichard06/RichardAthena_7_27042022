<template>
    <nav>
        <router-link to="/accueil" title="Accueil">Accueil <i class="fa-solid fa-house"></i></router-link>  |
        <router-link to="/profil" title="Mon profil">Mon profil <i class="fa-solid fa-user"></i></router-link>  |
        <router-link to="/utilisateurs" title="Mes collègues">Utilisateur·rices <i class="fa-solid fa-users"></i></router-link>  |
        <router-link to="/" title="Déconnexion" @click="deconnexion">Déconnexion <i class="fa-solid fa-arrow-right-from-bracket"></i></router-link>
    </nav>
</template>

<script>
export default {
    name: "Navigation",
    methods: {
        deconnexion: function () {
            localStorage.clear();
            this.$router.push("/");
        }
    }
}
</script>

<style lang="scss" scoped>
nav {
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-around;
    a {
        font-weight: bold;
        color: #2c3e50;
        text-decoration: none;
        &.router-link-exact-active {
            color: white;
        }
    }
}
</style>