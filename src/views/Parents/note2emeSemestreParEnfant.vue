<template>
  <sidebar_parent />
  <topbar_parent />
  <div class="main-content">
    <div class="head">
      <router-link to="/gestion_notes_parent">
        <Icon class="retour" icon="formkit:arrowleft" />
      </router-link>
      <h1 class="title">Les Notes de <span class="prenom">{{ prenom }}</span></h1>
    </div>
    <div class="boutons ">
      <boutons title1="1er Semestre" title2="2ème Semestre" page1="notes_enfant_1er_Semestre"
    page2="notes_enfant_2eme_Semestre" />
    </div>
    <div class=" diagramme mb-5">
      <div class="chart-container1">
        <h5 style="text-align: center; margin-bottom: 5px;">Performances de l'enfant</h5>
        <ChildPerformanceChart :subjects="subjects" :scores="scores" />
      </div>
    </div>
    <div class="notes">
  <div class="row">
    <!-- Colonne pour le titre -->
    <div class="title-container ">
      <h1>{{ notes[0]?.matiere || 'Aucune note disponible' }}</h1>
    </div>
    
    <!-- Colonne pour les cartes -->
    <div class="">
      <div class="row ligne">
        <div v-for="note in notes" :key="note.nom_evaluation" class="col-12 col-sm-6 col-md-4 mb-3">
          <div :style="{ backgroundColor: getMatiereColor(note.matiere) }" class="matiere-card card">
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

  </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import boutons from '@/components/boutons.vue';
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { getDetailsEleve } from '@/services/ClasseEleve';
import { getNoteEleve } from '@/services/NotesService';
import { useRoute } from 'vue-router';
import ChildPerformanceChart from '@/components/ChildPerformanceChart.vue';

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id);
const prenom = ref('');
const notes = ref([]);
const subjects = ref([]);
const scores = ref([]);

// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
  try {
    const response = await getDetailsEleve(classeEleve_id.value);
    
    if (response.status === 200) {
      prenom.value = response.données.prenom;
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
    const response = await getNoteEleve(classeEleve_id.value);
    if (response) {
      // Filtrer les notes pour ne garder que celles dont la période est "1_semestre"
      const filteredNotes = response.eleve.notes.filter(note => note.periode === "2_semestre");

      // Mettre à jour les tableaux avec les notes filtrées
      notes.value = filteredNotes;
      subjects.value = notes.value.map(note => note.matiere);
      scores.value = notes.value.map(note => note.note);
    } else {
      console.error('Erreur lors de la récupération des notes');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
  }
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

onMounted(() => {
  fetchDetailsEleve();
  fetchNotesEleve();
});
</script>

<style scoped>
.matiere-card {
  flex: 1 1 calc(33.33% - 16px);
  /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  /* Inclut les marges et les bordures dans la largeur */

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
  margin-left: 300px; 
  margin-right: 50px;

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
  margin-right: 0;
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
  flex-wrap: wrap;
  align-items: center;
  /* Permet aux cartes de passer à la ligne suivante si l'espace est insuffisant */
  gap: 16px;
  /* Espace entre les cartes */
  margin-top: 20px;
  justify-content: space-between;
  /* Distribue les cartes équitablement */
}

.title {
  text-align: center;
  /* Centre le titre */
  flex-grow: 1;
  /* Permet au titre de prendre de l'espace disponible */
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
  margin-bottom: 20px;

}

.coef,
.comment {
  color: white;
}
.date{
  text-align: center;
  margin-top: -30px;
  
}

@media (max-width: 992px) {
  .main-content {
    margin-left: 0px; 
    margin-right: 0px;
    /* margin-top: 540%; */
    /* margin-top: 560%; */
  }

  .head h1 {
    font-size: 20px;
    margin-top: 25px
  }

  .matiere-card {
    flex: 1 1 calc(50% - 16px);
    display: flex;
    align-items: center;
    justify-content:  center;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
   align-items: center;

  }

  .card-title {
    font-size: 16px;
  }

}
@media (max-width: 992px) {
  .main-content {
    margin-left: 0;
    margin-top: 540%;
    width: 100%;
  }
}
@media (max-width: 768px) {
  .main-content {
    margin-top: 580%;
  }
}
@media (max-width: 576px) {
  .matiere-card {
    flex: 1 1 calc(100% - 16px);
    /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
    /* Inclut les marges et les bordures dans la largeur */

  }

  .main-content {
    margin-top: 1630%;
    width: 100%;
   
  }

  .row {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .col-6 {
    width: 100%;
  }
  .head h1 {
    font-size: 20px;
    margin-top: 25px
  }

}
@media (max-width: 420px)
{
  .main-content {
    margin-top: 1500%;
    width: 100%;
   
  }
}
@media (max-width: 400px)
{
  .main-content {
    margin-top: 1620%;
    width: 100%;
   
  }
}
@media (max-width: 360px)
{
  .main-content {
    margin-top: 1760%;
    width: 100%;
   
  }
}

</style>