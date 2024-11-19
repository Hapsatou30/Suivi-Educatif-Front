<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content2">
    <boutons title1="Matières" title2="Professeurs" page1="matiere" page2="professeur" />

    <h2>Formulaire pour ajouter des Matières</h2>

    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div v-if="loading" class="loader">
          <p>Traitement en cours...</p>
        </div>
        <div v-else>
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom de la matière :</label>
            <input type="text" class="form-control" v-model="formData.nom" placeholder="Entrez le nom de la matière"
              @blur="validateField('nom')" :class="{ 'is-invalid': errors.nom }" required />
            <div v-if="errors.nom" class="text-danger">{{ errors.nom }}</div>
          </div>
          <div class="col-md-6">
            <label for="coefficient" class="form-label">Coefficient :</label>
            <input type="number" class="form-control" v-model="formData.coefficient" placeholder="Entrez le coefficient"
              @blur="validateField('coefficient')" :class="{ 'is-invalid': errors.coefficient }" required />
            <div v-if="errors.coefficient" class="text-danger">{{ errors.coefficient }}</div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-12">
            <label for="description" class="form-label">Description :</label>
            <textarea class="form-control" v-model="formData.description" placeholder="Entrez une description"
              style="height: 150px;" @input="validateField('description')" :class="{ 'is-invalid': errors.description }"
              maxlength="100" required>
            </textarea>
            <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
            <div class="text-muted">{{ 100 - formData.description.length }} caractères.</div>
          </div>
        </div>
      </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit" :disabled="!formIsValid">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="matieres">
      <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
      <div class="title_recherche" style="display: flex; align-items:  center; justify-content: space-between;">
        <h3>Liste des Matières</h3>
    
    <!-- Barre de recherche -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="form-control mb-3" 
        placeholder="Recherchez une matiere " 
      />
    </div>
      </div>
      <div class="tableau1">
        <tabEvaluations v-if="paginatedData.length > 0" class="tab-evaluations"
          :headers="['N°', 'Nom', 'Coefficient', 'Description', 'Action']" :data="paginatedData.map(({ numero, nom, coefficient, description, id }) => ({
            numero,
            nom,
            coefficient,
            description,
            id
          }))">
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="editMatiere(row.id)" style="color: #407CEE;" title="Modifier la matière">
                <Icon icon="mdi:pencil-outline" />
              </button>
              <button class="btn " @click="deleteMatiere(row.id)" style="color: red;" title="Supprimer la matière">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
          </template>
        </tabEvaluations>

        <p v-else class="alert alert-info">
          Aucune matière trouvée.
        </p>
      </div>

      <pagination class="pagination2" v-if="tableData.length > pageSize" :totalItems="tableData.length"
        :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
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
const loading = ref(false);  //  variable pour gérer l'affichage du loader

const formData = ref({
  nom: '',
  coefficient: '',
  description: '',
  id: null
});

const errors = ref({
  nom: null,
  coefficient: null,
  description: null
});
const successMessage = ref('');
const errorMessage = ref('');
const validateField = (field) => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;  // Pour valider nom et prénom

  if (!formData.value[field]) {
    errors.value[field] = `Le champ ${field} est obligatoire.`;
  } else if (field === 'nom' && !nameRegex.test(formData.value.nom)) {
    errors.value.nom = "Le champ nom ne doit pas contenir de chiffres ni de caractères spéciaux.";
  } else if (field === 'coefficient' && (isNaN(formData.value.coefficient) || formData.value.coefficient <= 0)) {
    errors.value.coefficient = "Le coefficient doit être un nombre positif.";
  } else if (field === 'description' && formData.value.description.length > 100) {
    errors.value.description = "La description ne doit pas dépasser 100 caractères.";
  } else {
    errors.value[field] = null;
  }
};


const formIsValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null) &&
    Object.values(formData.value).every(field => field !== '');
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
  // console.log('Fetching data...');
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

