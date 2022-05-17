<template>
  <Navigation />
  <AfficherPublications :titre="titre" />
</template>

<script>
import Navigation from "../components/Navigation.vue";
import AfficherPublications from "../components/AfficherPublications.vue";

export default {
  name: "Accueil",
  components: {
    Navigation, AfficherPublications
  },
  data: function () {
    return {
      titre: "Fil d'actualités"
    }
  }
}
</script>

<style scoped lang="scss">
</style>