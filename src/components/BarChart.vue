<template>
  <div>
    <!-- Élément canvas pour afficher le graphique -->
    <canvas ref="barChartCanvas" width="600" height="600"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { getElevesCount } from '@/services/EleveService';
import { getAbsencesSemaine } from '@/services/AbsenceService';

// Enregistrer les éléments nécessaires pour Chart.js
Chart.register(...registerables);

// Référence vers le canvas du graphique
const barChartCanvas = ref(null);
const absences = ref([]);  // Référence pour stocker les données des absences
const presentes = ref([]);  // Référence pour stocker les données des présents
const absentes = ref([]);   // Référence pour stocker les données des absents

// Fonction pour récupérer les absences de la semaine
const fetchAbsences = async () => {
  try {
    // Appeler le service pour récupérer les absences
    const response = await getAbsencesSemaine();
    absences.value = response.data; // Stocker les données d'absences
    console.log('Absences', absences.value);
    
    // Initialiser les compteurs pour chaque jour de la semaine (Lundi à Vendredi)
    const presenceCount = Array(5).fill(0); // Compteur de présences
    const absenceCount = Array(5).fill(0);  // Compteur d'absences

    // Boucle sur les absences pour les compter par jour
    absences.value.forEach(absence => {
      const date = new Date(absence.date_absence); // Convertir la date d'absence en objet Date
      const dayIndex = date.getDay() - 1; // Ajuster l'indice (Lundi = 0, ... , Dimanche = 6)
      if (dayIndex >= 0 && dayIndex < 5) { // Vérifier que l'indice est entre 0 et 4
        absenceCount[dayIndex]++; // Incrémenter le compteur d'absences pour le jour correspondant
      }
    });

    // Récupérer le nombre total d'élèves
    const totalEleves = await getElevesCount(); // Appeler le service pour obtenir le total d'élèves
    presentes.value = presenceCount.map((_, index) => totalEleves - absenceCount[index]); // Calculer les présences
    absentes.value = absenceCount; // Assigner les absences

  } catch (error) {
    console.error('Erreur lors de la récupération des absences:', error); // Gérer les erreurs
  }
};

// Initialiser le graphique
const initChart = () => {
  const ctx = barChartCanvas.value.getContext('2d'); // Obtenir le contexte 2D du canvas

  // Calculer les totaux pour chaque jour
  const total = presentes.value.map((p, index) => p + absentes.value[index]); // Total pour chaque jour
  const presentesPourcentage = presentes.value.map((p, index) => (p / total[index]) * 100); // Pourcentage de présents
  const absentesPourcentage = absentes.value.map((a, index) => (a / total[index]) * 100); // Pourcentage d'absents

  // Initialisation du graphique en barres
  new Chart(ctx, {
    type: 'bar', // Type de graphique
    data: {
      labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'], // Jours de la semaine
      datasets: [
        {
          label: 'Présents (%)', // Légende pour les présents
          data: presentesPourcentage, // Données des présences en pourcentage
          backgroundColor: '#F7AE00', // Couleur pour les présents
        },
        {
          label: 'Absents (%)', // Légende pour les absents
          data: absentesPourcentage, // Données des absences en pourcentage
          backgroundColor: '#407CEE', // Couleur pour les absents
        },
      ],
    },
    options: {
      responsive: true, // Rendre le graphique réactif
      plugins: {
        legend: {
          position: 'bottom', // Position de la légende
        },
        title: {
          display: true,
          text: 'Présences et Absences par jour de la semaine', // Titre du graphique
        },
      },
      scales: {
        y: {
          beginAtZero: true, // Commencer l'axe Y à 0
          max: 100, // L'axe Y va jusqu'à 100% pour les pourcentages
          ticks: {
            callback: function(value) {
              return value + '%'; // Afficher les pourcentages sur l'axe Y
            },
          },
        },
      },
    },
  });
};

// Appel à la fonction lors du montage
onMounted(async () => {
  await fetchAbsences(); // Récupérer les absences à l'initialisation
  initChart(); // Initialiser le graphique après avoir récupéré les données
});
</script>

<style scoped>
canvas {
  max-width: 800px; /* Augmenter la taille maximale du graphique */
  margin: auto; /* Centre le graphique */
}
</style>
