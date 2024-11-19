<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
        <boutons title1="1er Semestre" title2="2ème Semestre" page1="notes_classe_1erSemestre"
            page2="notes_classe_2emeSemestre" />
        <h2>{{ isEditing ? "Modifier la note" : "Ajouter les notes du 1er semestre pour la classe de " + nom_classe }}
        </h2>
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
                                    <option v-for="evaluation in evaluations" :key="evaluation.id"
                                        :value="evaluation.id">{{ evaluation.nom }}</option>
                                </select>
                            </td>

                            <td>
                                <input type="number" v-model="student.note" min="0" max="20" />
                            </td>
                            <td>
                                <input type="text" v-model="student.appreciation" />
                            </td>
                            <td style="display: none;">
                                <input type="hidden" v-model="student.id_bulletin" />
                            </td>
                            <td>
                                <button @click="isEditing ? updateNote(student) : addNote(student)"
                                    style="background-color: #F7AE00; color: white; border: none; padding: 10px; cursor: pointer;"
                                    title="Ajouter/Modifier la Note">
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
                <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-notes"
                    :headers="['Prenom & Nom', 'Matricule', 'Evaluation', 'Note', 'Appréciation', 'Action']" :data="paginatedData.map(({ prenom, nom, matricule, evaluation, note, appreciation, id, idClasseEleve, evaluation_id }) => ({
                        eleve: `${prenom} ${nom}`,
                        matricule,
                        evaluation,
                        note,
                        appreciation,
                        id,
                        idClasseEleve,
                        evaluation_id
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
                <p v-else class="no-evaluations-message">Aucune note disponible</p>
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
import boutons from '@/components/boutons.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getNoteClasse, supprimerNote, ajouterNote, modifierNote } from '@/services/NotesService';
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
const isEditing = ref(false);
const editingNoteId = ref(null);
const successMessage = ref('');
const errorMessage = ref('');



