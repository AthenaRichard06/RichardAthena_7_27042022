import { createRouter, createWebHistory } from 'vue-router'
import Connexion from '../views/Connexion.vue'
import Accueil from '../views/Accueil.vue'
import MonProfil from '../views/MonProfil.vue'
import Utilisateurs from '../views/Utilisateurs.vue'

const routes = [
  {
    path: '/',
    name: 'connexion',
    component: Connexion
  },
  {
    path: '/accueil',
    name: 'accueil',
    component: Accueil
  },
  {
    path: '/profil',
    name: 'mon profil',
    component: MonProfil
  },
  {
    path: '/utilisateurs',
    name: 'utilisateurs',
    component: Utilisateurs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
