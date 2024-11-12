 <template>
  <div>
    <!-- Canvas pour le graphique en forme de camembert -->
    <canvas ref="pieChartCanvas" width="400" height="400"></canvas>
  </div>
</template>

<script setup>
// Importation des fonctions nécessaires de Vue et Chart.js
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { getEleves } from '@/services/EleveService'; // Importation de votre service

// Enregistrement des composants Chart.js requis pour générer le graphique
Chart.register(...registerables);

// Références pour stocker les données de comptage par genre
const elevesCountMale = ref(0);
const elevesCountFemale = ref(0);

// Référence au canvas où le graphique sera dessiné
const pieChartCanvas = ref(null);

// Fonction pour récupérer les élèves et les compter par genre
const fetchElevesData = async () => {
  const eleves = await getEleves();
  // console.log('Élèves récupérés :', eleves); // Vérifiez les élèves récupérés

  if (Array.isArray(eleves)) {
    // Convertir les genres en minuscules pour le filtrage
    elevesCountMale.value = eleves.filter(eleve => eleve.genre.toLowerCase() === "masculin").length;
    elevesCountFemale.value = eleves.filter(eleve => eleve.genre.toLowerCase() === "feminin").length;

    // Appel pour dessiner le graphique après que les données aient été récupérées
    drawChart();
  } else {
    console.error('Les données des élèves ne sont pas au format attendu :', eleves);
  }
};

// Fonction pour dessiner le graphique avec Chart.js
const drawChart = () => {
  const ctx = pieChartCanvas.value.getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Garçons', 'Filles'],
      datasets: [{
        label: 'Répartition des élèves',
        data: [elevesCountMale.value, elevesCountFemale.value],
        backgroundColor: ['#407CEE', '#F7AE00']
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Répartition des élèves par sexe'
        }
      }
    }
  });
};

// Appel de la fonction une fois que le composant est monté
onMounted(() => {
  fetchElevesData();
});
</script>

<style scoped>
/* Styles pour le canvas */
canvas {
  max-width: 600px;
  margin: auto;
}
@media (max-width: 576px) {
  canvas {
  max-width: 100%;
 
  margin: auto;
}
}

</style>
