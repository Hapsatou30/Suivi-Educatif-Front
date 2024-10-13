

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
import GestionNotesAdmin from '@/views/Admin/gestionNotesAdmin.vue';
import NoteMatieres from '@/views/Admin/noteMatieres.vue';
import NotesMatiere from '@/views/Admin/notesMatiere.vue';
import DashboardProf from '@/views/Professeurs/dashboardProf.vue';
import SidebarProf from '@/components/sidebarProf.vue';
import TopBarProf from '@/components/topBarProf.vue';
import GestionAbsences from '@/views/Professeurs/gestionAbsences.vue';
import FichePresence from '@/views/Professeurs/fichePresence.vue';
import Matrice from '@/components/matrice.vue';
import EmploisDuTempsProf from '@/views/Professeurs/emploisTempsProf.vue';
import GestionCahierTexte from '@/views/Professeurs/gestionCahierTexte.vue';
import CahierTexteProf from '@/views/Professeurs/cahierTexteProf.vue';
import Planning from '@/views/Professeurs/planning.vue';
import GestionNotesProf from '@/views/Professeurs/gestionNotes.vue';
import NotesClasse from '@/views/Professeurs/notesClasse.vue';
import GestionCahierTexteAdmin from '@/views/Admin/gestionCahierTexteAdmin.vue';
import CahierTexteClasse from '@/views/Admin/cahierTexteClasse.vue';
import GestionEvaluationsAdmin from '@/views/Admin/gestionEvaluationsAdmin.vue';
import EvaluationsClasse from '@/views/Admin/evaluationsClasse.vue';
import GestionAbsencesAdmins from '@/views/Admin/gestionAbsencesAdmins.vue';
import AbsencesClasse from '@/views/Admin/absencesClasse.vue';
import SideBarParent from '@/components/sideBarParent.vue';
import DashboardParent from '@/views/Parents/dashboardParent.vue';
import TopBarParent from '@/components/topBarParent.vue';
import GestionNotes from '@/views/Parents/gestionNotes.vue';
import NoteParEnfant from '@/views/Parents/noteParEnfant.vue';
import GestionCahierDeTexte from '@/views/Parents/gestionCahierDeTexte.vue';
import CahierTexteEleve from '@/views/Parents/cahierTexteEleve.vue';
import GestionEmploisDuTemps from '@/views/Parents/gestionEmploisDuTemps.vue';
import EmploisEmploisEnfant from '@/views/Parents/emploisEmploisEnfant.vue';
import GestionAbsencesParent from '@/views/Parents/gestionAbsences.vue';
import AbsencesEnfant from '@/views/Parents/absencesEnfant.vue';
import GestionEvaluation from '@/views/Parents/gestionEvaluation.vue';
import EvaluationEnfant from '@/views/Parents/evaluationEnfant.vue';
import TabEvaluations from '@/components/tabEvaluations.vue';
import DiagrameCirculaire from '@/components/PieChart.vue';
import DiagrameBarre from '@/components/BarChart.vue';
import DiagrameBarreProf from '@/components/BarChart1.vue';
import DiagrameBarreParent from '@/components/AssiduiteChart.vue';

// Routes non protégées (accessible à tous)
const publicRoutes = [
  { path: '/', name: 'login', component: Login },
  { path: '/login', redirect: '/' },
  { path: '/affiche', name: 'affiche', component: Affiche},
  { path: '/widget', name: 'widget', component: Widget},
  { path: '/matrice', name: 'matrice', component: Matrice}, 
  { path: '/tab_evaluations', name: 'tab_evaluations', component: TabEvaluations},
  { path: '/diagramme_circulaire', name: 'diagramme_circulaire', component: DiagrameCirculaire},
  { path: '/diagramme_barre', name: 'diagramme_barre', component: DiagrameBarre},
  { path: '/diagramme_barre_prof', name: 'diagramme_barre_prof', component: DiagrameBarreProf},
  {path: '/diagramme_barre_parent', name: 'diagramme_barre_parent', component: DiagrameBarreParent},
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
  { path: '/gestion_notes_admin', name: 'gestion_notes_admin', component: GestionNotesAdmin },
  { path: '/notes_matieres/:anneeClasse_id', name: 'notes_matieres', component: NoteMatieres },
  { path: '/notes/:id_profMat/:matiere', name: 'notes', component: NotesMatiere },
  { path: '/gestion_cahier_texte_admin' , name: 'gestion_cahier_texte_admin', component: GestionCahierTexteAdmin},
  { path: '/cahier_texte_classe/:anneeClasse_id', name: 'cahier_texte_classe', component: CahierTexteClasse},
  { path: '/gestion_evaluations', name: 'gestion_evaluations', component: GestionEvaluationsAdmin},
  { path: '/evaluations_classe/:anneeClasse_id', name: 'evaluations_classe', component: EvaluationsClasse},
  { path: '/gestion_absences_admin', name: 'gestion_absences_admin', component: GestionAbsencesAdmins},
  { path: '/absences_classe_admin/:anneeClasse_id', name: 'absences_classe_admin', component: AbsencesClasse},

];

