<template>
    <div>
      <!-- Canvas pour le graphique en barres -->
      <canvas ref="barChartCanvas" width="500" height="500"></canvas>
    </div>
  </template>
  
  <script setup>
  // Importer les fonctions nécessaires de Vue et Chart.js
  import { ref, onMounted } from 'vue';
  import { Chart, registerables } from 'chart.js';
  import { geHoraireProf } from '@/services/HoraireService';
  import { profile } from '@/services/AuthService';
  
  const professeurId = ref('');
  Chart.register(...registerables); // Enregistrer les composants requis de Chart.js
  
  // Référence pour le canvas du graphique
  const barChartCanvas = ref(null);
  let barChartInstance = null; // Référence au graphique pour pouvoir le mettre à jour
  
  // Fonction pour récupérer les horaires de cours
  const fetchHoraires = async (professeurId) => {
    try {
      const response = await geHoraireProf(professeurId);
      const horaires = response.données;
  
      // Transformer les données pour obtenir le nombre total d'heures par jour
      const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
      const heuresParJour = joursSemaine.map((jour) => {
        // Calculer les heures de cours pour chaque jour
        const totalHeures = horaires
          .filter(horaire => horaire.jour === jour)
          .reduce((total, horaire) => {
            const heureDebut = new Date(`1970-01-01T${horaire.heure_debut}`);
            const heureFin = new Date(`1970-01-01T${horaire.heure_fin}`);
            const heuresDiff = (heureFin - heureDebut) / (1000 * 60 * 60); // Convertir en heures
            return total + heuresDiff;
          }, 0);
        return totalHeures;
      });
  
      // Mettre à jour le graphique
      updateBarChart(heuresParJour);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des horaires:', error);
    }
  };
  
  // Fonction pour mettre à jour le graphique en barres
  const updateBarChart = (heuresParJour) => {
    const ctx = barChartCanvas.value.getContext('2d');
  
    if (barChartInstance) {
      // Mettre à jour les données du graphique existant
      barChartInstance.data.datasets[0].data = heuresParJour;
      barChartInstance.update();
    } else {
      // Créer le graphique si c'est la première fois
      barChartInstance = new Chart(ctx, {
        type: 'bar', // Type de graphique : barres
        data: {
          labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'], // Jours de la semaine
          datasets: [{
            label: 'Heures de cours',
            data: heuresParJour, // Heures de cours pour chaque jour
            backgroundColor: '#407CEE', // Couleur des barres
            borderColor: '#3059A4', // Couleur des bordures des barres
            borderWidth: 1, // Épaisseur de la bordure
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true, // Commencer l'axe Y à zéro
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
          responsive: true, // Rendre le graphique responsive
          plugins: {
            legend: {
              position: 'bottom', // Position de la légende
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
  
      // Récupérer l'ID du professeur connecté
      if (user && user.professeur) {
        professeurId.value = user.professeur.id;
  
        // Une fois que l'ID du professeur est disponible, récupérer les horaires
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
  