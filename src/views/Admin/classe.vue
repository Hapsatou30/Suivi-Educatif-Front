<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <boutons
      title1="Classes"
      title2="Années Scolaires"
      page1="classes"
      page2="annees"
    />
    <h2>Formulaire pour ajouter des classes</h2>
    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.nom" 
              placeholder="Entrez le nom de la classe" 
              required 
            />
          </div>
          <div class="col-md-6">
            <label for="niveau" class="form-label">Niveau :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.niveau" 
              placeholder="Entrez le niveau" 
              required 
            />
          </div>
        </div>
        <div class="row d-flex" style="display: flex; align-items: center;">
          <div class="col-md-6">
            <label for="capacite" class="form-label">Capacité :</label>
            <input 
              type="number" 
              class="form-control" 
              v-model="formData.capacite" 
              placeholder="Entrez la capacité" 
              required 
            />
          </div>
          <div class="col-md-6 mt-4" style="display: flex; justify-content: end;">
            <button type="submit" class="btn btn-submit">Enregistrer</button>
          </div>
        </div>
      </form>
    </div>

    <div class="classes">
      <h3 style="font-size: 24px;">Liste des Classes</h3>

      <div class="tableau1">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-evaluations"
          :headers="['N°', 'Nom ', 'Capacité', 'Niveau', 'Action']"
          :data="paginatedData.map(({ numero, nom, capacite,niveau, id }) => ({
            numero,
            nom,
            capacite,
            niveau,
            id
            
          }))"
        >
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="editClasse(row.id)" style=" color: #4862C4;" title="Modifier la classe">
                <Icon icon="mdi:pencil-outline" /> 
              </button>
              <button class="btn " @click="deleteClasse(row.id)" style="color: red;" title="Supprimer la classe">
                <Icon icon="mdi:trash-can-outline" /> 
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getClasses, ajouterClasse, modifierClasse, supprimerClasse } from '@/services/ClasseService'; 
import Swal from 'sweetalert2';
import boutons from '@/components/boutons.vue';
import { Icon } from '@iconify/vue';

const formData = ref({
  nom: '',
  niveau: '',
  capacite: '',
  id: null  
});

const editClasse = (id) => {
  const row = tableData.value.find(item => item.id === id);
  if (row) {
    formData.value = {
      id: row.id, 
      nom: row.nom,
      niveau: row.niveau,
      capacite: row.capacite
    };
  }
};

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getClasses();
    tableData.value = response.map((item, index) => ({
      numero: index + 1, 
      nom: item.nom,
      niveau: item.niveau,
      capacite: item.capacite,
      id: item.id  
    }));
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
    const response = await (formData.value.id !== null ? modifierClasse(formData.value) : ajouterClasse(formData.value));
    const successMessage = formData.value.id !== null ? 'Classe modifiée avec succès !' : 'Classe ajoutée avec succès !';

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
    resetForm();
  }
};

const deleteClasse = async (id) => {
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
      await supprimerClasse(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'La classe a été supprimée avec succès.',
        icon: 'success',
        timer: 3000,
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

const resetForm = () => {
  formData.value = {
    nom: '',
    niveau: '',
    capacite: '',
    id: null 
  };
};

onMounted(fetchData);
</script>


<style scoped>
/* Masquer la colonne ID dans le tableau */
.tab-evaluations td:nth-child(4)  { 
  display: none; /* Masquer la colonne de l'ID */
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
.form-container {
  max-width: 100%;
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
  width: 100%; /* Changez ceci pour s'adapter à votre mise en page */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 58px;
}
input::placeholder {
  color: #ccc;
  font-size: 12px;
}

 .col-md-6 .btn-submit {
  background-color: #407CEE;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 8px;
  width: 200px;
  height: 58px;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  margin-top: 10px;
}
 .col-md-6 .btn-submit:hover {
  background-color: #365F9B; /* Change la couleur au survol */
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
</style>
