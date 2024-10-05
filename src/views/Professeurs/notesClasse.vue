<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
        <h2>Ajouter des notes pour la classe de {{ nom_classe }}</h2>
        <div class="addNotes">

            <div class="tableau1">
                <table class="table tab-planning1">
                    <thead>
                        <tr>
                            <th>Prenom & Nom</th>
                            <th>Matricule</th>
                            <th>Evaluation</th>
                            <th>Note</th>
                            <th>Appréciation</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(student, rowIndex) in paginatedStudents" :key="student.id_classeEleve"
                            :class="{ 'background': (rowIndex + 1) % 2 === 0, 'no-background': (rowIndex + 1) % 2 !== 0 }">
                            <td>{{ student.prenom }} {{ student.nom }}</td>
                            <td>{{ student.matricule }}</td>
                            <td>
                                <select v-model="student.evaluation" @change="updateEvaluationId(student)">
                                    <option disabled value="">Sélectionner une évaluation</option>
                                    <option v-for="evaluation in evaluations" :key="evaluation.id" :value="evaluation.id">{{ evaluation.nom }}</option>
                                </select>
                            </td>

                            <td>
                                <input type="number" v-model="student.note" min="0" max="20" />
                            </td>
                            <td>
                                <input type="text" v-model="student.appreciation" />
                            </td>
                            <td>
                                <button @click="addNote(student)"
                                    style="background-color: #F7AE00; color: white; border: none; padding: 10px; cursor: pointer;" title="Ajouter une Note">
                                    <Icon icon="mdi:check" width="24" height="24" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="paginatedStudents.length === 0" class="no-evaluations-message">Aucun élève trouvé.</p>
            </div>

            <pagination class="pagination1" v-if="paginatedStudents.length > pageSize"
                :totalItems="paginatedStudents.length" :pageSize="pageSize" :currentPage="currentPageOther"
                @pageChange="handlePageChangeOther" />
        </div>



        <div class="historiquesNotes">
            <h2>Historique des Notes</h2>
            <div class="tableauNotes">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-notes"
                    :headers="['Prenom & Nom', 'Matricule', 'Evaluation', 'Note', 'Appréciation', 'Action']" :data="paginatedData.map(({ prenom, nom, matricule, evaluation, note, appreciation, id }) => ({
                        eleve: `${prenom} ${nom}`,
                        matricule,
                        evaluation,
                        note,
                        appreciation,
                        id
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="editNote(row.id)" style="color: #407CEE;"
                                title="Modifier la note">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                            <button class="btn" @click="deleteNote(row.id)" style="color: red;"
                                title="Supprimer la note">
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
        <div class="retour">
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getNoteClasse, supprimerNote, ajouterNote } from '@/services/NotesService';
import { getEleveClasse } from '@/services/ClasseEleve';
import { getEvaluationsParClasseProf } from '@/services/Evaluations';
import { Icon } from '@iconify/vue';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const notesStudents = ref([]);
const currentPageOther = ref(1);
const evaluations = ref([]);


const fetchData = async () => {
    try {
        const response = await getNoteClasse(annee_classe_id);
        // Mapper les données pour inclure les informations des élèves
        tableData.value = response.données.map(({ eleve, evaluation, note, appreciation, matiere, id }) => ({
            prenom: eleve.prenom,
            nom: eleve.nom,
            matricule: eleve.matricule,
            evaluation: evaluation,
            note: note,
            appreciation: appreciation,
            matiere: matiere,
            id: id
        }));
    } catch (error) {
        console.error('Erreur lors du chargement des cahiers de texte :', error);
    }
}
// Récupération des données des élèves
const fetchStudents = async () => {
    try {
        // Récupérer les élèves de la classe
        const response = await getEleveClasse(annee_classe_id);
        if (response.status === 200) {
            // Extraire les données des élèves
            const eleves = response.données[0].eleves.map(eleve => ({
                id_classeEleve: eleve.id_classeEleve,
                nom: eleve.nom,
                prenom: eleve.prenom,
                matricule: eleve.matricule
            })); 
            // Stocker les données dans notesStudents
            notesStudents.value = eleves;
        } else {
            console.error('Erreur lors de la récupération des élèves:', response.message);
        }
    } catch (e) {
        console.error('Une erreur est survenue:', e);
    }
};

