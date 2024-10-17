<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Les notes de la matière : {{ matiere }}
        </h2>
        <div class="search-container" style="display: flex; align-items:  center; justify-content: end; margin-right: 50px;">
      <input 
        type="text" 
        v-model="searchQuery1" 
        class="form-control mb-3" 
        placeholder="Recherchez un élève " 
      />
    </div>
        <div class="classes">
            <div class="tableauNote">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-notes"
                    :headers="['Prénom & Nom', 'Matricule', '1er devoir', '2ème devoir', 'Examen']"
                    :data="paginatedData">
                </tabEvaluations>
                <p v-else class="alert alert-info">
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


// const profClasseId = route.params.id;
const id_profMat = route.params.id_profMat;
const matiere = route.params.matiere;

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Déclaration d'une fonction asynchrone nommée fetchData
const fetchData = async () => {
    const response = await getNoteClasse(id_profMat);

    // Vérifiez si la réponse contient des données
    if (response && response.données && response.données.length > 0) {
        // Si des données existent, on les extrait dans notesData
        const notesData = response.données;
        
        // Regroupement des notes par élève
        const groupedData = notesData.reduce((acc, note) => {
            // Destructuration de l'objet note pour obtenir les propriétés 
            const { eleve, note: noteValue, evaluation } = note;

            // Créez une clé unique pour chaque élève en utilisant son matricule
            const key = `${eleve.matricule}`;

            // Vérifie si l'élève n'est pas déjà dans l'accumulateur acc
            if (!acc[key]) {
                // Si l'élève n'existe pas, on l'initialise avec ses informations et les notes à null
                acc[key] = {
                    eleve: `${eleve.prenom} ${eleve.nom}`, // Concatène le prénom et le nom
                    matricule: eleve.matricule, 
                    premierDevoir: "vide",
                    deuxiemeDevoir: "vide",
                    examen: "vide", 
                };
            }

            // Placer la note dans la bonne colonne selon le type d'évaluation
            if (evaluation === "Devoir") {
                // Si l'évaluation est un devoir
                if (acc[key].premierDevoir === "vide") {
                    // Si aucun premier devoir n'est enregistré, on l'assigne à noteValue
                    acc[key].premierDevoir = noteValue; // 1er devoir
                } else if (acc[key].deuxiemeDevoir === "vide") {
                    // Sinon, si aucun deuxième devoir n'est enregistré, on l'assigne à noteValue
                    acc[key].deuxiemeDevoir = noteValue; // 2ème devoir
                }
            }  else if (evaluation === "Examen") {
                // Si l'évaluation est un examen, on l'assigne à la propriété examen
                acc[key].examen = noteValue; // Examen
            }

            // Retourne l'accumulateur mis à jour pour la prochaine itération
            return acc;
        }, {}); // {} est l'objet initial pour acc

        // Convertir l'objet regroupé en tableau et l'assigner à tableData
        tableData.value = Object.values(groupedData);

    } 
};
// propriété pour la barre de recherche
const searchQuery1 = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredEleves = computed(() => {
    // Si la requête de recherche est vide, on retourne tous les matieres
  if (!searchQuery1.value) {
    return tableData.value;
  }
    // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery1.value.toLowerCase();
  return tableData.value.filter(eleve =>
    eleve.eleve.toLowerCase().includes(lowerCaseQuery) ||
    eleve.matricule.toLowerCase().includes(lowerCaseQuery) 
   
  );
});

const handlePageChange = (page) => {
    currentPage.value = page;
};

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filteredEleves.value.slice(start, end).map(({ eleve, matricule, premierDevoir, deuxiemeDevoir, examen }) => ({
        eleve,
        matricule,
        premierDevoir,
        deuxiemeDevoir,
        examen,
    }));
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

.classes h3 {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: start;
    margin-left: 300px;
}

.tableauNote {
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

.retour {
    display: flex;
    justify-content: end;
    margin-right: 50px;
    margin-bottom: 20px;
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