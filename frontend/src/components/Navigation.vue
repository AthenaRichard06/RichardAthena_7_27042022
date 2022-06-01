<template>
    <nav>
        <div class="navbar">
            <router-link to="/accueil" title="Accueil">Accueil&nbsp;<i class="fa-solid fa-house"></i></router-link>  |
            <router-link to="/publication" title="Poster une nouvelle publication">Nouvelle&nbsp;publication&nbsp;<i class="fa-solid fa-images"></i></router-link>  |
            <router-link to="/profil" title="Mon profil">Mon&nbsp;profil&nbsp;<i class="fa-solid fa-user"></i></router-link>  |
            <router-link to="/" title="Déconnexion" @click="deconnexion">Déconnexion&nbsp;<i class="fa-solid fa-arrow-right-from-bracket"></i></router-link>
        </div>
        <div class="hamburger-menu">
            <input id="menu__toggle" type="checkbox" />
            <label class="menu__btn" for="menu__toggle">
                <span></span>
            </label>

            <ul class="menu__box">
                <li><router-link to="/accueil" title="Accueil">Accueil&nbsp;<i class="fa-solid fa-house"></i></router-link>  |</li>
                <li><router-link to="/publication" title="Poster une nouvelle publication">Nouvelle&nbsp;publication&nbsp;<i class="fa-solid fa-images"></i></router-link>  |</li>
                <li><router-link to="/profil" title="Mon profil">Mon&nbsp;profil&nbsp;<i class="fa-solid fa-user"></i></router-link>  |</li>
                <li><router-link to="/" title="Déconnexion" @click="deconnexion">Déconnexion&nbsp;<i class="fa-solid fa-arrow-right-from-bracket"></i></router-link></li>
            </ul>
        </div>
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

<style scoped lang="scss">
.hamburger-menu {
    visibility: hidden;
    display: none;
}

.navbar {
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: space-evenly;
    a {
        font-weight: bold;
        color: #2c3e50;
        text-decoration: none;
        &.router-link-exact-active {
            color: white;
        }
    }
}
#menu__toggle {
  opacity: 0;
}
#menu__toggle:checked + .menu__btn > span {
  transform: rotate(45deg);
}
#menu__toggle:checked + .menu__btn > span::before {
  top: 0;
  transform: rotate(0deg);
}
#menu__toggle:checked + .menu__btn > span::after {
  top: 0;
  transform: rotate(90deg);
}
#menu__toggle:checked ~ .menu__box {
  left: 0 !important;
}
.menu__btn {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  z-index: 1;
}
.menu__btn > span,
.menu__btn > span::before,
.menu__btn > span::after {
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: black;
  transition-duration: .25s;
}
.menu__btn > span::before {
  content: '';
  top: -8px;
}
.menu__btn > span::after {
  content: '';
  top: 8px;
}
.menu__box {
  display: block;
  position: fixed;
  top: 0;
  left: -100%;
  width: 300px;
  height: 100%;
  margin: 0;
  padding: 80px 0;
  list-style: none;
  background-color: #ECEFF1;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
  transition-duration: .25s;
}

a {
    text-decoration: none;
    color: black;
}

@media screen and (max-width: 550px) {
    .hamburger-menu {
        visibility: visible;
        display: inherit;
    }

    .navbar {
        visibility: hidden;
        display: none;
    }
}
</style>