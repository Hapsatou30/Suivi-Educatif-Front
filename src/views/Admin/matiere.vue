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

    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom de la matière :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.nom" 
              placeholder="Entrez le nom de la matière" 
              required 
            />
          </div>
          <div class="col-md-6">
            <label for="coefficient" class="form-label">Coefficient :</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="formData.coefficient" 
              placeholder="Entrez le coefficient" 
              required 
            />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-12">
            <label for="description" class="form-label">Description :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.description" 
              placeholder="Entrez une description" 
              style="height: 150px;"
              required 
            />
          </div>
        </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="matieres">
      <h3 style="font-size: 24px;">Liste des Matières</h3>
      <div class="tableau1">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-evaluations" 
          :headers="['N°', 'Nom', 'Coefficient', 'Description', 'Action']"
          :data="paginatedData.map(({ numero, nom, coefficient, description, id }) => ({
            numero,
            nom,
            coefficient,
            description,
            id 
          }))"
        >
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="editMatiere(row.id)" style="color: #4862C4;" title="Modifier la matière">
                <Icon icon="mdi:pencil-outline" /> 
              </button>
              <button class="btn " @click="deleteMatiere(row.id)" style="color: red;" title="Supprimer la matière">
                <Icon icon="mdi:trash-can-outline" /> 
              </button>
            </div>
          </template>
        </tabEvaluations>

        <p v-else class="no-evaluations-message">Aucune matière trouvée.</p>
      </div>

      <pagination 
        class="pagination1"
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
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getMatieres, ajouterMatiere, modifierMatiere, supprimerMatiere } from '@/services/MatiereService'; 
import Swal from 'sweetalert2';
import boutons from '@/components/boutons.vue';
import { Icon } from '@iconify/vue';

const formData = ref({
  nom: '',
  coefficient: '',
  description: '',
  id: null  
});

const editMatiere = (id) => {
  const row = tableData.value.find(item => item.id === id);
  if (row) {
    formData.value = {
      id: row.id, 
      nom: row.nom,
      coefficient: row.coefficient,
      description: row.description
    };
  }
};

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  console.log('Fetching data...');
  try {
    const response = await getMatieres();
if (response && response.données && response.données.length > 0) {
  tableData.value = response.données.map((item, index) => ({
    numero: index + 1,
    nom: item.nom,
    coefficient: item.coefficient,
    description: item.description,
    id: item.id  
  }));
} else {
  tableData.value = [];
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

const handleFormSubmit = async () => {
  try {
    const response = await (formData.value.id !== null ? modifierMatiere(formData.value) : ajouterMatiere(formData.value));
    
    const successMessage = formData.value.id !== null ? 'Matière modifiée avec succès !' : 'Matière ajoutée avec succès !';

    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: successMessage,
      confirmButtonColor: '#407CEE',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });

    await fetchData();
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.message || 'Une erreur inattendue s\'est produite.',
      confirmButtonColor: '#d33',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
};

const deleteMatiere = async (id) => {
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
      await supprimerMatiere(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'La matière a été supprimée avec succès.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          fetchData();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message 
        : error.message || 'Une erreur inattendue s\'est produite.';
        
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

const resetForm = () => {
  formData.value = {
    nom: '',
    coefficient: '',
    description: '',
    id: null 
  };
};

onMounted(fetchData);
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
.form-container {
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
    font-weight: bold;
}
input[type="text"],
input[type="number"],
select {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
textarea{
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  
}

.matieres .tableau1 {
    width: 92.7%;
}
.matieres{
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  margin-right: 50px;

}
.matieres h3{
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: start;
  margin-left: 300px;
}
.matieres .tab-evaluations td:nth-child(5) { 
  display: none; /* Masquer la colonne de l'ID */
}

.boutons{
  display: flex;
  justify-content: center;
}

.professeurs .pagination1{
  margin-right: 50px;
  display: flex;
  justify-content: end;
}
</style>
