<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
        <div class="addNotes">
            <h2>Ajouter des notes pour la classe de {{  nom_classe }}</h2>
        </div>
        <div class="historiquesNotes">
            <h2>Historique des Notes</h2>
            <div class="tableauNotes">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-notes"
                    :headers="['Prenom & Nom ', 'Matricule', 'Evaluation', 'Note',  'Appréciation', 'Action']"
                    :data="paginatedData.map(({ prenom, nom, matricule, evaluation, note, appreciation, id }) => ({ eleve: `${prenom} ${nom}`, matricule, evaluation, note, appreciation, id }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="editNote(row.id)" style="color: #407CEE;"
                                title="Modifier le cahier de texte">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                            <button class="btn" @click="deleteNote(row.id)" style="color: red;"
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
import { getNoteClasse } from '@/services/NotesService';
import { Icon } from '@iconify/vue';
// import Swal from 'sweetalert2';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getNoteClasse(classeProf_id);
    // Mapper les données pour inclure les informations des élèves
    tableData.value = response.données.map(({ eleve, evaluation, note, appreciation, matiere,id}) => ({
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

// Pagination pour les évaluations à venir
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return tableData.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};
onMounted(async () => {
    await fetchData();
});
</script>

<style scoped>
/* Masquer la colonne ID dans le tableau */
::v-deep .historiquesNotes .tableauNotes .tab-notes td:nth-child(6) {
    display: none;
}



.tableauNotes {
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
</style>