// Récupérer les évaluations du professeur
const fetchEvaluations = async () => {
    try {
        const response = await getEvaluationsParClasseProf(classeProf_id);
        if (response.status === 200) {
            const evaluationsPassees = response.evaluations.filter(evaluation => dayjs(evaluation.date).isBefore(dayjs()));
            evaluationsPassees.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
            // Extraire uniquement les noms des évaluations passées
            evaluations.value = evaluationsPassees.map(evaluation => ({
                id: evaluation.id,
                nom: evaluation.nom
            }));

        } else {
            console.error('Erreur lors de la récupération des évaluations:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};

const updateEvaluationId = (student) => {
    const selectedEvaluation = evaluations.value.find(evaluation => evaluation.id === student.evaluation);
    if (selectedEvaluation) {
        student.evaluation_id = selectedEvaluation.id; 
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

const paginatedStudents = computed(() => {
    const start = (currentPageOther.value - 1) * pageSize.value;
    return notesStudents.value.slice(start, start + pageSize.value);
});

const handlePageChangeOther = (newPage) => {
    currentPageOther.value = newPage;
};

// Méthode pour ajouter une note
const addNote = async (row) => {
    const eleveId = row.id_classeEleve; 
    const evaluationId = row.evaluation_id; 
    const noteAttribuee = row.note;
    const appreciation = row.appreciation; 

    if (!evaluationId || noteAttribuee === undefined || !appreciation) {
        await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Veuillez remplir tous les champs avant d\'ajouter la note.',
            confirmButtonColor: '#d33',
        });
        return;
    }

    try {
        const response = await ajouterNote({
            notes: noteAttribuee,
            commentaire: appreciation,
            evaluation_id: evaluationId,
            classe_eleve_id: eleveId,
        });

        if (response.status >= 200 && response.status < 300) {
            await Swal.fire({
                title: 'Succès',
                text: 'La note a été ajoutée avec succès.',
                icon: 'success',
                timer: 1500,
                timerProgressBar: true,
                willClose: () => {
                    fetchData(); // Assurez-vous que cela met à jour l'affichage
                }
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note :', error);
        const errorMessage = error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.';
        await Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage,
            confirmButtonColor: '#d33',
        });
    }
};



const deleteNote = async (id) => {
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
            await supprimerNote(id);
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

const retour = () => {
    router.go(-1);
};
onMounted(async () => {
    await fetchData();
    console.log('Paginated Students:', paginatedStudents.value);
    console.log('Paginated Data:', paginatedData.value);
    await fetchStudents();
    await fetchEvaluations();

});

</script>

<style scoped>
/* Masquer la colonne ID dans le tableau */
::v-deep .historiquesNotes .tableauNotes .tab-notes td:nth-child(6) {
    display: none;
}

.historiquesNotes {
    margin-top: 100px;
}

.tableauNotes,
.addNotes {
    margin-left: 300px;
    margin-right: 50px;
}


.main-content {
    margin-top: 120px;
}

.main-content h2 {
    color: black;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: center;
    margin-left: 300px;
    margin-bottom: 50px;
}


.pagination1 {
    margin-left: 275px;
    margin-right: 50px;
    display: flex;
    justify-content: end;
}

p {
    font-size: 18px;
    color: red;
    font-family: "Poppins", sans-serif;
}

.retour {
    display: flex;
    justify-content: end;
    margin-right: 50px;
    margin-bottom: 20px;
    margin-top: 50px;
}

.retour .btn-secondary,
.retour .btn-secondary:hover {
    background-color: transparent;
    color: white;
    border: 1px solid #F7AE00;
    border-radius: 12px;
    cursor: pointer;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    color: #F7AE00;

}

table {
    width: 100%;
    border-collapse: collapse;
    /* Élimine les espaces entre les cellules */
}

thead th {
    color: #F7AE00;
}

th,
td {
    padding: 20px;
    text-align: center;
    font-family: "Poppins", sans-serif;
    font-size: 18px;
}

th {
    background-color: white;
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    color: #F7AE00;
}

td {
    text-align: center
}

.background {
    background-color: #C7DCF2;
    /* Fond bleu clair pour les lignes paires */
}

.no-background {
    background-color: white;
    /* Fond blanc pour les lignes impaires */
    border-left: 3px solid #F7AE00;
    /* Bordure gauche jaune */
}

select,
input {
    width: 200px;
    /* S'assure que les inputs et selects prennent toute la largeur de la cellule */
    padding: 5px;
    /* Ajoute un peu d'espacement intérieur */
    box-sizing: border-box;
    border-radius: 12px;
}
</style>