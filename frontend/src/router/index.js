import { createRouter, createWebHistory } from 'vue-router'
import Connexion from '../views/Connexion.vue'
import Accueil from '../views/Accueil.vue'
import Publication from '../views/Publication.vue'
import ModifierPublication from '../views/ModifierPublication.vue'
import ModifierCommentaire from '../views/ModifierCommentaire.vue'
import MonProfil from '../views/MonProfil.vue'

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
    path: '/publication',
    name: 'publication',
    component: Publication
  },
  {
    path: '/publication/:id',
    name: 'modifierpublication',
    component: ModifierPublication
  },
  {
    path: '/commentaire/:id',
    name: 'modifiercommentaire',
    component: ModifierCommentaire
  },
  {
    path: '/profil',
    name: 'mon profil',
    component: MonProfil
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
