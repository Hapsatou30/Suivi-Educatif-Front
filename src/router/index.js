

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
import ListeEleves from '@/views/Admin/listeEleves.vue';
import ClasseEleve from '@/views/Admin/classeEleve.vue';
import ElevesCLasse from '@/views/Admin/elevesCLasses.vue';
import GestionNotes from '@/views/Admin/gestionNotes.vue';
import NoteMatieres from '@/views/Admin/noteMatieres.vue';
import NotesMatiere from '@/views/Admin/notesMatiere.vue';
import DashboardProf from '@/views/Professeurs/dashboardProf.vue';

// Routes non protégées (accessible à tous)
const publicRoutes = [
  { path: '/', name: 'login', component: Login },
  { path: '/login', redirect: '/' },
  { path: '/affiche', name: 'affiche', component: Affiche},
  { path: '/widget', name: 'widget', component: Widget},

];

// Routes protégées pour les administrateurs
const adminRoutes = [
  { path: '/sidebar_admin', name: 'sidebar_admin', component: Sidebar_admin},
  { path: '/topbar_admin', name: 'topbar_admin', component: Topbar_admin},
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/annees', name: 'annees', component: Annee },
  { path: '/classes', name: 'classes', component: Classe },
  { path: '/annee_classes/:id', name: 'annee_classes', component: AnneeClasse },
  { path: '/list_classes/:id', name: 'list_classes', component: ListeClasse },
  { path: '/class_prof/:id', name: 'class_prof', component: ClassProf },
  { path: '/matieres', name: 'matiere', component: Matiere },
  { path: '/professeurs', name: 'professeur', component: Professeur },
  { path: '/prof_matiere/:id', name: 'prof_matiere', component: Professeur_matiere },
  { path: '/Emplois_du_temps/:id', name: 'emplois_du_temps', component: EmploisDuTemps },
  { path: '/liste_eleves', name: 'liste_eleves', component: ListeEleves },
  { path: '/classe_eleves/:id', name: 'classe_eleves', component: ClasseEleve },
  { path: '/eleves_classe/:id', name: 'eleves_classe', component: ElevesCLasse },
  { path: '/gestion_notes', name: 'gestion_notes', component: GestionNotes },
  { path: '/notes_matieres/:id', name: 'notes_matieres', component: NoteMatieres },
  { path: '/notes/:id', name: 'notes', component: NotesMatiere },
];

// Routes protégées pour les professeurs
const professorRoutes = [
  { path: '/dashboard_prof', name: 'dashboard_prof', component: DashboardProf },
];

// Création du tableau des routes combinées
const routes = [
  ...publicRoutes,
  ...adminRoutes.map(route => ({ ...route, meta: { requiresAuth: true, role: 'admin' } })),
  ...professorRoutes.map(route => ({ ...route, meta: { requiresAuth: true, role: 'professeur' } })),
];


// Création du routeur avec l'historique de navigation basé sur le mode HTML5 (sans le # dans les URL)
const router = createRouter({
  // Utilisation de createWebHistory pour activer le mode "historique" dans le navigateur
  history: createWebHistory(),

  // Assignation des routes définies précédemment
  routes
});


// Guard global pour vérifier l'authentification et les rôles
router.beforeEach((to, from, next) => {
  // Vérifie si l'utilisateur essaie de naviguer vers la même route
  if (to.path === from.path) {
    return next(); // Ne fais rien si on reste sur la même route
  }

  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  
  // Vérifie si la route nécessite une authentification
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: 'login' }); // Rediriger vers la page de connexion
    }

    // Vérifie si l'utilisateur a le rôle requis
    const requiredRole = to.meta.role;
    if (requiredRole && (!userRole || !userRole.includes(requiredRole))) {
      return next({ name: 'login' }); // Rediriger si l'utilisateur n'a pas le bon rôle
    }
  }

  // Autoriser la navigation
  next();
});



// Exportation du routeur pour qu'il puisse être utilisé dans l'application Vue
export default router;