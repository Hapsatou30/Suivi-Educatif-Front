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

// Enregistrement des composants Chart.js requis pour générer le graphique
Chart.register(...registerables);

// Définir les props attendus par le composant
const props = defineProps({
  maleCount: {
    type: Number, // Nombre de garçons
    required: true
  },
  femaleCount: {
    type: Number, // Nombre de filles
    required: true
  }
});

// Référence au canvas où le graphique sera dessiné
const pieChartCanvas = ref(null);

// Exécuter le code une fois que le composant est monté dans le DOM
onMounted(() => {
  // Récupérer le contexte 2D du canvas pour dessiner le graphique
  const ctx = pieChartCanvas.value.getContext('2d');
  
  // Accéder directement aux props sans utiliser `.value`
  const maleCount = props.maleCount; // Récupérer le nombre de garçons
  const femaleCount = props.femaleCount; // Récupérer le nombre de filles

  // Créer un nouveau graphique de type 'pie' (camembert)
  new Chart(ctx, {
    type: 'pie',
    data: {
      // Légendes des catégories (Garçons et Filles)
      labels: ['Garçons', 'Filles'],
      datasets: [{
        label: 'Répartition des élèves', // Label du dataset
        data: [maleCount, femaleCount], // Données pour chaque catégorie
        backgroundColor: [
        '#407CEE', // Couleur pour les garçons
        '#F7AE00'  // Couleur pour les filles
        ]

      }],
    },
    options: {
      responsive: true, // Rendre le graphique responsive
      plugins: {
        // Configuration de la légende
        legend: {
          position: 'bottom', // Positionner la légende en haut
        },
        // Titre du graphique
        title: {
          display: true, // Afficher le titre
          text: 'Répartition des élèves par sexe' // Texte du titre
        }
      }
    },
  });
});
</script>

<style scoped>
/* Styles pour le canvas */
canvas {
  max-width: 600px; /* Ajuster la largeur maximale du canvas */
  margin: auto; /* Centrer le graphique horizontalement */
}
</style>
