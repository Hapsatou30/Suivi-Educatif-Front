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

    <h2>Formulaire pour ajouter des Matières</h2>

    <!-- Formulaire d'ajout de matière avec Bootstrap -->
    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom de la matière :</label>
            <input type="text" class="form-control" v-model="newMatiere.nom" placeholder="Entrez le nom de la matière" required />
          </div>
          <div class="col-md-6">
            <label for="coefficient" class="form-label">Coefficient :</label>
            <input type="number" class="form-control" v-model="newMatiere.coefficient" placeholder="Entrez le coefficient" required />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-12">
            <label for="description" class="form-label">Description :</label>
            <textarea class="form-control" v-model="newMatiere.description" placeholder="Entrez la description" required style="height: 150px;"></textarea>
          </div>
        </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="matieres">
      <h3>Liste des Matières</h3>
    </div> 

    <div class="tableau">
      <tabEvaluations 
        v-if="paginatedData.length > 0"
        :headers="['N°', 'Matière', 'Coef', 'Description', 'Action']" 
        :data="paginatedData" 
      />

      <p v-else class="no-evaluations-message">Aucune matière trouvée.</p>
    </div>

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
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getMatieres, ajouterMatiere } from '@/services/MatiereService'; 
import Swal from 'sweetalert2';

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Nouveau matière
const newMatiere = ref({
  nom: '',
  coefficient: '',
  description: ''
});

const handleFormSubmit = async () => {
  try {
    const response = await ajouterMatiere(newMatiere.value);
    if (response.status === 201) { 
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Matière ajoutée avec succès !',
        confirmButtonColor: '#407CEE',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      await fetchData();  // Recharger les données après ajout
      resetForm(); // Réinitialiser le formulaire
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'ajout de la matière.',
        confirmButtonColor: '#d33',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur inattendue s\'est produite.',
      confirmButtonColor: '#d33',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
};

// Réinitialiser le formulaire après soumission
const resetForm = () => {
  newMatiere.value = {
    nom: '',
    coefficient: '',
    description: ''
  };
};

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
  } else {
    console.log('Aucune matière trouvée ou erreur lors de la récupération des données.');
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style >
.form-container {
  max-width: 1090px;
  border: 1px solid #F7AE00;
  border-radius: 12px;
  background-color: white;
  margin-left: 300px;
  margin-right: 50px;
  margin-top: 30px;
  padding: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 20px;
}

input {
  width: 395px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 58px;
}
textarea .form-control{
  width: 990px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 200px;
}

input::placeholder, textarea::placeholder {
  color: #ccc;
  font-size: 12px;
}

.bouton .btn-submit {
  background-color: #407CEE;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  width: 200px;
  height: 58px;
}

.bouton .btn-submit:hover {
  background-color: #3656a4;
}
.bouton {
  display: flex;
  justify-content: end;
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
.matieres {
  margin-top: 50px;
  margin-left: 300px;
  margin-right: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tableau {
  margin-left: 300px;
  margin-right: 50px;
}
.pagination2 {
  margin-left: 275px;
  margin-right: 50px;
  display: flex;
  justify-content: end;
}
</style>
