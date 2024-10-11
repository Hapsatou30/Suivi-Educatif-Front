<template>
  <sidebar_parent />
  <topbar_parent />
  <div class="main-content">
    <div class="head">
      <router-link to="/gestion_evaluation_parent">
        <Icon class="retour" icon="formkit:arrowleft" />
      </router-link>
      <h1 class="text-center flex-grow-1">
        Les Évaluations à venir pour <span class="prenom">{{ prenom }}</span>
      </h1>
    </div>

    <!-- Section des cartes d'évaluation -->
    <div class="card-container row">
      <div v-if="evaluations.length > 0">
        <div 
          v-for="(evaluation, index) in evaluations" 
          :key="index" 
          class="evaluation-card col-12 col-sm-6 col-md-4 d-flex flex-column align-items-center">
          <h4 class="date">{{ evaluation.date }}</h4>
          <div class="content">
            <p class="matiere">{{ evaluation.matiere }}</p>
            <p class="heure">{{ evaluation.heure }}</p>
          </div>
        </div>
      </div>
      
      <!-- Message s'il n'y a pas d'évaluations -->
      <div v-else class="col-12">
        <p class="alert alert-info text-center">Aucune évaluation à venir pour le moment.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { getDetailsEleve } from '@/services/ClasseEleve';
import { useRoute } from 'vue-router';
import { getEvaluationsParEleve } from '@/services/Evaluations';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.locale('fr');
dayjs.extend(isBetween);

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id);
const prenom = ref('');
const evaluations = ref([]); // Liste des évaluations

// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
  try {
    const response = await getDetailsEleve(classeEleve_id.value);
    if (response.status === 200) {
      prenom.value = response.données.prenom;
      await fetchEvaluations(); // Appel de la fonction pour récupérer les évaluations
    } else {
      console.error("Erreur lors de la récupération des détails de l'élève:", response.message);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'élève:", error);
  }
};

// Récupération des évaluations pour l'élève et filtrage
const fetchEvaluations = async () => {
  try {
    const response = await getEvaluationsParEleve(classeEleve_id.value);
    if (response.status === 200) {
      const now = dayjs(); // Date actuelle

      // Filtrer les évaluations à venir
      evaluations.value = response.evaluations.filter(evaluation => {
        const evalDate = dayjs(evaluation.date);
        return evalDate.isAfter(now); // Évaluations futures seulement
      });

    } else {
      console.error("Erreur lors de la récupération des évaluations:", response.message);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations:", error);
  }
};

onMounted(() => {
  fetchDetailsEleve();
});

</script>

<style scoped>
.main-content {
  overflow-x: hidden;
  margin-left: 300px;
  margin-right: 50px
}
.head{
  margin-left: 0;
}

.head {
  display: flex;
  align-items: center;
}

.prenom {
  color: #FFCD1E;
}

.retour {
  font-size: 30px;
  color: black;
  margin-left: 1rem;
}

.card-container {
  gap: 16px; 
  margin-top: 20px;
}

.evaluation-card {
  border-radius: 8px;
  padding: 16px;
  background-color: #E6F1FF;
  margin-bottom: 16px; 
  border-radius: 18px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centrer le contenu de la carte */
}

.date {
  text-align: center;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Prendre toute la largeur */
}

.matiere {
  text-align: left;
}

.heure {
  text-align: right;
}
@media (max-width: 480px) {
  .main-content{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  .head h1{
    font-size: 24px;
    margin-top: 25px;
    margin-left: -48px;
    text-align: center;
}
}
</style>
