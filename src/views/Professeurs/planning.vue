<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content planning">
        <h1>Planifier un Devoir ou un Examen</h1>

        <!-- Conteneur pour aligner le formulaire et le calendrier -->
        <div class="row row1">
            <!-- Calendrier interactif dans l'autre colonne -->
            <div class="col-md-6">
                <div id="calendar" class="calendar-container">
                    <FullCalendar :options="calendarOptions" />
                </div>
            </div>
            <div class="col-md-6">
                <!-- Formulaire pour ajouter une évaluation -->
                <form @submit.prevent="submitForm" class="forms">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="nomEvaluation" class="form-label">Nom de l'Évaluation</label>
                            <input type="text" id="nomEvaluation" v-model="formData.nom" class="form-control"
                                placeholder="Nom évaluation" @blur="validateField('nom')"
                                :class="{ 'is-invalid': errors.nom }" required />
                            <div v-if="errors.nom" class="text-danger">{{ errors.nom }}</div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="heure" class="form-label">Heure</label>
                            <input type="time" id="heure" v-model="formData.heure" class="form-control"
                                @blur="validateField('heure')" :class="{ 'is-invalid': errors.heure }" required />
                            <div v-if="errors.heure" class="text-danger">{{ errors.heure }}</div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="classe" class="form-label">Classe</label>
                            <select id="classe" v-model="formData.classe_prof_id" class="form-select"
                                @change="validateField('classe_prof_id')"
                                :class="{ 'is-invalid': errors.classe_prof_id }" required>
                                <option value="" disabled selected>Choisissez une classe</option>
                                <option v-for="classe in classes" :key="classe.classeProf_id"
                                    :value="classe.classeProf_id">
                                    {{ classe.nom_classe }} -> {{ classe.nom_matiere }}
                                </option>
                            </select>
                            <div v-if="errors.classe_prof_id" class="text-danger">{{ errors.classe_prof_id }}</div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="date" class="form-label">Date</label>
                            <input type="date" id="date" v-model="formData.date" class="form-control"
                                @blur="validateField('date')" :class="{ 'is-invalid': errors.date }" required />

                            <div v-if="errors.date" class="text-danger">{{ errors.date }}</div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label for="duree" class="form-label">Durée (en minutes)</label>
                            <input type="number" id="duree" v-model="formData.duree" class="form-control"
                                @blur="validateField('duree')" :class="{ 'is-invalid': errors.duree }" required />
                            <div v-if="errors.duree" class="text-danger">{{ errors.duree }}</div>
                        </div>

                        <div class="col-md-6 mb-3">
                            <label>Type d'Évaluation</label><br />
                            <div class="radio-group">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="formData.type_evaluation"
                                        value="Devoir" @change="validateField('type_evaluation')"
                                        :class="{ 'is-invalid': errors.type_evaluation }" required />
                                    <label class="form-check-label">Devoir</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" v-model="formData.type_evaluation"
                                        value="Examen" @change="validateField('type_evaluation')"
                                        :class="{ 'is-invalid': errors.type_evaluation }" required />
                                    <label class="form-check-label">Examen</label>
                                </div>
                            </div>
                            <div v-if="errors.type_evaluation" class="text-danger">{{ errors.type_evaluation }}</div>
                        </div>
                    </div>

                    <div class="mt-4 boutonss">
                        <button type="submit" class="btn btn-submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="mon_planning">
            <h2>Mon Planning</h2>
            <div class="tableau1">
                <div v-if="successMessage" class="alert alert-success" role="alert">
                    {{ successMessage }}
                </div>
                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-planning1"
                    :headers="['Matière ', 'Date', 'Heure', 'Durée(mins)', 'Evaluation', 'Classe', 'Action']"
                    :data="paginatedData.map(({ matiere, date, heure, duree, type_evaluation, classe, id }) => ({ matiere, date, heure, duree, type_evaluation, classe, id }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="editPlanning(row.id)" style="color: #407CEE;"
                                title="Modifier le cahier de texte">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                            <button class="btn" @click="deletePlanning(row.id)" style="color: red;"
                                title="Supprimer le cahier de texte">
                                <Icon icon="mdi:trash-can-outline" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune évaluation à venir.</p>
            </div>
            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>

        <div class="mon_planning">
            <h2>Planning des autres professeurs</h2>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedOtherProf.length > 0" class="tab-planning1"
                    :headers="['Matière', 'Date', 'Heure', 'Durée (mins)', 'Classe', 'Professeur']"
                    :data="paginatedOtherProf.map(({ matiere, date, heure, duree, classe, professeur, id }) => ({ matiere, date, heure, duree, classe, professeur, id }))">
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune évaluation trouvée.</p>
            </div>
            <pagination class="pagination1" v-if="otherProfEvaluations.length > pageSize"
                :totalItems="otherProfEvaluations.length" :pageSize="pageSize" :currentPage="currentPageOther"
                @pageChange="handlePageChangeOther" />
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
import { getEvaluationsParProf, getEvaluations, supprimerEvaluation, ajouterEvaluation, modifierEvaluation } from '@/services/Evaluations';
import { profile } from '@/services/AuthService';
import { getListeClasseProf } from '@/services/ClasseProfs';
// import { getListeMatieres } from '@/services/MatiereService';
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
        formData.value.date = info.dateStr;
    },
    eventClick(info) {
        Swal.fire({
            title: info.event.title,
            text: `Type: ${info.event.extendedProps.type}\nClasse: ${info.event.extendedProps.classe}`,
            icon: 'info'
        });
    }
});


