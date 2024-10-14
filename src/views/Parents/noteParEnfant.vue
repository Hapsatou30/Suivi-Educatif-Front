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

    <div class=" diagramme mb-5">
      <div class="chart-container1">
        <h5 style="text-align: center; margin-bottom: 5px;">Performances de l'enfant</h5>
        <ChildPerformanceChart :subjects="subjects" :scores="scores" />
      </div>
    </div>

    <div class="notes">
      <div class="row">
        <div class="col-6 title-container">
          <h1> {{ notes[0]?.matiere || 'Aucune matière' }}</h1>
        </div>
        <div class="col-6">
          <div v-for="note in notes" :key="note.nom_evaluation"
            :style="{ backgroundColor: getMatiereColor(note.matiere) }" class="matiere-card">
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
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
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
      notes.value = response.eleve.notes;
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
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  /* Ajuster selon le besoin */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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


.notes .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  /* Utiliser 100% de la largeur */
}

.title-container {
  display: flex;
  justify-content: flex-start;
  /* Aligne à gauche */
}

.title {
  text-align: center;
  /* Centre le titre */
  flex-grow: 1;
  /* Permet au titre de prendre de l'espace disponible */
}

.notes .row h1 {
  font-weight: bold;
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

@media (max-width: 810px) {
  .main-content {
    margin-left: 0;
    margin-top: 50px;
  }

  .head h1 {
    font-size: 20px;
    margin-top: 25px
  }
 
  
  .card-title {
    font-size: 16px;
  }

}
@media (max-width: 576px) {
  .main-content {
    margin-left: 0;
    margin-top: 100px;
  }
  .row{
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
