<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Les notes de la matière : {{ nomMatiere }}
        </h2>
        <div class="classes">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-evaluations"
                    :headers="['Matière', 'Note', 'Évaluation', 'Élève']" 
                    :data="paginatedData.map(({ matiere, note, evaluation, eleve }) => ({
                        matiere,
                        note,
                        evaluation,
                        eleve: `${eleve.prenom} ${eleve.nom}` // Concatène prénom et nom de l'élève
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="redirectToSubject(row.id)"
                                style="color: #407CEE; font-size: 40px;" title="Voir les détails">
                                <Icon icon="marketeq:eye" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>

                <p v-else class="alert alert-info" >
          Aucune note trouvée.
        </p>
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
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import { getNoteClasse } from '@/services/NotesService';
import { Icon } from '@iconify/vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';

const router = useRouter();
const route = useRoute();

const nomMatiere = ref(''); // Vous pouvez définir un nom de matière ici
const profClasseId = route.params.id;

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
    const response = await getNoteClasse(profClasseId); // Appeler votre méthode pour récupérer les notes
    
    // console.log('Réponse complète des notes:', response); // Affichez la réponse pour vérification

    // Vérifiez si la réponse contient des données
    if (response && response.données && response.données.length > 0) {
        const notesData = response.données; // Récupérer les notes
        tableData.value = notesData; // Mettre à jour tableData avec les notes récupérées

        // Récupérer la matière de la première entrée
        nomMatiere.value = notesData[0].matiere || 'Matière inconnue'; // Définit le nom de la matière
        // console.log('Nom de la matière:', nomMatiere.value);

    } else {
        // console.log('Aucune note trouvée pour ce professeur.'); // Gérer le cas où il n'y a pas de notes
        nomMatiere.value = 'Aucune matière trouvée'; // Valeur par défaut en l'absence de données
    }
};


const handlePageChange = (page) => {
    currentPage.value = page;
};

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});

// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};

// Appel des méthodes dans onMounted
onMounted(() => {
    // console.log(profClasseId);
    fetchData(); // Appel de fetchData pour récupérer les notes
});
</script>



<style scoped>

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

.classes {
  margin-top: 50px;
}
.classes h3{
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: start;
  margin-left: 300px;
}
.tableau1 {
  margin-left: 300px;
  margin-right: 50px;
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
.retour{
  display: flex;
  justify-content: end;
  margin-right: 50px;
  margin-bottom: 20px;
}
.retour .btn-secondary, .retour .btn-secondary:hover {
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