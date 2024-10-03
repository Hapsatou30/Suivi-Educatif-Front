<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content planning">
        <h1>Planifier un Devoir ou un Examen</h1>
        <div class="row">
      <div class="col-6">
        <!-- Calendrier interactif -->
        <div id="calendar" class="calendar-container">
          <FullCalendar :options="calendarOptions" />
        </div>
      </div>
      <div class="col-6 forms" style="background-color: white;">
        <!-- Formulaire pour ajouter une évaluation -->
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <div class="mb-3">
              <label for="nomEvaluation" class="form-label">Nom de l'Évaluation</label>
              <input type="text" id="nomEvaluation" v-model="formData.nom" class="form-control" placeholder="Nom évaluation" required />
            </div>
            <div class="mb-3">
              <label for="heure" class="form-label">Heure</label>
              <input type="time" id="heure" v-model="formData.heure" class="form-control" required />
            </div>
          </div>
            <div class="form-group">
            <div class="mb-3">
              <label for="classe" class="form-label">Classe</label>
              <select id="classe" v-model="formData.classe_prof_id" class="form-select" required>
                <option value="" disabled selected>Choisissez une classe</option>
                <option v-for="classe in classes" :key="classe.classeProf_id" :value="classe.classeProf_id">{{ classe.nom_classe }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="matiere" class="form-label">Matière</label>
              <select id="matiere" v-model="formData.matiere_id" class="form-select" required>
                <option value="" disabled selected>Choisissez une matière</option>
                <option v-for="matiere in matieres" :key="matiere.id" :value="matiere.id">{{ matiere.nom }}</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <div class="mb-3">
              <label>Type d'Évaluation</label><br />
              <div class="radio-group">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="formData.type_evaluation" value="Devoir" required />
                  <label class="form-check-label">Devoir</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="formData.type_evaluation" value="Examen" required />
                  <label class="form-check-label">Examen</label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label for="duree" class="form-label">Durée (en minutes)</label>
              <input type="number" id="duree" v-model="formData.duree" class="form-control" required />
            </div>
          </div>

          <div class="mt-4" style="display: flex; justify-content: end;">
            <button type="submit" class="btn btn-submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

        <div class="mon_planning">
            <h2>Mon Planning</h2>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-planning1"
                    :headers="['Matière ', 'Date', 'Heure', 'Durée(mins)', 'Evaluation', 'Classe', 'Action']"
                    :data="paginatedData.map(({ matiere, date, heure, duree,type_evaluation, classe, id }) => ({ matiere, date, heure, duree,type_evaluation, classe, id }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="editPlanning(row.id)" style="color: #407CEE;" title="Modifier le cahier de texte">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                            <button class="btn" @click="deletePlanning(row.id)" style="color: red;" title="Supprimer le cahier de texte">
                                <Icon icon="mdi:trash-can-outline" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune évaluation à venir.</p>
            </div>
            <pagination class="pagination1"  v-if="tableData.length > pageSize" :totalItems="tableData.length" :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>

        <div class="mon_planning">
            <h2>Planning des autres professeurs</h2>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedOtherProf.length > 0" class="tab-planning1"
                    :headers="['Matière', 'Date', 'Heure', 'Durée (mins)', 'Classe', 'Professeur']"
                    :data="paginatedOtherProf.map(({ matiere, date, heure, duree, classe, professeur, id}) => ({ matiere, date, heure, duree, classe, professeur, id }))">
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune évaluation trouvée.</p>
            </div>
            <pagination  class="pagination1" v-if="otherProfEvaluations.length > pageSize" :totalItems="otherProfEvaluations.length" :pageSize="pageSize" :currentPage="currentPageOther" @pageChange="handlePageChangeOther" />
        </div>

        <div class="retour">
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getEvaluationsParProf, getEvaluations , supprimerEvaluation,} from '@/services/Evaluations';
import { profile } from '@/services/AuthService';
import { getListeClasseProf } from '@/services/ClasseProfs';
import { getListeMatieres } from '@/services/MatiereService';
import { Icon } from '@iconify/vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');


const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: 'fr',
  events: [],
  dateClick(info) {
    alert('Date cliquée: ' + info.dateStr);
  }
});
const professeurId = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const otherProfEvaluations = ref([]);
const currentPageOther = ref(1);
const classes = ref([]);

const matieres = ref([]);

// Données du formulaire
const formData = ref({
  nom: '',
  heure: '',
  classe_prof_id: '',
  matiere_id: '',
  duree: '',
  type_evaluation: ''
});



