<template>
  <div>
    <!-- Canvas pour le graphique des notes -->
    <canvas ref="notesChartCanvas" width="700" height="400"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { profile } from '@/services/AuthService'; 
import { getNoteElevesParent } from '@/services/NotesService';

const notesChartCanvas = ref(null);
let notesChartInstance = null;
Chart.register(...registerables);

const parentId = ref(null);

const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    if (user && user.parent) {
      parentId.value = user.parent.id;
      await fetchNotes(); // Appeler fetchNotes après avoir récupéré parentId
    } else {
      console.error('Aucun parent trouvé pour cet utilisateur.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Nouvelle fonction pour récupérer les notes
const fetchNotes = async () => {
  try {
    const response = await getNoteElevesParent(parentId.value); 
    const notesData = processNotesData(response.données); // Traiter les données des notes
    updateNotesChart(notesData); // Mettre à jour le graphique avec les nouvelles données
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
  }
};

// Traiter les données des notes pour les adapter au graphique
const processNotesData = (data) => {
  const subjects = [];
  const notesMap = {};

  data.forEach((entry) => {
    const { eleve, matiere, note } = entry;
    const fullName = `${eleve.prenom} ${eleve.nom}`;

    if (!subjects.includes(matiere)) {
      subjects.push(matiere); // Ajoutez la matière si elle n'est pas déjà dans le tableau
    }

    if (!notesMap[fullName]) {
      notesMap[fullName] = Array(subjects.length).fill(0); // Initialise les notes à zéro
    }

    // Mettez à jour la note pour la matière correspondante
    const subjectIndex = subjects.indexOf(matiere);
    if (subjectIndex !== -1) {
      notesMap[fullName][subjectIndex] = note; // Assigner la note à la matière correspondante
    }
  });

  return {
    subjects,
    notesData: notesMap,
  };
};

const updateNotesChart = (notesData) => {
  const ctx = notesChartCanvas.value.getContext('2d');

  if (notesChartInstance) {
    notesChartInstance.destroy(); // Détruire l'instance existante avant de créer une nouvelle
  }

  const colors = [
    '#FF6384', 
    '#4BC0C0', 
    '#9966FF', 
    '#FF9F40', 
    '#FF5733', 
    '#C70039', 
    '#900C3F', 
    '#581845'   
  ];
  // Préparer les ensembles de données
  const datasets = Object.keys(notesData.notesData).map((enfant, index) => ({
    label: enfant,
    data: notesData.notesData[enfant],
    backgroundColor: colors[index % colors.length], // Couleur spécifique pour chaque enfant
  }));

  // Créer le graphique
  notesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: notesData.subjects, // Utiliser les matières récupérées
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
        legend: { position: 'bottom' },
        title: { display: true, text: 'Diagramme des Notes par Matière' }
      }
    }
  });
};

onMounted(() => {
  fetchProfile(); // Récupérer le profil et les notes lors du montage du composant
});
</script>

<style scoped>
/* Styles pour le canvas */
canvas {
  max-width: 100%; /* Permet au canvas de s'adapter à la largeur du conteneur parent */
  height: auto; /* Ajuste automatiquement la hauteur pour maintenir le ratio */
  margin: auto; /* Centre le graphique */
}

@media (max-width: 768px) {
  canvas {
    max-width: 100%;
    height: 500px; /* Ajuste la hauteur pour les petits écrans */
  }
}

@media (max-width: 480px) {
  canvas {
    max-width: 100%;
    height: 400px; /* Plus petite taille pour les très petits écrans */
  }
}
</style>