// Routes protégées pour les professeurs
const professorRoutes = [
  { path: '/dashboard_prof', name: 'dashboard_prof', component: DashboardProf },
  { path: '/sidebar_prof', name: 'sidebar_prof', component:SidebarProf},
  { path: '/topbar_prof', name: 'topbar_prof', component:TopBarProf},
  { path: '/gestion_absences', name: 'gestion_absences', component:GestionAbsences},
  {
    path: '/fiche_de_presence/:classeProf_id/:annee_classe_id/:nom_classe',
    name: 'fiche_de_presence',
    component:FichePresence
  },
  { path: '/emplois_du_temps_prof' , name: 'emplois_du_temps_prof', component:EmploisDuTempsProf},

  { path: '/gestion_cahier_texte' , name: 'gestion_cahier_texte', component: GestionCahierTexte},

  { path: '/cahier_texte_prof/:classeProf_id/:annee_classe_id/:nom_classe', name: 'cahier_texte_prof', component:CahierTexteProf},
  { path: '/planning', name: 'planning', component:Planning},
  
  { path: '/gestion_notes', name: 'gestion_notes', component: GestionNotesProf},

  { path: '/notes_classe/:classeProf_id/:annee_classe_id/:nom_classe' , name: 'notes_classe', component:NotesClasse},
];

//routes protégées pour les parents
const parentRoutes = [
  { path: '/sidebarParent', name: 'sidebarParent', component: SideBarParent},
  { path: '/topBarPArent', name: 'TopBarPArent', component: TopBarParent},
  { path: '/dashboardParent', name: 'dashboardParent', component: DashboardParent},
  { path: '/gestion_notes_parent' , name: 'gestion_notes_parent', component: GestionNotes},
  { path: '/notes_enfant/:classeEleve_id', name: 'notes_enfant', component:NoteParEnfant},
  { path: '/gestion_cahier_texte_parent', name: 'gestion_cahier_texte_parent', component:GestionCahierDeTexte},
  { path: '/cahier_texte_enfant/:classeEleve_id', name: 'cahier_texte_enfant', component:CahierTexteEleve},
  { path: '/gestion_emplois_du_temps_parent', name: 'gestion_emplois_du_temps_parent', component: GestionEmploisDuTemps},
  { path: '/emplois_du_temps_enfant/:classeEleve_id', name: 'emplois_du_temps_enfant', component: EmploisEmploisEnfant},
  { path: '/gestion_absences_parent', name:'gestion_absences_parent', component: GestionAbsencesParent},
  { path: '/absences_par_enfant/:classeEleve_id', name:'absences_par_enfant', component: AbsencesEnfant},
  { path: '/gestion_evaluation_parent', name:'gestion_evaluation_parent', component: GestionEvaluation},
  { path: '/evaluation_enfant/:classeEleve_id', name:'evaluation_enfant', component: EvaluationEnfant},
];

// Création du tableau des routes combinées
const routes = [
  ...publicRoutes,
  ...adminRoutes.map(route => ({ ...route, meta: { requiresAuth: true, role: 'admin' } })),
  ...professorRoutes.map(route => ({ ...route, meta: { requiresAuth: true, role: 'professeur' } })),
  ...parentRoutes.map(route => ({...route, meta: { requiresAuth: true, role: 'parent' } })), // Ajouter les routes parents si nécessaire
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