// Récupération de la liste des classes
const fetchClasse = async () => {
  try {
    const response = await getListeClasseProf(professeurId.value);
    if (response.status === 200) {
      // Filtrer pour obtenir des classes uniques par nom_classe
      const uniqueClasses = Array.from(new Set(response.classes.map(classe => classe.nom_classe)))
        .map(nom_classe => {
          return response.classes.find(classe => classe.nom_classe === nom_classe);
        });
      
      classes.value = uniqueClasses; // Stocker les classes sans doublons
    } else {
      console.error('Erreur lors de la récupération des classes:', response.message);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
  }
};

const fetchMatieres = async () => {
  try {
    const response = await getListeMatieres(professeurId.value);
    if (response.status === 200) {
      matieres.value = response.données; // Stocker les données dans matieres
    } else {
      console.error('Erreur lors de la récupération des matières:', response.message);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error);
  }
};


// Soumettre le formulaire
const submitForm = async () => {
  try {
    await ajouterEvaluation(formData.value);
    Swal.fire({
      title: 'Succès!',
      text: 'Évaluation ajoutée avec succès!',
      icon: 'success',
      timer: 3000,
      timerProgressBar: true
    });
  } catch (error) {
    Swal.fire({
      title: 'Erreur!',
      text: 'Une erreur est survenue lors de l\'ajout de l\'évaluation.',
      icon: 'error'
    });
  }
};

// Récupérer le profil du professeur connecté
const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;
        if (user && user.professeur) {
            professeurId.value = user.professeur.id;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};

const retour = () => {
    router.go(-1);
};

// Récupérer les évaluations du professeur
const fetchData = async () => {
    try {
        const response = await getEvaluationsParProf(professeurId.value);
        if (response.status === 200) {
            // Filtrer les évaluations pour ne garder que celles à venir
            const evaluationsFutures = response.evaluations.filter(evaluation => dayjs(evaluation.date).isAfter(dayjs()));

            // Trier les évaluations par date (du plus proche au plus éloigné)
            evaluationsFutures.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

            tableData.value = evaluationsFutures;
        } else {
            console.error('Erreur lors de la récupération des évaluations:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};

const fetchDataOthers = async () => {
    try {
        const response = await getEvaluations();
        const profIdConnecte = professeurId.value; // ID du professeur connecté

        if (response.status === 200) {
            // Filtrer les évaluations pour exclure celles du prof connecté et garder seulement celles à venir
            const evaluationsFutures = response.données
                .filter(evaluation => evaluation.profId !== profIdConnecte && dayjs(evaluation.date).isAfter(dayjs()));

            // Trier les évaluations par date (du plus proche au plus éloigné)
            evaluationsFutures.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

            otherProfEvaluations.value = evaluationsFutures;
        } else {
            console.error('Erreur lors de la récupération des évaluations:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};

// Pagination pour les évaluations à venir
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return tableData.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

// Pagination pour les évaluations des autres professeurs
const paginatedOtherProf = computed(() => {
    const start = (currentPageOther.value - 1) * pageSize.value;
    return otherProfEvaluations.value.slice(start, start + pageSize.value);
});

const handlePageChangeOther = (newPage) => {
    currentPageOther.value = newPage;
};

const deletePlanning = async (id) => {
  const confirmDelete = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action ne peut pas être annulée !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer !'
  });

  if (confirmDelete.isConfirmed) {
    try {
      await supprimerEvaluation(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'Evaluation a été supprimée avec succès.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          fetchData();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      const errorMessage = error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.';
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        confirmButtonColor: '#d33',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  }
};

onMounted(async () => {
    await fetchProfile();
    await fetchData();
    await fetchDataOthers();
    await fetchClasse();
    await fetchMatieres();
});
</script>
<style scoped>
::v-deep .mon_planning .tableau1 .tab-planning1 td:nth-child(7) {
    display: none;
    /* Masquer la colonne de l'ID */
}

.main-content {
    padding: 20px;
}

.planning h1 {
    margin-left: 300px;
    text-align: center;
}

.planning .row {
    margin-left: 265px;
    margin-right: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
}

.planning .row .forms {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
}

.planning .row .col-6 .form-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}

.planning .row .col-6 .form-group .form-control,
.planning .row .col-6 .form-group .form-select {
    width: 280px;
}



/* Styles pour les boutons radio */
.radio-group {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

.form-control,
.form-select {
    border-radius: 8px;
    border: 1px solid #000000;
    background-color: transparent;
}

input[type="text"]::placeholder,
select {
    color: #F7AE00;
}

input[type="time"] {
    appearance: none;
    background-color: transparent;
    color: #F7AE00;
}

input[type="radio"]:checked+label {
    color: #407CEE;
    font-weight: bold;
}

label:hover {
    cursor: pointer;
    color: #407CEE;
}

.btn-submit {
    background-color: #F7AE00;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    padding: 8px;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    margin-top: 10px;
}

.btn-submit:hover {
    background-color: #F7AE00;
    color: white;
}

::v-deep .fc .fc-daygrid-day-number {
    padding: 4px;
    position: relative;
    z-index: 4;
    color: #000000;
}

::v-deep .fc .fc-daygrid-day-number:hover {
    padding: 4px;
    position: relative;
    z-index: 4;
    color: #407CEE;
}

.mon_planning{
    margin-top: 70px;
}
.mon_planning h2{
    margin-bottom: 40px;
}
.mon_planning .tableau1{
    margin-left: 265px;
    margin-right: 38px;
}
</style>
