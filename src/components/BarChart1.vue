<template>
  <div>
    <!-- Vérifier si les données sont disponibles -->
    <div v-if="!hasData">
      <p>Aucune donnée disponible pour afficher le graphique.</p>
    </div>
    <div v-else>
      <!-- Canvas pour le graphique en barres -->
      <canvas ref="barChartCanvas" width="600" height="600"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { geHoraireProf } from '@/services/HoraireService';
import { profile } from '@/services/AuthService';

const professeurId = ref('');
const hasData = ref(false); // État pour vérifier si les données sont disponibles
Chart.register(...registerables); // Enregistrer les composants requis de Chart.js

const barChartCanvas = ref(null);
let barChartInstance = null; // Référence au graphique pour pouvoir le mettre à jour

// Fonction pour récupérer les horaires de cours
const fetchHoraires = async (professeurId) => {
  try {
    const response = await geHoraireProf(professeurId);
    const horaires = response.données;

    // Vérifier si des horaires ont été récupérés
    if (horaires.length === 0) {
      hasData.value = false; // Pas de données
      return;
    }

    // Transformer les données pour obtenir le nombre total d'heures par jour
    const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const heuresParJour = joursSemaine.map((jour) => {
      const totalHeures = horaires
        .filter(horaire => horaire.jour === jour)
        .reduce((total, horaire) => {
          const heureDebut = new Date(`1970-01-01T${horaire.heure_debut}`);
          const heureFin = new Date(`1970-01-01T${horaire.heure_fin}`);
          const heuresDiff = (heureFin - heureDebut) / (1000 * 60 * 60);
          return total + heuresDiff;
        }, 0);
      return totalHeures;
    });

    hasData.value = true; // Données disponibles
    updateBarChart(heuresParJour);
    
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
    hasData.value = false; // En cas d'erreur, pas de données
  }
};

// Fonction pour mettre à jour le graphique en barres
const updateBarChart = (heuresParJour) => {
  const ctx = barChartCanvas.value.getContext('2d');

  if (barChartInstance) {
    barChartInstance.data.datasets[0].data = heuresParJour;
    barChartInstance.update();
  } else {
    barChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        datasets: [{
          label: 'Heures de cours',
          data: heuresParJour,
          backgroundColor: '#407CEE',
          borderColor: '#3059A4',
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Heures de cours',
            }
          },
          x: {
            title: {
              display: true,
              text: 'Jours de la semaine',
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Mes heures de cours par jour'
          }
        }
      }
    });
  }
};

// Fonction pour récupérer le profil du professeur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
      await fetchHoraires(professeurId.value);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Exécuter les fonctions après le montage du composant
onMounted(() => {
  fetchProfile();
});

</script>

<style scoped>
/* Styles pour le canvas */
canvas {
  max-width: 600px; /* Limite la largeur maximale du canvas */
  margin: auto; /* Centre le graphique */
}
</style>
