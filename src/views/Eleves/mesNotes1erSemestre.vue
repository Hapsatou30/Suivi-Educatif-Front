<template>
    <sideBarEleve />
    <topBarEleve />
    <div class="main-content">
      <div class="head">
        <h1 class="title">Mes Notes</h1>
      </div>
      <div class="boutons">
        <boutons title1="1er Semestre" title2="2ème Semestre" page1="mesNotes_1e_semestre"
      page2="mesNotes_2e_semestre" />
      </div>
      <div class="diagramme mb-5">
        <div class="chart-container1">
          <h5 style="text-align: center; margin-bottom: 5px;">Performances de l'enfant</h5>
          <ChildPerformanceChart :subjects="subjects" :scores="scores" />
        </div>
      </div>
  
      <!-- Notes par matière -->
      <div class="notes">
    <div v-for="(notesParMatiere, matiere) in notesGroupByMatiere" :key="matiere" class="matiere-section">
      <div class="title-container">
        <h1>{{ matiere }}</h1>
      </div>
  
      <div class="row ligne">
        <div v-for="note in notesParMatiere" :key="note.nom_evaluation" class="matiere-card col-12 col-sm-6 col-md-4 mb-3">
          <div :style="{ backgroundColor: getMatiereColor(note.matiere) }" class="card">
            <div class="card-title">{{ note.evaluation }} : {{ note.nom_evaluation }}</div>
            <div class="card-content">
              <h1>{{ note.note }}</h1>
            </div>
            <div class="card-footer">
              <p class="coef">Coef: {{ note.coefficient }}</p>
              <p class="comment">{{ note.commentaire }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
    </div>
  </template>
  
  <script setup>
 import sideBarEleve from '@/components/sideBarEleve.vue';
 import topBarEleve from '@/components/topBarEleve.vue';
  import boutons from '@/components/boutons.vue';
  import { ref, onMounted } from 'vue';
  import { getDetailsEleve } from '@/services/EleveService';
  import { getNoteEleve } from '@/services/NotesService';
  import ChildPerformanceChart from '@/components/ChildPerformanceChart.vue';
  
  
  const classeEleve_id = ref ([]);
  const notes = ref([]);
  const subjects = ref([]);
  const scores = ref([]);
  const notesGroupByMatiere = ref({});
  
  // Récupération des détails de l'élève
  const fetchDetailsEleve = async () => {
    try {
      const response = await getDetailsEleve();
      
      if (response.status === 200) {
        classeEleve_id.value = response.données.classeEleve_id;
        // console.log('classeEleve_id', classeEleve_id.value);
        
      } else {
        console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    }
  };
  
 // Récupération des notes de l'élève
const fetchNotesEleve = async () => {
  try {
    // Attendre que le fetchDetailsEleve récupère l'ID de la classe
    if (!classeEleve_id.value || classeEleve_id.value.length === 0) {
      console.error('L\'ID de la classe de l\'élève n\'est pas encore disponible.');
      return;
    }
    
    // Passer l'ID de la classe à la fonction pour récupérer les notes
    const response = await getNoteEleve(classeEleve_id.value); // Assurez-vous que cette méthode accepte un ID correct
    console.log('classeEleve_id:', classeEleve_id.value);

    if (response && response.eleve && response.eleve.notes) {
      const filteredNotes = response.eleve.notes.filter(note => note.periode === "1_semestre");
      notes.value = filteredNotes;
      
      // Grouper les notes par matière
      notesGroupByMatiere.value = groupNotesByMatiere(filteredNotes);
      
      // Préparer les données pour le diagramme
      subjects.value = notes.value.map(note => note.matiere);
      scores.value = notes.value.map(note => note.note);
    } else {
      console.error('Erreur lors de la récupération des notes :', response);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
  }
};


  
  // Fonction pour grouper les notes par matière
  const groupNotesByMatiere = (notes) => {
    return notes.reduce((acc, note) => {
      if (!acc[note.matiere]) {
        acc[note.matiere] = [];
      }
      acc[note.matiere].push(note);
      return acc;
    }, {});
  };
  
  // Fonction pour obtenir la couleur associée à une matière
  const getMatiereColor = (matiere) => {
    const colorsFromStorage = JSON.parse(localStorage.getItem('classeColors')) || {};
  
    if (colorsFromStorage[matiere]) {
      return colorsFromStorage[matiere];
    }
  
    // Si la couleur n'existe pas dans le localStorage, renvoyer une couleur par défaut
    return '#cccccc'; // Vous pouvez changer cette couleur par une autre si nécessaire
  };
  
  onMounted(async () => {
  await fetchDetailsEleve();  // Attendre que les détails de l'élève soient récupérés
  fetchNotesEleve();          // Ensuite récupérer les notes
});

  </script>
  
  
  <style scoped>
  .matiere-card {
    flex: 1 1 calc(33.33% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
  
  }
  
  .matiere-card:hover {
    transform: scale(1.05);
    /* Zoom à 105% au survol */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    /* Ombre supplémentaire au survol */
  }
  
  .main-content {
    overflow-x: hidden;
    padding: 20px;
    margin-left: 300px
  }
  
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    /* Centre le contenu horizontalement */
  }
  
  .prenom {
    color: #FFCD1E;
  }
  
  .retour {
    font-size: 30px;
    color: black;
    margin-right: 20px;
    /* Ajustement de la marge */
  }
  .boutons{
    display: block;
  }
  .btn-group[data-v-958842ab] {
   margin-left: 0;
  }
  .notes {
    margin-top: 20px;
    width: 100%;
  }
  
  .title-container {
    display: flex;
    align-items: center; 
    text-align: center;
  }
  
  
  .title-container {
    display: block;
  }
  
  .ligne {
    display: flex;
    flex-wrap: wrap; /* Permet aux cartes de passer à la ligne suivante si l'espace est insuffisant */
    gap: 16px; /* Espace entre les cartes */
    margin-top: 20px;
    justify-content: space-between; /* Distribue les cartes équitablement */
  }
  .title {
    text-align: center;
    margin-left: -2%;
  }
  
  .notes .row h1 {
    font-weight: bold;
    text-align: center;
  }
  
  .card {
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 10px;
    width: 100%;
    /* Utiliser 100% de la largeur */
    max-width: 480px;
    /* Largeur maximale */
    height: 210px;
    color: white;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .card:hover {
    transform: scale(1.05);
    /* Zoom à 105% au survol */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    /* Ombre supplémentaire au survol */
  }
  
  .card-title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9rem;
    color: white;
  }
  
  .coef,
  .comment {
    color: white;
  }
  
  @media (max-width: 992px) {
    .main-content {
      margin-left: 0;
      margin-top: 50px;
    }
  
    .head h1 {
      font-size: 20px;
      margin-top: 25px
    }
   
    .matiere-card {
    flex: 1 1 calc(50% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
  
  }
    .card-title {
      font-size: 16px;
    }
  
  }
  @media (max-width: 576px) {
    .matiere-card {
    flex: 1 1 calc(100% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
  
  }
    .main-content {
      margin-left: 0;
      margin-top: 100px;
    }
    .row{
      margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    }
  .col-6{
  width: 100%;
  }
  }
  </style>
  