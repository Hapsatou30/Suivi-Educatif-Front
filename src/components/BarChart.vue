<template>
  <div>
    <canvas ref="barChartCanvas" width="600" height="600"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

// Enregistrer les éléments nécessaires pour Chart.js
Chart.register(...registerables);

// Référence vers le canvas du graphique
const barChartCanvas = ref(null);

onMounted(() => {
  const ctx = barChartCanvas.value.getContext('2d');

  // Données statiques pour les présences et absences
  const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const presentes = [30, 28, 25, 32, 29];  // Exemples de présences
  const absentes = [5, 7, 10, 3, 6];      // Exemples d'absences
  const total = presentes.map((p, index) => p + absentes[index]);

  // Calculer les pourcentages pour chaque jour
  const presentesPourcentage = presentes.map((p, index) => (p / total[index]) * 100);
  const absentesPourcentage = absentes.map((a, index) => (a / total[index]) * 100);

  // Initialisation du graphique en barres
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels, // Jours de la semaine
      datasets: [
        {
          label: 'Présents (%)',
          data: presentesPourcentage, // Données de présences en pourcentage
          backgroundColor:'#F7AE00', // Couleur pour les présents
        },
        {
          label: 'Absents (%)',
          data: absentesPourcentage, // Données d'absences en pourcentage
          backgroundColor: '#407CEE', // Couleur pour les absents
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Présences et Absences par jour de la semaine',
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100, // L'axe Y va jusqu'à 100% pour les pourcentages
          ticks: {
            callback: function(value) {
              return value + '%'; // Affiche les pourcentages
            },
          },
        },
      },
    },
  });
});
</script>

<style scoped>
canvas {
  max-width: 800px; /* Augmenter la taille du graphique */
  margin: auto; /* Centre le graphique */
}
</style>
