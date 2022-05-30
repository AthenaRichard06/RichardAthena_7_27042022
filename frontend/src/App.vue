<template>
  <router-view></router-view>
</template>

<script>
  export default {
    name: "App",
    components: {}
  }
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');

* {
  font-family: "Lato", sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 100%;
  overflow: hidden;
  white-space: break-spaces;
}

body {
  background-image: linear-gradient(62deg, #FFD7D7 0%, #FD2D01 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
}

img {
  max-width: 100%;
  border-radius: 8px;
}

.bouton {
  background: #2196F3;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: 0.4s background-color;
  &:hover {
    cursor: pointer;
    background: #1976D2;
  }
  &--disabled {
    background: #CECECE;
    color: #ECECEC;
    &:hover {
      cursor: not-allowed;
      background: #CECECE;
    }
  }
}

.erreur {
  color: red;
  font-size: 12px;
}

.succes {
  color: green;
  font-size: 12px;
}

.formulaire {
  display: flex;
  flex-wrap: wrap;
  margin: 16px 0px;
  gap: 16px;
  &__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    color: black;
    font-weight: 400;
    font-size: 16px;
    flex: 1;
    min-width: 100px;
    &::placeholder {
      color: #aaaaaa;
    }
  }
}

.fichier {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.encadre {
    max-width: 100%;
    width: 540px;
    background: white;
    border-radius: 16px;
    padding: 32px;
    &__titre {
        text-align: center;
        font-weight: 700;
    }
    &__soustitre {
        text-align: center;
        font-weight: 400;
        color: #666;
    }
    &__action {
        color: #2196F3;
        text-decoration: underline;
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