const professeurId = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const otherProfEvaluations = ref([]);
const currentPageOther = ref(1);
const classes = ref([]);
const successMessage = ref('');
const errorMessage = ref('');



// Données du formulaire
const formData = ref({
    nom: '',
    heure: '',
    classe_prof_id: '',
    duree: '',
    type_evaluation: '',
    date: ''
});

const errors = ref({
    nom: null,
    heure: null,
    classe_prof_id: null,
    date: null,
    duree: null,
    type_evaluation: null
});

// Méthode de validation pour chaque champ

const validateField = (field) => {
    const today = new Date(); // Obtenir la date actuelle

    // Validation spécifique pour chaque champ
    if (!formData.value[field]) {
        errors.value[field] = `Le champ ${field} est obligatoire.`;
    } else if (field === 'date') {
        const selectedDate = new Date(formData.value.date);
        if (selectedDate < today.setHours(0, 0, 0, 0)) {
            errors.value.date = "La date doit être égale ou postérieure à aujourd'hui.";
        } else {
            errors.value.date = null; // Aucune erreur pour la date
        }
    } else if (field === 'duree' && (!Number.isInteger(+formData.value.duree) || +formData.value.duree < 1)) {
        errors.value.duree = "La durée doit être un nombre entier supérieur à 0.";
    } else if (field === 'type_evaluation' && !['Devoir', 'Examen'].includes(formData.value.type_evaluation)) {
        errors.value.type_evaluation = "Le type d'évaluation doit être soit 'Devoir' soit 'Examen'.";
    } else {
        errors.value[field] = null; // Réinitialiser en cas d'absence d'erreurs
    }
};


// Vérifier si le formulaire est valide
const formIsValid = computed(() => {
    return !Object.values(errors.value).some(error => error !== null) &&
        Object.values(formData.value).every(field => field !== '');
});



// Récupération de la liste des classes
const fetchClasse = async () => {
    try {
        const response = await getListeClasseProf(professeurId.value);
        if (response.status === 200) {

            classes.value = response.classes; // Stocker les classes sans doublons
        } else {
            console.error('Erreur lors de la récupération des classes:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des classes:', error);
    }
};




const editPlanning = async (id) => {
    try {
        const evaluation = tableData.value.find((evaluation) => evaluation.id === id);
        if (evaluation) {
            // Remplir les champs du formulaire avec les données de l'évaluation à modifier
            formData.value = {
                nom: evaluation.nom,
                heure: evaluation.heure,
                classe_prof_id: evaluation.classe_prof_id,
                duree: evaluation.duree,
                type_evaluation: evaluation.type_evaluation,
                date: evaluation.date,
                id: evaluation.id // Ajouter l'id pour le suivi de la modification
            };
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'évaluation à modifier:', error);
    }
};

const submitForm = async () => {
    validateField('nom');
    validateField('heure');
    validateField('classe_prof_id');
    validateField('date');
    validateField('duree');
    validateField('type_evaluation');

    if (!formIsValid.value) {
        return; // Arrêter la soumission si le formulaire n'est pas valide
    }
    try {
        if (formData.value.id) {
            // Modifier l'évaluation si un ID est présent dans formData
            await modifierEvaluation(formData.value);
            successMessage.value = 'Évaluation modifiée avec succès!';
        } else {
            // Ajouter une nouvelle évaluation si pas d'ID
            await ajouterEvaluation(formData.value);
            successMessage.value = 'Évaluation ajoutée avec succès!';
        }

        fetchData();
        resetForm();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'evaluation :', error);
        const errorMessageContent = error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.';
        errorMessage.value = errorMessageContent;

        // Masquer le message d'erreur après quelques secondes
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000);
    }
};



