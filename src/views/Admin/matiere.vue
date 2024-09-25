<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <boutons
      title1="Matières" 
      title2="Professeurs"
      page1="matiere"
      page2="professeur"
    />

    <h2>Formulaire pour ajouter des Professeurs</h2>

    <div class="form">
     
    </div>

    <div class="matieres">
      <h3>Liste des Matieres</h3>
    </div> 

    <div class="tableau">
      <!-- Vérifier si la tableData est vide -->
      <tabEvaluations 
        v-if="paginatedData.length > 0"
        :headers="['N°', 'Matière', 'Coef', 'Description', 'Action']" 
        :data="paginatedData" 
      />

      <!-- Message affiché si la tableData est vide -->
      <p v-else class="no-evaluations-message">Aucune matière  trouvée.</p>
    </div>

    <!-- Composant de pagination -->
    <div class="pagination2">
      <pagination 
      v-if="tableData.length > pageSize"
      :totalItems="tableData.length"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChange="handlePageChange"
    />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import boutons from '@/components/boutons.vue';
import Formulaire from '@/components/formulaire.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getMatieres } from '@/services/MatiereService'; 

const tableData = ref([]);
const currentPage = ref(1); // Page actuelle
const pageSize = ref(5); // Nombre d'éléments par page

// Calculer les données à afficher pour la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});
// Fonction pour gérer le changement de page
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Récupérer les données
const fetchData = async () => {
  const response = await getMatieres();
  if (response && response.length > 0) {
    tableData.value = response.map((item, index) => [
      index + 1, // Ajouter un numéro séquentiel
      item.nom, 
      item.coefficient, 
      item.description,
    ]);
    console.log('Données du tableau :', tableData.value);
  } else {
    console.log('Aucune matière trouvée ou erreur lors de la récupération des données.');
  }
};


onMounted(() => {
  fetchData();
});
</script>

<style>
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
.professeurs {
  margin-top: 50px;
  margin-left: 300px;
  margin-right: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tableau{
  margin-left: 300px;
  margin-right: 50px;
}
.pagination2{
  margin-left: 275px;
  margin-right: 50px;
}
</style>
