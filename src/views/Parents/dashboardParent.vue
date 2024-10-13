<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <affiche />
        <div class="header">
            <div class="widgets-container">
                <widget title="Enfants" :number="enfantsCount" iconClass="openmoji:child" />
            </div>
            <div class="absence_jour">
                <h4>Absents du jour</h4>
                <div v-if="absencesDuJour.length === 0">
                    <p class="alert alert-info">Aucun enfant absent aujourd'hui.</p>
                </div>
                <div v-else class="cards-container">
                    <div v-for="absence in absencesDuJour" :key="absence.id" class="card">
                        <h3 class="card-title">{{ absence.classe_eleve.eleve.prenom }}</h3>
                        <div class="card-content">
                            <p class="left-paragraph">{{ absence.classe_prof.prof_matiere.matiere.nom }}</p>
                            <p class="right-paragraph">{{ absence.status }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="row">
      <div class="chart-container1 col-4">
      <h5 style="text-align: center; margin-bottom: 5px;">Assiduité des Enfants</h5>
        <AssiduiteChart />
      </div>
      <div  class="chart-container col-6">
    <h5 style="text-align: center; margin-bottom: 5px;">Performance Académique des Enfants</h5>
    <NotesChart />
  </div>
    </div>
        <div class="evaluations">
    <h2>Les évaluations de la semaine</h2>
    <div class="tableau1">
      <tabEvaluations 
        v-if="paginatedData.length > 0"
        :headers="['Jour', 'Matière', 'Devoir', 'Heure', 'Elève']"
        :data="paginatedData.map(({ jour, matiere, type_evaluation, heure, prenom }) => ({
          jour,
          matiere,
          type_evaluation,
          heure,
          prenom,
        }))"
      />

      <!-- Message affiché si la tableData est vide -->
      <p v-else class="alert alert-info">
        Aucune évaluation prévue pour cette semaine.
      </p>
    </div>

    <!-- Composant de pagination -->
    <pagination 
      class="pagination"
      v-if="tableData.length > pageSize"
      :totalItems="tableData.length"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChange="handlePageChange"
    />
  </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getNombreEnfant } from '@/services/ParentService';
import { profile } from '@/services/AuthService';
import { getAbsenceParents } from '@/services/AbsenceService';
import { getEvaluationsParParent } from '@/services/Evaluations';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import AssiduiteChart from '@/components/AssiduiteChart.vue';
import NotesChart from '@/components/NotesChart.vue';

dayjs.locale('fr');
const enfantsCount = ref(0);
const parentId = ref('');
const absencesDuJour = ref([]);
const tableData = ref([]); // Initialiser avec un tableau vide pour éviter undefined
const currentPage = ref(1); // Page actuelle
const pageSize = ref(5); // Nombre d'éléments par page

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;

        // Récupérer l'ID du parent connecté
        if (user && user.parent) {
            parentId.value = user.parent.id;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};

// Récupérer le nombre d'enfants
const fetchData = async () => {
    if (parentId.value) {
        enfantsCount.value = await getNombreEnfant(parentId.value);
    }
};

