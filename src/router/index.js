

// Importation des fonctions nécessaires pour créer un routeur dans Vue 
import { createRouter, createWebHistory } from 'vue-router';

// Importation des composants  et views utilisés dans les routes
import Login from '@/views/login.vue';
import Dashboard from '@/views/Admin/dashboard.vue';


// Définition des routes de l'application
const routes = [
    // Route pour  la connexion
    { path: '/', name: 'login', component: Login },
    { path: '/login', redirect: '/' },
    { path: '/dashboard', name: 'dashboard', component: Dashboard}
  
];

// Création du routeur avec l'historique de navigation basé sur le mode HTML5 (sans le # dans les URL)
const router = createRouter({
  // Utilisation de createWebHistory pour activer le mode "historique" dans le navigateur
  history: createWebHistory(),

  // Assignation des routes définies précédemment
  routes
});

// Exportation du routeur pour qu'il puisse être utilisé dans l'application Vue
export default router;