// propriété pour la barre de recherche
const searchQuery = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredMatieres = computed(() => {
    // Si la requête de recherche est vide, on retourne tous les matieres
  if (!searchQuery.value) {
    return tableData.value;
  }
    // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return tableData.value.filter(matiere =>
    matiere.nom.toLowerCase().includes(lowerCaseQuery) ||
    matiere.description.toLowerCase().includes(lowerCaseQuery)
   
  );
});
const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredMatieres.value.slice(start, end);
});



const handleFormSubmit = async () => {
    validateField('nom');
    validateField('coefficient');
    validateField('description');

    if (!formIsValid.value) {
        return; // Stop if the form is invalid
    }
    loading.value = true;  // Active le loader

    try {
        const response = await (formData.value.id !== null ? modifierMatiere(formData.value) : ajouterMatiere(formData.value));

        // Utiliser la variable réactive pour définir le message de succès
        successMessage.value = formData.value.id !== null 
            ? 'Matière modifiée avec succès !' 
            : 'Matière ajoutée avec succès !';

        errorMessage.value = ''; // Réinitialiser le message d'erreur

        // Réinitialiser le formulaire et les messages après un délai
        setTimeout(() => {
            successMessage.value = '';
            resetForm();
        }, 2000);

        await fetchData();
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
        // Définir le message d'erreur
        errorMessage.value = error.message || 'Une erreur inattendue s\'est produite.';
        successMessage.value = ''; // Réinitialiser le message de succès
    }
    finally {
        loading.value = false;  // Désactive le loader, que l'opération soit réussie ou échouée
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

<style scoped>
  ::v-deep .tableau1 td:nth-child(5)  { 
    display: none; /* Masquer la colonne de l'ID */
  }
.main-content2 {
  margin-top: 120px;
  overflow-x: hidden;
  background-color: #FAFAF7;
}

.main-content2 h2 {
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

label:hover {
  cursor: pointer;
  /* Change le curseur lors du survol */
  color: #407CEE;
  /* Couleur au survol */
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

textarea {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;

}

.matieres .tableau1 {
  width: 100%;
}

.matieres {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  margin-left: 300px;
  margin-right: 50px;


}

.matieres h3 {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.matieres .tab-evaluations td:nth-child(5) {
  display: none;
  /* Masquer la colonne de l'ID */
}

.boutons {
  display: flex;
  justify-content: center;
}

.matieres .pagination2 {
  display: flex;
  justify-content: end;

}

p {
  font-size: 18px;
  color: red;
  font-family: "Poppins", sans-serif;
}

.bouton .btn-submit:disabled {
  background-color: #407CEE;
  /* couleur gris pour montrer qu'il est désactivé */
  color: #666666;
  /* texte grisé */
  cursor: not-allowed;
  /* curseur modifié pour indiquer qu'il n'est pas cliquable */
  opacity: 0.6;
  /* rendre le bouton semi-transparent */
}
@media (max-width: 992px) {
 .main-content2{
  margin-top: 600px;
  margin-left: 0;
  overflow: hidden;
 }
 .main-content2 h2 {
    font-size: 24px;
    text-align: center;
    margin-left: 0px;
}
.main-content2 .form-container {
    max-width: 100%;
    margin-top: 30px;
    padding: 30px;
    margin-left: 10%;
    margin-right: 10%;
  }
  .matieres {
    margin-left: 10%;
    margin-right: 10%;
}

}
@media (max-width: 768px) {
  .main-content2{
  margin-top: 750px;

 }
}
@media (max-width: 576px) {
  .main-content2{
  margin-top: 950px;
 }
 .main-content2 h2{
  font-size: 18px;
 }
 .title_recherche{
  flex-direction: column
 }
 .search-container input{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    border-radius: 12px;
    width: 300px;
  }
  .bouton{
    display: flex;
    align-items:center;
    justify-content: center;
  }
}
@media (max-width: 360px) {
  .main-content2{
  margin-top: 1020px;
  width: 80%;
  margin-left: auto;
  margin-right: auto
 }
 .main-content2 h2{
  font-size: 16px;
 }
}
</style>
