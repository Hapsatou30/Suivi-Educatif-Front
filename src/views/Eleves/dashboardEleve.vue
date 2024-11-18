<template>
  <sideBarEleve />
  <topBarEleve />
  <div class="main-content">
    <affiche />
    <div class="card-container ">
      <h2>Evaluations de la semaine</h2>
      <div v-if="evaluations.length > 0" class="ligne">
        <div v-for="(evaluation, index) in evaluations" :key="index" class="matiere-card">
          <!-- Affichage du jour de la semaine -->
          <h4 class="date">{{ evaluation.formattedDay }}</h4>
          <div class="content">
            <p class="matiere">{{ evaluation.matiere }}</p>
            <p class="heure">{{ evaluation.heure }}</p>
          </div>
        </div>
      </div>
      <!-- Message s'il n'y a pas d'évaluations -->
      <div v-else class="col-12">
        <p class="alert alert-info text-center">Aucune évaluation pour cette semaine.</p>
      </div>
    </div>
    <div class="row">
  <div class="col-6">
    <h2>Emplois du temps du jour</h2>
    
    <div v-if="horaires.length > 0" class="d-flex flex-column align-items-center">
      <div :style="{ backgroundColor: getMatiereColor(horaire.matiere) }" 
           v-for="(horaire, index) in horaires"
           :key="index" 
           class="matiere-card shadow p-3 mb-3 rounded w-100">
        <div class="card-content d-flex justify-content-between">
          <!-- À gauche : Matière et Professeur -->
          <div class="matiere-prof">
            <p class="matiere font-weight-bold">{{ horaire.matiere }}</p>
            <p class="prof">{{ horaire.professeur }}</p>
          </div>
          <!-- À droite : Horaire -->
          <div class="horaire">
            <p>{{ horaire.horaire }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="col-12">
      <p class="alert alert-info text-center">Aucun horaire disponible pour aujourd'hui.</p>
    </div>
  </div>
  <div class="col-6">
    <div class="diagramme mb-5">
      <div class="chart-container1">
        <h5 style="text-align: center; margin-bottom: 5px;">Mes moyennes par semestre</h5>
        <ChildPerformanceChart :subjects="subjects" :scores="scores" />
      </div>
      </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sideBarEleve from '@/components/sideBarEleve.vue';
import topBarEleve from '@/components/topBarEleve.vue';
import affiche from '@/components/affiche.vue';
import { profile } from '@/services/AuthService';
import { getDetailsEleve } from '@/services/EleveService';
import { getEvaluationsParEleve } from '@/services/Evaluations';
import { geHoraireClasse } from '@/services/HoraireService';
import ChildPerformanceChart from '@/components/ChildPerformanceChart.vue';
import { getNoteEleve } from '@/services/NotesService';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/fr';

dayjs.locale('fr');
dayjs.extend(isBetween);

const eleveId = ref([]);
const classeEleve_id = ref([]);
const evaluations = ref([]);
const anneeClasse_id = ref('');
const horaires = ref([]);
const subjects = ref([]);
const scores = ref([]);



// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    if (user && user.eleve) {
      eleveId.value = user.eleve.id;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
  try {
    const response = await getDetailsEleve();

    if (response.status === 200) {
      classeEleve_id.value = response.données.classeEleve_id;
      anneeClasse_id.value = response.données.anneeClasse_id;
      console.log('annee classe', anneeClasse_id.value);
      await fetchEvaluations();
      await fetchHoraires();
      await fetchNotesEleve();
    } else {
      console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de l\'élève:', error);
  }
};

