

// Importation des fonctions nécessaires pour créer un routeur dans Vue 
import { createRouter, createWebHistory } from 'vue-router';

// Importation des composants  et views utilisés dans les routes
import Login from '@/views/login.vue';
import Dashboard from '@/views/Admin/dashboard.vue';
import Sidebar_admin from '@/components/sidebarAdmin.vue';
import Topbar_admin from '@/components/topbarAdmin.vue';
import Affiche from '@/components/affiche.vue';
import Widget from '@/components/widget.vue';

import Annee from '@/views/Admin/annee.vue';
import Classe from '@/views/Admin/classe.vue';

import Matiere from '@/views/Admin/matiere.vue';
import Professeur from '@/views/Admin/professeur.vue';
import Professeur_matiere from '@/views/Admin/profMatiere.vue';
import AnneeClasse from '@/views/Admin/anneeClasse.vue';
import ListeClasse from '@/views/Admin/classesOuvertes.vue';
import ClassProf from '@/views/Admin/classProf.vue';
import EmploisDuTemps from '@/views/Admin/emploisDuTemps.vue';
import listeEleves from '@/views/Admin/listeEleves.vue';
import ClasseEleve from '@/views/Admin/classeEleve.vue';

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

    { path: '/annees', name: 'annees', component: Annee},
    { path: '/classes', name: 'classes', component: Classe},
    { path: '/annee_classes/:id', name: 'annee_classes', component: AnneeClasse},
    { path: '/list_classes/:id', name: 'list_classes', component: ListeClasse},
    { path:'/class_prof/:id', name: 'class_prof', component: ClassProf},
    

    { path: '/matieres', name: 'matiere', component: Matiere},
    { path: '/professeurs', name: 'professeur', component: Professeur},
    { path: '/prof_matiere/:id', name: 'prof_matiere', component: Professeur_matiere },

    { path: '/Emplois_du_temps/:id', name: 'emplois_du_temps', component: EmploisDuTemps},

    { path: '/liste_eleves', name: 'liste_eleves', component: listeEleves},

    { path: '/classe_eleves/:id', name: 'classe_eleves', component: ClasseEleve},
  

    
    
  
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