<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <affiche />
    <div class="row">
      <div class="col-6">
        <div class="widgets-container">
          <widget title="Cours" :number="classesCount" :iconSrc="vectorIconSrc" />
          <widget title="Matières" :number="matiereCount" :iconSrc="Icons" />
        </div>
        <div class="emploisDuTemps" style="background-color: white;">
          <h3>Emploi du temps d’aujourd’hui</h3>
          <tabEvaluations v-if="tableData.length > 0" :headers="[]" :data="tableData" class="custom-table" />

          <p v-else class="no-evaluations-message">Vous n'avez pas de cours aujourd'hui.</p>
        </div>
      </div>
      <div class="col-6" style="display: flex; flex-direction: column; justify-content: end;">
        <div class="planning" >
          <router-link to="/planning" class="addTeacher">
            <Icon icon="ei:plus" class="plus" />
            <h3>Programmer un devoir/examen</h3>
          </router-link>
        </div>

        <!-- Boucle sur les évaluations récupérées pour afficher un maximum de 2 cartes -->
<div class="list_planning" v-for="(evaluation, index) in evaluations.slice(0, 2)" :key="index">
  <div class="custom-card">
    <div class="card-header">
      <h3 class="card-title">{{ evaluation.matiere }}</h3>
      <span class="card-subtitle">{{ evaluation.type_evaluation }}</span>
    </div>
    <div class="card-body">
      <div class="card-body-left">
        <Icon icon="mdi:calendar-outline" class="icon" />
        {{ evaluation.date }}
      </div>
      <div class="card-body-right">
        <Icon icon="carbon:time" class="icon" />
        {{ evaluation.heure }}
      </div>
    </div>

  </div>
</div>

      </div>
    </div>
    <div class="row">
      <div class="chart-container1 col-6">
      <h5 style="text-align: center; margin-bottom: 5px;">Mes heures de cours par jour</h5>
        <BarChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getNbrClasseProf } from '@/services/ClasseProfs';
import { getEvaluationsParProf} from '@/services/Evaluations';
import { profile } from '@/services/AuthService';
import { getNbrMatiere } from '@/services/MatiereService';
import tabEvaluations from '@/components/tabEvaluations.vue';
import { geHoraireProf } from '@/services/HoraireService';
import { Icon } from '@iconify/vue';
import BarChart from '@/components/BarChart1.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import vectorIconSrc from '@/assets/Vector.svg';
import Icons from '@/assets/Icon.svg';

dayjs.locale('fr');
// Variables réactives
const classesCount = ref(0);
const matiereCount = ref(0);
const professeurId = ref('');
const tableData = ref([]);
const evaluations = ref([]);

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    // Récupérer l'ID du professeur connecté
    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
    }
    
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Fonction pour récupérer les données des classes du professeur
const fetchData = async () => {
  if (professeurId.value) {
    classesCount.value = await getNbrClasseProf(professeurId.value);
    matiereCount.value = await getNbrMatiere(professeurId.value);
  }
};


// Fonction pour récupérer l'emploi du temps du professeur
const fetchHoraireProf = async () => {
  try {
    const response = await geHoraireProf(professeurId.value);
    if (response.status === 200) {
      const horaires = response.données;

      // Filtrer les horaires pour le jour actuel
      const today = new Date();
      const jourActuel = today.toLocaleString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + today.toLocaleString('fr-FR', { weekday: 'long' }).slice(1);

      // Filtrer les horaires pour aujourd'hui
      tableData.value = horaires
        .filter(horaire => horaire.jour === jourActuel)
        .map(horaire => ({
          horaire: `${horaire.heure_debut} - ${horaire.heure_fin}`,
          matiere: horaire.nom_matiere,
          classe: horaire.classe
        }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
  }
};
// Fonction pour récupérer les évaluations du professeur
const fetchEvaluation = async () => {
  try {
    const response = await getEvaluationsParProf(professeurId.value);
    if (response.status === 200) {
      const evaluationsFutures = response.evaluations.filter(evaluation => dayjs(evaluation.date).isAfter(dayjs()));
      evaluationsFutures.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      evaluations.value = evaluationsFutures; // Mettre à jour la variable réactive avec les données récupérées
    } else {
      console.error('Erreur lors de la récupération des évaluations:', response.message);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des évaluations:', error);
  }
};

// Appelle la récupération des données une fois que le composant est monté
onMounted(async () => {
  await fetchProfile();
  await fetchData();
  await fetchHoraireProf();
  await fetchEvaluation();
});
</script>


<style scoped>
.main-content {
  margin-top: 120px;
}

.main-content .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 300px;
  margin-right: 50px;
  margin-top: 40px;
}

.main-content .row .col-6 {
  display: flex;
  flex-direction: column;
}

.main-content .row .col-6 .widgets-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  margin-bottom: 80px;
}

::v-deep .emploisDuTemps {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
}

::v-deep table {
  width: 100%;
  border-collapse: separate;
  /* Permet l'utilisation de border-spacing */
  border-spacing: 0 20px;
  /* 15px d'espace horizontal et 10px d'espace vertical */
}


::v-deep .custom-table th,
::v-deep .custom-table td {
  padding: 10px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  gap: 100px;
  margin-bottom: 10px;
  border: none;
  text-align: justify;
}

::v-deep .custom-table td:nth-child(-n+1),
::v-deep .custom-table th:nth-child(-n+1) {
  background-color: #F7AE00;
  width: 115px;
  border-radius: 8px;
  color: white
}

/* Style pour les dernières colonnes (par exemple les 2 dernières) */
::v-deep .custom-table td:nth-last-child(-n+1) {
  font-size: 13px;
  /* Petite police pour les dernières colonnes */
  color: #407CEE;
  /* Texte en bleu */
}

::v-deep .no-background {
  background-color: white;
  border-left: 3px solid transparent;
}

::v-deep .background {
  background-color: white;
}

.planning .addTeacher {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;
  margin-top: 30px;
  cursor: pointer;
  text-decoration: none;
  color: #F7AE00;
}

.planning .addTeacher h3 {
text-align: right;
  font-size: 24px;
  font-weight: bold;
}

.plus {
  font-size: 60px;
}
.list_planning{
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  margin-left: 32%;
}
.custom-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  font-family: "Poppins", sans-serif;
  max-width: 420px;
  background-color: white;
  text-align: center;
  
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
}

.card-subtitle {
  font-size: 16px;
  color: #777;
}

.card-body {
  display: flex;
  justify-content: space-between;
}

.card-body-left,
.card-body-right {
  width: 48%;
  padding: 10px;
  background-color: #F7AE00;
  border-radius: 8px;
  color: white;
}

.card-footer {
  text-align: right;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  background-color: #F7AE00;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #3f57a1;
}
.chart-container1{
  background-color: rgb(241, 241, 241);
  margin-right: 50px;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
}
</style>