const fetchData = async () => {
    try {
        const response = await getNoteClasse(classeProf_id);

        // Vérifier si les données contiennent le semestre 1
        if (response.données && response.données['1_semestre']) {
            const filteredData = response.données['1_semestre']; // Utiliser les données du 1er semestre

            // Mapper les données filtrées pour inclure les informations des élèves
            tableData.value = filteredData.map(({ eleve, evaluation, bulletin_id, note, appreciation, matiere, id, evaluation_id }) => ({
                prenom: eleve.prenom,
                nom: eleve.nom,
                matricule: eleve.matricule,
                evaluation: evaluation,
                note: note,
                appreciation: appreciation,
                matiere: matiere,
                id: id,
                idClasseEleve: bulletin_id.classe_eleve_id,
                evaluation_id: evaluation_id
            }));

            console.log('tableData: ', tableData.value);
        } else {
            console.error('Aucune donnée trouvée pour le 1er semestre.');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
    }
};

// Récupération des données des élèves
const fetchStudents = async () => {
    try {
        // Récupérer les élèves de la classe
        const response = await getEleveClasse(annee_classe_id);

        if (response.status === 200) {
            // Extraire les données des élèves
            const eleves = response.données[0].eleves.map(eleve => {
                // Filtrer les bulletins pour garder uniquement ceux avec la période "1_semestre"
                const bulletinsFiltrés = eleve.bulletins.filter(bulletin => bulletin.periode === "1_semestre");

                // Ne conserver que les élèves ayant des bulletins filtrés
                return bulletinsFiltrés.length > 0 ? {
                    id_classeEleve: eleve.id_classeEleve,
                    nom: eleve.nom,
                    prenom: eleve.prenom,
                    matricule: eleve.matricule,
                    id_bulletin: bulletinsFiltrés[0].id_bulletin, // Ajouter l'ID du bulletin
                    periode: bulletinsFiltrés[0].periode, // Ajouter la période du b
                } : null; // Retourner null si aucun bulletin ne correspond
            }).filter(eleve => eleve !== null); // Filtrer les élèves null

            // Stocker les données dans notesStudents
            notesStudents.value = eleves;
            // console.log('Données des élèves avec bulletins 1_semestre:', notesStudents.value);

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
    } else {
        student.evaluation_id = null;
        console.error('Aucune évaluation sélectionnée');
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


// Méthode pour vérifier si l'élève a déjà une note pour l'évaluation donnée
const checkNoteExistence = async (eleveId, evaluationId) => {
    try {
        const response = await getNoteClasse(classeProf_id);

        // Vérifier si chaque semestre est défini avant de les combiner
        const notesPremierSemestre = response.données['1_semestre'] || [];
        const notesDeuxiemeSemestre = response.données['2_semestre'] || [];

        // Combiner toutes les notes disponibles
        const allNotes = [...notesPremierSemestre, ...notesDeuxiemeSemestre];

        // Rechercher la note existante dans toutes les périodes
        const existingNote = allNotes.find(note =>
            note.bulletin_id.classe_eleve_id === eleveId && note.evaluation_id === evaluationId
        );

        console.log('Note existante:', existingNote); // Log pour débogage
        return existingNote !== undefined;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'existence de la note :', error);
        return false; // En cas d'erreur, on considère que la note n'existe pas
    }
};





// Méthode pour ajouter une note
const addNote = async (row) => {
    const evaluationId = row.evaluation_id;
    const noteAttribuee = row.note;
    const appreciation = row.appreciation;
    const bulletinId = row.id_bulletin;
    const periode = "1_semestre";

    if (!evaluationId || noteAttribuee === undefined || !appreciation) {
        errorMessage.value = 'Veuillez remplir tous les champs avant d\'ajouter la note.';
        // Masquer le message d'erreur après quelques secondes
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000);
        return;
    }

     // Vérifier si une note existe déjà pour cet élève et cette évaluation
     const noteExists = await checkNoteExistence(row.id_classeEleve, evaluationId);
    if (noteExists) {
        errorMessage.value = 'Cet élève a déjà une note pour cette évaluation.';
        // Masquer le message d'erreur après quelques secondes
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000);
        return;
    }

    try {
        const response = await ajouterNote({
            notes: noteAttribuee,
            commentaire: appreciation,
            evaluation_id: evaluationId,
            bulletin_id: bulletinId,
            periode: periode,
        });

        if (response.status >= 200 && response.status < 300) {
            // Réinitialiser les champs de l'élève
            row.note = null; // Réinitialiser la note
            row.appreciation = ''; // Réinitialiser l'appréciation
            row.evaluation = ''; // Réinitialiser l'évaluation (s'il y a un v-model)

            successMessage.value = 'La note a été ajoutée avec succès.';
            // Mettre à jour les données
            fetchData();

            // Masquer le message de succès après quelques secondes
            setTimeout(() => {
                successMessage.value = '';
            }, 3000);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note :', error);
        const errorMessageContent = error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.';
        errorMessage.value = errorMessageContent;
        
        // Masquer le message d'erreur après quelques secondes
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000);
    }
};

const updateNote = async (student) => {
    const updatedNote = {
        id: editingNoteId.value,
        evaluation_id: student.evaluation,
        notes: student.note,
        commentaire: student.appreciation,
        id_bulletin: student.id_bulletin
    };
    try {
        const response = await modifierNote(updatedNote);
        if (response.status === 200) {
            successMessage.value = 'La note a été modifiée avec succès.';

            // Réinitialiser les champs de l'élève après la mise à jour
            notesStudents.value = notesStudents.value.map(student => {
                return {
                    ...student,
                    note: null,
                    appreciation: '',
                    evaluation: '',
                };
            });

            // Rafraîchir les données après la modification
            await fetchData();
            isEditing.value = false;
            editingNoteId.value = null;

            // Cacher le message après quelques secondes
            setTimeout(() => {
                successMessage.value = '';
            }, 2000);

        } else {
            throw new Error('Erreur lors de la mise à jour de la note.');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la note:', error);
        errorMessage.value = error.message || 'Erreur lors de la mise à jour de la note.';

        // Cacher le message d'erreur après quelques secondes
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000);
    }
};

// Méthode pour remplir le formulaire lors de l'édition
const editNote = (id) => {
    const noteToEdit = tableData.value.find(note => note.id === id);
    if (noteToEdit) {
        // Remplir les valeurs de l'étudiant en fonction de la note à modifier
        notesStudents.value = notesStudents.value.map(student => {
            if (student.id_classeEleve === noteToEdit.idClasseEleve) {
                return {
                    ...student,
                    evaluation: noteToEdit.evaluation_id,
                    note: noteToEdit.note,
                    appreciation: noteToEdit.appreciation
                };
            }
            return student;
        });

        // Définir l'état d'édition
        isEditing.value = true;
        editingNoteId.value = id; // Garder l'ID de la note en cours d'édition
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

::v-deep .historiquesNotes .tableauNotes .tab-notes td:nth-child(7) {
    display: none;
}

::v-deep .historiquesNotes .tableauNotes .tab-notes td:nth-child(8) {
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
    background-color: #FAFAF7;
    /* height: 100vh; */
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
@media (max-width: 992px) {
  .main-content {
 width: 95%;
 margin-top: 50%;
 margin-left: auto;
 margin-right: auto;
  
}
  .main-content h2 {
  margin-left: 0px;
}


.tableauNote {
  margin-left: 50px;
}
.classes {
  margin-top: 0px;
}

.tableauNotes,
.addNotes {
    margin-left: 50px;
    margin-right: 50px;
}
select,
input {
    width: 130px;
}
table {
        font-size: 14px;
    }

    th,
    td {
        padding: 15px;
        font-size: 16px;
    }

    select,
    input {
        font-size: 14px;
    }
}
@media (max-width: 768px) {
    .main-content {
 width: 90%;
 margin-top: 60%;
 margin-left: auto;
 margin-right: auto;
  
}
::v-deep .addNotes .tableau1 .tab-planning1 td:nth-child(2) {
    display: none;
}
::v-deep .addNotes .tableau1 .tab-planning1 th:nth-child(2) {
    display: none;
}
.main-content h2 {
    font-size: 20px;
}
    table {
        display: block;
        overflow-x: auto; /* Permet le défilement horizontal */
    }

    tbody td:last-child {
        border-bottom: none; /* Pas de bordure pour la dernière cellule */
    }

    select,
    input {
        width: 100%;
        font-size: 12px;
    }

   
}
@media (max-width: 576px) {
  .main-content {
    width: 80%;
 margin-top: 225%;
 margin-left: auto;
 margin-right: auto;
  
}
.main-content h2 {
  font-size: 18px;
  text-align: center;
  width: 75%;
  margin-left: 15%;
}


.retour .btn-secondary,
.retour .btn-secondary:hover {
 
  width: 120px;
  height: 50px;
  font-size: 20px;
}

}
@media (max-width: 390px) {
    .main-content {
    width: 70%;
 margin-top: 225%;
 margin-left: auto;
 margin-right: auto;
  
}
}
@media (max-width: 360px) {
    .main-content {
    width: 70%;
 margin-top: 230%;
 margin-left: auto;
 margin-right: auto;
  
}
}
</style>