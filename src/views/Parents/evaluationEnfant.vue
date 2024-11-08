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
    <div class="card-container row ">
  <div v-if="evaluations.length > 0" class="ligne">
    <div 
      v-for="(evaluation, index) in evaluations" 
      :key="index" 
      class="matiere-card  " 
      :style="{ backgroundColor: getMatiereColor(evaluation.matiere) }">
      <h4 class="date">{{ evaluation.formattedDate }}</h4>
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

      // Filtrer les évaluations futures, les trier par date, et formater la date
      evaluations.value = response.evaluations
        .filter(evaluation => {
          const evalDate = dayjs(evaluation.date);
          return evalDate.isAfter(now); // Évaluations futures seulement
        })
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))) // Trier par date croissante
        .map(evaluation => ({
          ...evaluation,
          formattedDate: dayjs(evaluation.date).format('DD/MM/YYYY'), // Format français
        }));

    } else {
      console.error("Erreur lors de la récupération des évaluations:", response.message);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations:", error);
  }
};


 // Fonction pour obtenir la couleur associée à une matière
 const getMatiereColor = (matiere) => {
      const colorsFromStorage = JSON.parse(localStorage.getItem('classeColors')) || {};
  
      if (colorsFromStorage[matiere]) {
          return colorsFromStorage[matiere];
      }
  
      // Si la couleur n'existe pas dans le localStorage, renvoyer une couleur par défaut
      return '#cccccc'; // Vous pouvez changer cette couleur par une autre si nécessaire
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
.ligne {
  display: flex;
  flex-wrap: wrap; /* Permet aux cartes de passer à la ligne suivante si l'espace est insuffisant */
  gap: 16px; /* Espace entre les cartes */
  margin-top: 20px;
  justify-content: space-between; /* Distribue les cartes équitablement */
}

.matiere-card {
  flex: 1 1 calc(33.33% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
  background-color: #cccccc; /* Juste pour la visibilité */
}

.matiere-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.evaluation-card {
  border-radius: 8px;
  padding: 16px;
  background-color: #E6F1FF;
  margin-bottom: 16px; 
  border-radius: 18px;
}

.date {
  text-align: center;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Prendre toute la largeur */
  color: white;
}

.matiere {
  text-align: left;
  color: white;
}

.heure {
  text-align: right;
  color: white;
}
@media (max-width: 992px) {
  .main-content{
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
  }
  .head h1{
    font-size: 24px;
    margin-top: 25px;
    margin-left: 0;
    text-align: center;
  }
  .matiere-card {
    flex: 1 1 calc(50% - 16px); /* Passe à 2 cartes par ligne sur des écrans plus petits */
  }
}
@media (max-width: 576px) {
  .main-content{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0;
  }
  .head h1{
    font-size: 24px;
    margin-top: 25px;
    margin-left: -48px;
    text-align: center;
}
.matiere-card {
    flex: 1 1 calc(100% - 16px); /* Passe à 1 carte par ligne sur des petits écrans */
  }
}
</style>