const resetForm = () => {
    formData.value = {
        nom: '',
        heure: '',
        classe_prof_id: '',
        duree: '',
        type_evaluation: '',
        date: '',
        id: null
    };
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
        console.log('Response', response);

        if (response.status === 200) {
            const evaluationsFutures = response.evaluations.filter(evaluation => dayjs(evaluation.date).isAfter(dayjs()));
            evaluationsFutures.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
            calendarOptions.value.events = evaluationsFutures.map(evaluation => ({
                title: `${evaluation.type_evaluation} - ${evaluation.matiere}`, // Changer le titre pour inclure la matière
                start: evaluation.date + 'T' + evaluation.heure,
                extendedProps: {
                    type: evaluation.type_evaluation,
                    classe: evaluation.classe,
                    matiere: evaluation.matiere
                }
            }));

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
                timer: 1000,
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
    // await fetchMatieres();
});
</script>

<style scoped>
::v-deep .mon_planning .tableau1 .tab-planning1 td:nth-child(7) {
    display: none;
}

.calendar-container {
    width: 100%;
}

.main-content {
    padding: 20px;
}
.planning .row1{
    margin-left: 265px;
    margin-right: 30px;
     display: flex;
      align-items: center;
       justify-content: space-between;
}
.planning h1 {
    margin-left: 300px;
    text-align: center;
    margin-bottom: 30px;
}



.planning .row .forms {
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

.mon_planning {
    margin-top: 70px;
}

.mon_planning h2 {
    margin-bottom: 40px;
}

.mon_planning .tableau1 {
    margin-left: 265px;
    margin-right: 38px;
}

::v-deep .bouton .btn-submit:disabled {
    background-color: #407CEE;
    /* couleur gris pour montrer qu'il est désactivé */
    color: #666666;
    /* texte grisé */
    cursor: not-allowed;
    /* curseur modifié pour indiquer qu'il n'est pas cliquable */
    opacity: 0.6;
    /* rendre le bouton semi-transparent */
}
.boutonss{
    display: flex; justify-content: end;
}
@media (max-width: 992px) {
    .main-content {
        width: 95%;
        margin-top: 130%;
        margin-left: auto;
        margin-right: auto;
    }
  
.planning .row1{
    flex-direction: column;
    margin-left: 0;
    width: 100%;
}
.planning h1 {
    margin-left: 0px;
    text-align: center;
    margin-bottom: 50px;
}
.col-md-6{
    width: 100%;
}
.planning .row .col-6 .form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}
.mon_planning .tableau1 {
    margin-left: 0px;
    margin-right: 38px;
}
.mon_planning h2{
    margin-left: 0px;
}
}

@media (max-width: 768px) {
    .main-content {
        width: 95%;
        margin-top: 150%;
        margin-left: auto;
        margin-right: auto;
    }


}

@media (max-width: 576px) {
    .main-content {
        width: 98%;
        margin-top: 270%;
        margin-left: auto;
        margin-right: auto;
    }
    .planning h1 {
    font-size: 20px;
}
::v-deep  .fc .fc-toolbar-title {
    font-size: 14px;
    margin: 0px;
}
.boutonss{
    display: block;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-left: 20%;
}
.mon_planning h2 {
    font-size: 20px;
}

}


@media (max-width: 360px) {
    .main-content {
        width: 98%;
        margin-top: 300%;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>
