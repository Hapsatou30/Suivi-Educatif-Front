<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
      <h2>Liste des classes ouvertes pour l’année : {{ anneeScolaire }} </h2>
  
      <div class="classes">
        <div class="tableau1">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-evaluations"
          :headers="['N°', 'Nom ', 'Capacité','Niveau', 'Matières']"
          :data="paginatedData.map(({ numero, nom, capacite, niveau, id }) => ({
            numero,
            nom,
            capacite,
            niveau,
            id
            
          }))"
        >
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn" @click="editClasse(row.id)" style=" color: #4862C4; font-size: 30px;" title="Attribuer des classes aux professeurs">
                <Icon icon="mdi:pencil-outline" /> 
              </button>
              <button class="btn" @click="seeClasse(row.id)" style="color: red; font-size: 40px;" title="voir les infos la classe">
                <Icon icon="marketeq:eye" /> 
              </button>
            </div>
          </template>
        </tabEvaluations>

        <p v-else class="no-evaluations-message">Aucune classe trouvée.</p>
      </div>

      <pagination class="pagination1"
        v-if="tableData.length > pageSize"
        :totalItems="tableData.length"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @pageChange="handlePageChange"
      />
      </div>
     <div class="retour">
      <button @click="retour" class="btn btn-secondary">Retour</button>
     </div>
    </div>
  </template>

  <script setup>
import { ref, computed, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import {  useRoute, useRouter } from 'vue-router';
import { getAnneClasses } from '@/services/AnneeClasseService';
import {  getAnneeDetails } from '@/services/AnneeScolaireService';
import { Icon } from '@iconify/vue';
const route = useRoute();

const router = useRouter();

const anneeScolaire = ref('');
const anneeId = route.params.id;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getAnneClasses();
    // Filtrer pour trouver l'année correspondant à l'ID passé dans l'URL
    const selectedAnnee = response.données.find(annee => annee.id === parseInt(anneeId));
    
    if (selectedAnnee) {
      // Si l'année est trouvée, on mappe ses classes pour les afficher
      tableData.value = selectedAnnee.classes.map((item, index) => ({
        numero: index + 1, 
        nom: item.nom,
        niveau: item.niveau,
        capacite: item.capacite,
        id: item.id
      }));
    } else {
      console.error('Aucune année correspondante trouvée.');
      tableData.value = []; // Aucune classe trouvée
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
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
// Méthode pour récupérer les détails d'une année
const detailsAnnee = async (id) => {
  try {
    const response = await getAnneeDetails(id);
    // console.log('Réponse API brute:', response); // Vérifier ce que retourne réellement l'API

    // Vérification si response contient un objet valide
    if (response && response.données) {
      const annee = response.données;
      // console.log('Détails de l\'année:', annee);
      anneeScolaire.value = `${annee.annee_debut} - ${annee.annee_fin}`;
    } else {
      console.error('Aucun détail de l\'année trouvé ou structure inattendue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du annees-scolaires :', error);
  }
};

onMounted(() => {
  console.log('ID de l\'annee:', anneeId);
  detailsAnnee(anneeId);
  fetchData(); 
});

// Méthode pour retourner à la page précédente
const retour = () => {
  router.back();
};
</script>

<style scoped>
/* Masquer la colonne ID dans le tableau */
.classes .tableau1 .tab-evaluations td:nth-child(3)  { 
  display: none; /* Masquer la colonne de l'ID */
}
.classes .tableau1 .tab-evaluations td:nth-child(4)  { 
  display: none; 
}


.boutons {
    background-color: transparent; 
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}
.boutons .btn{
  font-size: 24px;
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
.classes p {
  font-size: 18px;
  color: red;
  font-family: "Poppins", sans-serif;
}

</style>