// Récupérer les absences du jour
const fetchAbsencesDuJour = async () => {
    try {
        if (parentId.value) {
            const response = await getAbsenceParents(parentId.value);
            const today = dayjs().format('YYYY-MM-DD'); // Récupérer la date d'aujourd'hui

            // Filtrer les absences pour celles qui correspondent à aujourd'hui
            absencesDuJour.value = response.data.filter(absence => absence.date_presence === today && absence.status === 'absent');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des absences:', error);
    }
};

// Récupérer les évaluations des enfants du parent
const fetchEvaluations = async () => {
    try {
        if (parentId.value) {
            const response = await getEvaluationsParParent(parentId.value);
            // console.log('Evaluation', response);

            // Filtrer les évaluations pour ne garder que celles de la semaine
            const evaluationsDeLaSemaine = response.filter(evaluation => {
                const dateEvaluation = dayjs(evaluation.date_evaluation);
                return dateEvaluation.isSame(dayjs(), 'week');
            }).map(evaluation => ({
                ...evaluation,
                jour: dayjs(evaluation.date_evaluation).format('dddd'), // Ajouter le jour au lieu de la date
            }));

            tableData.value = evaluationsDeLaSemaine; // Assigner les évaluations filtrées
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};



// Calculer les données à afficher pour la page actuelle
const paginatedData = computed(() => {
    if (!tableData.value || tableData.value.length === 0) return [];
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const dataToDisplay = tableData.value.slice(start, end);
    // console.log('Paginated Data:', dataToDisplay); // Ajoutez ce log pour déboguer
    return dataToDisplay;
});


// Fonction pour gérer le changement de page
const handlePageChange = (page) => {
    currentPage.value = page;
};

// Appels aux fonctions lors du montage du composant
onMounted(async () => {
    await fetchProfile();
    await fetchData();
    await fetchAbsencesDuJour();
    await fetchEvaluations(); // Appel pour récupérer les évaluations
});
</script>




<style scoped>
.main-content {
    margin-top: 120px;
    overflow-x: hidden;
}
.evaluations{
    margin-top: 80px;
}
.evaluations h2{
    text-align: start;
}

.widgets-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    margin-left: 300px;
    margin-right: 50px;
}

.absence_jour {
    margin-right: 50px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    /* Pour autoriser le retour à la ligne si l'espace est insuffisant */
    gap: 20px;
    /* Espace entre les cartes */
    justify-content: flex-start;
    /* Aligner les cartes à gauche */
    margin-top: 20px;
}

.card {
    flex: 1 1 300px;
    /* Chaque carte occupera au moins 300px et pourra s'agrandir si de la place est disponible */
    max-width: 300px;
}


.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #F7AE00;
}

.card-title {
    margin: 0 0 12px;
    font-size: 24px;
    color: white;
    text-align: center;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.left-paragraph {
    margin: 0;
    font-size: 18px;
    color: white;
}

.right-paragraph {
    margin: 0;
    font-size: 18px;
    color: red;
}
.tableau1 {
    margin-left: 300px;
    margin-right: 50px;
  }
  .chart-container1{
  margin-left: 300px;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
  width: 450px;
}
.chart-container{
margin-right: 50px;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
 
}
/* Media queries pour rendre la section responsive sur mobile */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start; /* Aligner les éléments à gauche sur mobile */
    margin: 0; /* Supprimer les marges latérales */
  }

  .widgets-container {
    flex-direction: column;
    align-items: flex-start; 
    justify-content: start;
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 0;

    
  }

  .absence_jour {
    margin: 20px 0; /* Ajouter un peu d'espace au-dessus et en-dessous sur mobile */
    width: 100%; /* Faire en sorte que l'élément prenne toute la largeur disponible */
  }

  .card {
    flex: 1 1 100%; /* Les cartes occuperont toute la largeur sur mobile */
    max-width: 100%; /* S'assurer qu'elles ne dépassent pas la largeur de l'écran */
  }

  .card-title {
    font-size: 20px; /* Réduire la taille du titre sur mobile */
  }

  .left-paragraph, .right-paragraph {
    font-size: 16px; /* Réduire la taille des paragraphes sur mobile */
  }
}

@media (max-width: 480px) {
 .evaluations{
    margin-top: 0;
}
.evaluations h2{
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0px;
}
    .tableau1 {
    margin-left: 0;
    margin-right: 0;
  }
    .main-content {
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}
  .card-title {
    font-size: 18px; /* Réduire encore plus la taille du titre pour les petits écrans */
  }

  .left-paragraph, .right-paragraph {
    font-size: 14px; /* Réduire la taille des paragraphes pour les petits écrans */
  }}
</style>