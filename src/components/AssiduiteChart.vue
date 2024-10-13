<template>
    <div>
      <!-- Canvas pour le graphique en barres empilées -->
      <canvas ref="assiduiteChartCanvas" width="400" height="400"></canvas>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { profile } from '@/services/AuthService';
import { getAbsenceParents } from '@/services/AbsenceService';
import { getElevesParParent } from '@/services/ClasseEleve';

const parentId = ref(null); // Initialiser avec null
const assiduiteChartCanvas = ref(null);
let assiduiteChartInstance = null;
Chart.register(...registerables);

const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;

        if (user && user.parent) {
            parentId.value = user.parent.id;
            // console.log('parentId récupéré:', parentId.value);
        } else {
            console.error('Aucun parent trouvé pour cet utilisateur.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};

const fetchAssiduiteData = async () => {
    try {
        if (!parentId.value) {
            console.error('parentId est vide.');
            return; // Ou gérer l'erreur comme nécessaire
        }

        // Récupérer les élèves à partir de l'API
        const response = await getElevesParParent(parentId.value);
        // console.log('response', response);

        // Vérifier que la réponse contient les données
        if (!response || !response.données) {
            console.error('Aucune réponse d\'élèves reçue.');
            return; // Sortir si la réponse est undefined ou ne contient pas de données
        }

        // Récupérer les données d'élèves
        const elevesResponse = response.données; // Récupérer uniquement les données
        // console.log('elevesResponse', elevesResponse); // Vérifiez ici

        const absencesResponse = await getAbsenceParents(parentId.value);
        // console.log('absencesResponse', absencesResponse);

        // Récupérer les noms des enfants
        const enfants = elevesResponse.map(eleve => `${eleve.prenom} ${eleve.nom}`);
        const presences = new Array(enfants.length).fill(100); // Initialiser avec 100% de présence
        const absences = new Array(enfants.length).fill(0);    // Initialiser avec 0% d'absence

        // Calculer les absences pour chaque élève
        absencesResponse.data.forEach(absence => {
            const eleveIndex = enfants.findIndex(enfant => enfant.includes(absence.classe_eleve.eleve.prenom));
            if (eleveIndex !== -1) {
                presences[eleveIndex] -= 1; // Supposons que chaque absence réduit la présence de 1%
                absences[eleveIndex] += 1;   // Incrémente le nombre d'absences
            }
        });

        // Mettre à jour le graphique
        updateAssiduiteChart(enfants, presences, absences);

    } catch (error) {
        console.error('Erreur lors de la récupération des données d\'assiduité:', error);
    }
};



const updateAssiduiteChart = (enfants, presences, absences) => {
    const ctx = assiduiteChartCanvas.value.getContext('2d');

    if (assiduiteChartInstance) {
        assiduiteChartInstance.data.labels = enfants;
        assiduiteChartInstance.data.datasets[0].data = presences;
        assiduiteChartInstance.data.datasets[1].data = absences;
        assiduiteChartInstance.update();
    } else {
        assiduiteChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: enfants,
                datasets: [
                    {
                        label: 'Présences',
                        data: presences,
                        backgroundColor: '#F7AE00',
                    },
                    {
                        label: 'Absences',
                        data: absences,
                        backgroundColor: '#407CEE',
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Pourcentage (%)' },
                    },
                    x: {
                        title: { display: true, text: 'Enfants' },
                    }
                },
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    title: { display: true, text: 'Assiduité des Enfants' }
                }
            }
        });
    }
};

onMounted(async () => {
    await fetchProfile();
    await fetchAssiduiteData();
});
</script>

  
  <style scoped>
  /* Styles pour le canvas */
  canvas {
      max-width: 600px; /* Limite la largeur maximale du canvas */
      margin: auto; /* Centre le graphique */
  }
  </style>
  