<template>
    <div>
      <canvas ref="pieChartCanvas" width="400" height="400"></canvas>
    </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  Chart.register(...registerables);
  
  // Définir les props
  const props = defineProps({
    maleCount: {
      type: Number,
      required: true
    },
    femaleCount: {
      type: Number,
      required: true
    }
  });
  
  const pieChartCanvas = ref(null);
  
  onMounted(() => {
  const ctx = pieChartCanvas.value.getContext('2d');
  
  // Utilisez les valeurs primitives
  const maleCount = props.maleCount;
const femaleCount = props.femaleCount;


  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Garçons', 'Filles'],
      datasets: [{
        label: 'Répartition des élèves',
        data: [maleCount, femaleCount], // Utilisez les valeurs primitives ici
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // couleur pour les garçons
          'rgba(255, 99, 132, 0.6)'  // couleur pour les filles
        ],
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Répartition des élèves par sexe'
        }
      }
    },
  });
});

  </script>
  
  <style scoped>
  canvas {
    max-width: 600px; /* Ajustez la taille selon vos besoins */
    margin: auto; /* Centre le graphique */
  }
  </style>
  