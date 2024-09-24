

// Importation des fonctions nécessaires pour créer un routeur dans Vue 
import { createRouter, createWebHistory } from 'vue-router';

// Importation des composants  et views utilisés dans les routes
import Login from '@/views/login.vue';
import Dashboard from '@/views/Admin/dashboard.vue';
import Sidebar_admin from '@/components/sidebarAdmin.vue';
import Topbar_admin from '@/components/topbarAdmin.vue';
import Affiche from '@/components/affiche.vue';
import Widget from '@/components/widget.vue';
import Matiere from '@/views/Admin/matiere.vue';
import Professeur from '@/views/Admin/professeur.vue';


// Définition des routes de l'application
const routes = [
  // Route pour  la connexion
    { path: '/', name: 'login', component: Login },
    { path: '/login', redirect: '/' },

  //route pour les composants
   
    { path: '/sidebar_admin', name: 'sidebar_admin', component: Sidebar_admin},
    { path: '/topbar_admin', name: 'topbar_admin', component: Topbar_admin},
    { path: '/affiche', name: 'affiche', component: Affiche},
    { path: '/widget', name: 'widget', component: Widget},

    // Route pour les views admin
    { path: '/dashboard', name: 'dashboard', component: Dashboard},
    { path: '/matieres', name: 'matiere', component: Matiere},
    { path: '/professeurs', name: 'professeur', component: Professeur}

    
    
  
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