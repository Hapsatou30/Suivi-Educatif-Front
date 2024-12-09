<template>
  <div>
    <canvas ref="performanceChart" :width="chartWidth" :height="chartHeight"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Props pour recevoir les données des performances
const props = defineProps({
  subjects: {
    type: Array,
    required: true,
  },
  scores: {
    type: Array,
    required: true,
  },
});

const performanceChart = ref(null);

// Variables pour la largeur et la hauteur du graphique
const chartWidth = ref(600);
const chartHeight = ref(500);

// Ajuster la taille du graphique en fonction de la fenêtre
const updateChartSize = () => {
  const width = window.innerWidth;
  chartWidth.value = width < 900 ? width - 20 : 900; // Réduire pour les petits écrans
  chartHeight.value = chartWidth.value / 2; // Hauteur proportionnelle à la largeur
};

// Fonction pour obtenir la couleur associée à une matière
const getMatiereColor = (matiere) => {
  const colorsFromStorage = JSON.parse(localStorage.getItem('classeColors')) || {};

  if (colorsFromStorage[matiere]) {
    return colorsFromStorage[matiere];
  }

  // Si la couleur n'existe pas dans le localStorage, renvoyer une couleur par défaut
  return '#cccccc'; // Couleur par défaut
};

const renderChart = () => {
  const ctx = performanceChart.value.getContext('2d');

  // Détruire l'instance existante si elle existe
  if (performanceChart.instance) {
    performanceChart.instance.destroy();
  }

  // Créer un tableau de couleurs basé sur les matières
  const backgroundColors = props.subjects.map(matiere => getMatiereColor(matiere));
  const borderColors = [...backgroundColors]; // On peut utiliser les mêmes couleurs pour les bordures

  performanceChart.instance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.subjects,
      datasets: [{
        label: 'Notes',
        data: props.scores,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Graphique des performances par matière',
        },
      },
    },
  });
};

// Observer les props et redessiner le graphique quand elles changent
watch(() => [props.subjects, props.scores], () => {
  renderChart();
});

// Monté pour dessiner le graphique initial
onMounted(() => {
  updateChartSize(); // Mettre à jour la taille du graphique au moment du montage
  renderChart();
});

// Ajouter un écouteur d'événements pour le redimensionnement de la fenêtre
window.addEventListener('resize', updateChartSize);
</script>

<style scoped>
/* Styles pour le canvas */
canvas {
  max-width: 100%; /* Utiliser 100% pour une adaptabilité maximale */
  margin: auto; /* Centre le graphique */
}
</style>
