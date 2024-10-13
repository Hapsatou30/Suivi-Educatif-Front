<template>
    <div>
      <!-- Canvas pour le graphique des notes -->
      <canvas ref="notesChartCanvas" width="700" height="400"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  
  const notesChartCanvas = ref(null);
  let notesChartInstance = null;
  Chart.register(...registerables);
  
  // Données statiques pour les notes (exemple)
  const subjects = ['Mathématiques', 'Sciences', 'Français', 'Histoire', 'Géographie'];
  const enfants = ['Amina Zahra Fall', 'Cherif Fall'];
  
  // Notes pour chaque enfant par matière
  const notesData = {
    'Amina Zahra Fall': [85, 90, 78, 88, 76],
    'Cherif Fall': [70, 75, 80, 85, 82],
  };
  
  const updateNotesChart = () => {
    const ctx = notesChartCanvas.value.getContext('2d');
  
    if (notesChartInstance) {
      notesChartInstance.destroy(); // Détruire l'instance existante avant de créer une nouvelle
    }
  
    // Préparer les ensembles de données
    const datasets = Object.keys(notesData).map((enfant, index) => ({
      label: enfant,
      data: notesData[enfant],
      backgroundColor: `rgba(${index * 50}, ${100 + index * 20}, 100, 0.5)`, // Couleurs dynamiques
    }));
  
    // Créer le graphique
    notesChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: subjects,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Notes' },
          },
          x: {
            title: { display: true, text: 'Matières' },
          }
        },
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Diagramme des Notes par Matière' }
        }
      }
    });
  };
  
  onMounted(() => {
    updateNotesChart();
  });
  </script>
  
  <style scoped>
  /* Styles pour le canvas */
  canvas {
    max-width: 600px; /* Limite la largeur maximale du canvas */
    margin: auto; /* Centre le graphique */
  }
  </style>
  