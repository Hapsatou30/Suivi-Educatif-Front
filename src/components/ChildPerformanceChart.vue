<template>
    <div>
      <canvas ref="performanceChart" width="400" height="200"></canvas>
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
  
  const renderChart = () => {
    const ctx = performanceChart.value.getContext('2d');
    // Détruire l'instance existante si elle existe
    if (performanceChart.instance) {
      performanceChart.instance.destroy();
    }
  
    performanceChart.instance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: props.subjects,
        datasets: [{
          label: 'Notes',
          data: props.scores,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6394',
            '#36A2EB',
            '#FFCE66',
            '#4BC0C2',
          ],
          borderColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6394',
            '#36A2EB',
            '#FFCE66',
            '#4BC0C2',
          ],
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
    renderChart();
  });
  </script>
  
  <style scoped>
  /* Ajoutez vos styles ici si nécessaire */
  </style>
  