// Récupération des évaluations pour l'élève et filtrage
const fetchEvaluations = async () => {
  try {
    const response = await getEvaluationsParEleve(classeEleve_id.value);
    console.log('classeEleve_id:', classeEleve_id.value);

    if (response.status === 200) {
      const now = dayjs(); // Date actuelle
      const startOfWeek = now.startOf('week'); // Début de la semaine
      const endOfWeek = now.endOf('week'); // Fin de la semaine

      // Filtrer les évaluations de la semaine courante, les trier par date, et formater le jour de la semaine
      evaluations.value = response.evaluations
        .filter(evaluation => {
          const evalDate = dayjs(evaluation.date);
          return evalDate.isBetween(startOfWeek, endOfWeek); // Évaluations de la semaine courante seulement
        })
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date))) // Trier par date croissante
        .map(evaluation => ({
          ...evaluation,
          formattedDay: dayjs(evaluation.date).format('dddd'), // Formater le jour de la semaine
        }));

    } else {
      console.error("Erreur lors de la récupération des évaluations:", response.message);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des évaluations:", error);
  }
};
// Fonction pour récupérer l'emploi du temps de l'eleve
const fetchHoraires = async () => {
  try {
    const response = await geHoraireClasse(anneeClasse_id.value);
    if (response.status === 200) {
      const today = new Date();
      const jourActuel = today.toLocaleString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + today.toLocaleString('fr-FR', { weekday: 'long' }).slice(1);

      horaires.value = response.données
        .filter(horaire => horaire.jour === jourActuel)
        .map(horaire => ({
          horaire: `${horaire.horaire}`,  // Affiche l'heure de début et fin
          matiere: horaire.matiere,
          professeur: horaire.professeur
        }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
  }
};
const fetchNotesEleve = async () => {
  try {
    const response = await getNoteEleve(classeEleve_id.value); // Appel pour récupérer les notes

    if (response && response.eleve && response.eleve.notes) {
      const notes = response.eleve.notes; // Récupérer toutes les notes
      
      // Créer un objet pour stocker les moyennes par matière et semestre
      const moyennes = {};

      notes.forEach(note => {
        const { matiere, note: score, periode, evaluation } = note;

        // Initialiser l'objet pour la matière et le semestre si ce n'est pas encore fait
        if (!moyennes[matiere]) {
          moyennes[matiere] = {};
        }

        if (!moyennes[matiere][periode]) {
          moyennes[matiere][periode] = {
            devoirs: [],
            examen: null,
            moyenne: 0,
          };
        }

        // Ajouter les notes de devoirs
        if (evaluation === 'Devoir') {
          moyennes[matiere][periode].devoirs.push(score);
        }

        // Enregistrer la note de l'examen
        if (evaluation === 'Examen') {
          moyennes[matiere][periode].examen = score;
        }
      });

      // Calculer la moyenne par matière et semestre
      Object.keys(moyennes).forEach(matiere => {
        Object.keys(moyennes[matiere]).forEach(periode => {
          const { devoirs, examen } = moyennes[matiere][periode];
          const moyenneDevoirs = devoirs.length > 0 ? devoirs.reduce((a, b) => a + b) / devoirs.length : 0;

          // Calculer la moyenne finale pour la matière et le semestre
          moyennes[matiere][periode].moyenne = (moyenneDevoirs + (examen || 0)) / 2;
        });
      });

      // Préparer les données pour le diagramme
      subjects.value = Object.keys(moyennes).flatMap(matiere => 
        Object.keys(moyennes[matiere]).map(periode => `${matiere}`)
      );
      scores.value = Object.values(moyennes).flatMap(matiere => 
        Object.values(matiere).map(p => p.moyenne)
      );

    } else {
      console.error('Erreur lors de la récupération des notes :', response);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
  }
};


// Fonction pour obtenir la couleur associée à une matière
const getMatiereColor = (matiere) => {
  const colorsFromStorage = JSON.parse(localStorage.getItem('classeColors')) || {};
  console.log('Couleurs stockées:', colorsFromStorage);

  // Vérification de la présence de la couleur pour la matière
  if (colorsFromStorage[matiere]) {
    return colorsFromStorage[matiere];
 
  }

  // Retourner une couleur de remplacement si la couleur est introuvable
  console.warn(`Pas de couleur trouvée pour la matière: ${matiere}`);
  return '#FF0000';  // Couleur rouge pour indiquer un problème
};


// Appels aux fonctions lors du montage du composant
onMounted(async () => {
  await fetchProfile();

});
onMounted(() => {
  fetchDetailsEleve();
});
</script>


<style scoped>
.main-content {
  margin-top: 120px;
  overflow-x: hidden;

}

.card-container {
  margin-left: 300px;
  margin-right: 50px;
  margin-top: 40px;
}

.card-container h2 {
  text-align: start;
  margin-left: 0;
}

.ligne {
  display: flex;
  flex-wrap: wrap;
  /* Permet aux cartes de passer à la ligne suivante si l'espace est insuffisant */
  gap: 16px;
  /* Espace entre les cartes */
  margin-top: 20px;
  justify-content: space-between;
  /* Distribue les cartes équitablement */
}

.matiere-card {
  flex: 1 1 calc(33.33% - 16px);
  /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: black;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  /* Inclut les marges et les bordures dans la largeur */
  background-color: #ffffff;
  /* Juste pour la visibilité */
}

.matiere-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.evaluation-card {
  border-radius: 8px;
  padding: 16px;
  background-color: #E6F1FF;
  margin-bottom: 16px;
  border-radius: 18px;
}

.date {
  text-align: center;
  font-weight: bold;
}

.content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* Prendre toute la largeur */

}

.matiere {
  text-align: left;
  color: rgb(228, 12, 12);
}

.heure {
  text-align: right;
  color: rgb(228, 12, 12);
}

.row {
  margin-top: 50px;
  margin-left: 290px;
}

.row .col-6 h2 {
  text-align: start;
  margin-left: 0;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-content p {
  color: #ffffff;
}

@media (max-width: 992px) {
  .main-content {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
  .card-container {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 40px;
}
.card-container h2 {
  text-align: center;
  margin-left: 0;
}

  .matiere-card {
    flex: 1 1 calc(50% - 16px);
    /* Passe à 2 cartes par ligne sur des écrans plus petits */
  }
  .row {
  margin-top: 50px;
  margin-left: 0px;
}
.row .col-6 h2 {
  text-align: center;
  margin-left: 0;
}
}

@media (max-width: 567px) {
  .main-content {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 110%;
  }

 
  .matiere-card {
    flex: 1 1 calc(100% - 16px);
    /* Passe à 1 carte par ligne sur des petits écrans */
  }
  .row {
 display: flex;
 flex-direction: column;
 width: 100%;
}
.row .col-6  {
width: 100%;
}
}
</style>