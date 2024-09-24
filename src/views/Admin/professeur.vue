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
      <Formulaire
          :fields="[
          { id: 'name', label: 'Nom', type: 'text', placeholder: 'Entrez votre nom', model: 'name', required: true },
          { id: 'prenom', label: 'Prénom', type: 'text', placeholder: 'Entrez votre prénom', model: 'prenom', required: true },
          { id: 'email', label: 'Email', type: 'email', placeholder: 'Entrez votre email', model: 'email', required: true },
          { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: 'Entrez votre numéro de téléphone', required: true },
          ]"
          submitButtonLabel="Enregistrer"
      />
    </div>

    <div class="professeurs">
      <h3>Liste des Professeurs</h3>
    </div> 

    <div class="tableau">
      <!-- Vérifier si la tableData est vide -->
      <tabEvaluations 
        v-if="paginatedData.length > 0"
        :headers="['Matricule', 'Prénom & Nom', 'Contact', 'Action']" 
        :data="paginatedData" 
      />

      <!-- Message affiché si la tableData est vide -->
      <p v-else class="no-evaluations-message">Aucun professeur trouvé.</p>
    </div>

    <!-- Composant de pagination -->
    <pagination class="pagination"
      v-if="tableData.length > pageSize"
      :totalItems="tableData.length"
      :pageSize="pageSize"
      :currentPage="currentPage"
      @pageChange="handlePageChange"
    />
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
import { getProfesseurs } from '@/services/ProfesseurService';

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
  const response = await getProfesseurs();
  if (response && response.length > 0) {
    tableData.value = response.map(item => [
      item.matricule, // Vérifiez que ces propriétés existent dans votre réponse
      item.prenom, 
      item.nom,
      item.telephone,
      item.email,
    ]);
    console.log('Données du tableau :', tableData.value);
  } else {
    console.log('Aucun professeur trouvé ou erreur lors de la récupération des données.');
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

.pagination{
  margin-left: 300px;
  margin-right: 50px;
}
</style>
