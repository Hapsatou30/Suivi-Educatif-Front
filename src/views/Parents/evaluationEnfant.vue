<template>
  <sidebar_parent />
  <topbar_parent />
  <div class="main-content">
    <div class="head">
      <router-link to="/gestion_evaluation_parent">
        <Icon class="retour" icon="formkit:arrowleft" />
      </router-link>
      <h1 style="text-align: center; margin-left: 150px;">
        Les Évaluations à venir pour <span class="prenom">{{ prenom }}</span>
      </h1>
    </div>

    <!-- Section des cartes d'évaluation -->
    <div class="card-container row">
      <div v-if="evaluations.length > 0">
        <div 
          v-for="(evaluation, index) in evaluations" 
          :key="index" 
          class="evaluation-card col-12 col-sm-6 col-md-4" >
          <h4 class="date">{{ evaluation.date }}</h4>
          <div class="content">
            <p class="matiere">{{ evaluation.matiere }}</p>
            <p class="heure">{{ evaluation.heure }}</p>
          </div>
        </div>
      </div>
      
      <!-- Message s'il n'y a pas d'évaluations -->
      <div v-else>
        <p  class="alert alert-info">Aucune évaluation à venir pour le moment.</p>
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
const evaluationsSemaine = ref([]); // Évaluations de la semaine
const evaluationsAVenir = ref([]); // Évaluations après la semaine

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

      // Séparer les évaluations de la semaine et les autres à venir
      evaluationsSemaine.value = evaluations.value.filter(evaluation => {
        const evalDate = dayjs(evaluation.date);
        return evalDate.isBetween(now.startOf('week'), now.endOf('week'));
      });

      evaluationsAVenir.value = evaluations.value.filter(evaluation => {
        const evalDate = dayjs(evaluation.date);
        return evalDate.isAfter(now.endOf('week')); // Évaluations après cette semaine
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
    margin-left: 300px;
  }
  ::v-deep .card-container {
  gap: 16px; 
  margin-top: 20px;
  margin-left: 300px;
  margin-right: 50px;
}

::v-deep .evaluation-card {
  border-radius: 8px;
  padding: 16px;
  background-color: #E6F1FF;
  margin-bottom: 16px; 
  border-radius: 18px;
  width: 320px;
}

::v-deep .date {
  text-align: center;
  font-weight: bold;
}

::v-deep .content {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

::v-deep .matiere {
  text-align: left;
}

::v-deep .heure {
  text-align: right;
}

  </style>
  