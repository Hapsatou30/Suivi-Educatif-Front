<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content2">
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
            @blur="validateField('nom')" 
            :class="{ 'is-invalid': errors.nom }" 
            required 
          />
          <div v-if="errors.nom" class="text-danger">{{ errors.nom }}</div>
     </div>
          <div class="col-md-6">
            <label for="niveau" class="form-label">Niveau :</label>
            <input 
            type="text" 
            class="form-control" 
            v-model="formData.niveau" 
            placeholder="Entrez le niveau" 
            @blur="validateField('niveau')" 
            :class="{ 'is-invalid': errors.niveau }" 
            required 
          />
          <div v-if="errors.niveau" class="text-danger">{{ errors.niveau }}</div>
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
            @blur="validateField('capacite')" 
            :class="{ 'is-invalid': errors.capacite }" 
            required 
          />
          <div v-if="errors.capacite" class="text-danger">{{ errors.capacite }}</div>
        </div>
          <div class="col-md-6 mt-4" style="display: flex; justify-content: end;">
            <button type="submit" class="btn btn-submit" :disabled="!formIsValid">Enregistrer</button>
          </div>
        </div>
      </form>
    </div>

    <div class="classes">
      <div class="title_recherche" style="display: flex; align-items:  center; justify-content: space-between;">
        <h3>Liste des Classes</h3>
    
    <!-- Barre de recherche -->
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="form-control mb-3" 
        placeholder="Recherchez une classe " 
      />
    </div>
      </div>

      <div class="tableau1">
        <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
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
              <button class="btn " @click="editClasse(row.id)" style=" color: #407CEE;" title="Modifier la classe">
                <Icon icon="mdi:pencil-outline" /> 
              </button>
              <button class="btn " @click="deleteClasse(row.id)" style="color: red;" title="Supprimer la classe">
                <Icon icon="mdi:trash-can-outline" /> 
              </button>
            </div>
          </template>
        </tabEvaluations>
        <p v-else class="alert alert-info" >
          Aucune classe trouvée.
        </p>
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

const successMessage = ref('');
const errorMessage = ref('');
const errors = ref({
  nom: null,
  niveau: null,
  capacite: null,
});

const validateField = (field) => {
  if (!formData.value[field]) {
    errors.value[field] = `Le champ ${field} est obligatoire.`;
  } else {
    errors.value[field] = null;
  }


  if (field === 'capacite') {
    if (isNaN(formData.value.capacite) || formData.value.capacite <= 0) {
      errors.value.capacite = "Veuillez entrer une capacité valide.";
    } else {
      errors.value.capacite = null;
    }
  }
};

// Vérifier si le formulaire est valide
const formIsValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null) &&
         Object.values(formData.value).every(field => field !== '');
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
// propriété pour la barre de recherche
const searchQuery = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredClasses = computed(() => {
    // Si la requête de recherche est vide, on retourne tous les matieres
  if (!searchQuery.value) {
    return tableData.value;
  }
    // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return tableData.value.filter(classe =>
    classe.nom.toLowerCase().includes(lowerCaseQuery) ||
    classe.niveau.toLowerCase().includes(lowerCaseQuery)
   
  );
});

const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredClasses.value.slice(start, end);
});

const handleFormSubmit = async () => {
    // Valider tous les champs avant de soumettre
    validateField('nom');
    validateField('niveau');
    validateField('capacite');

    if (!formIsValid.value) {
        return; // Arrêter la soumission si le formulaire n'est pas valide
    }

    try {
        const response = await (formData.value.id !== null ? modifierClasse(formData.value) : ajouterClasse(formData.value));
        const msg = formData.value.id !== null ? 'Classe modifiée avec succès !' : 'Classe ajoutée avec succès !';

        // Afficher le message de succès
        successMessage.value = msg; // Utilisez msg ici
        errorMessage.value = ''; // Réinitialiser le message d'erreur

        // Réinitialiser le message de succès après un délai
        setTimeout(() => {
            successMessage.value = '';
        }, 2000); // 2 secondes

        await fetchData();
        resetForm();
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
        
        // Définir le message d'erreur
        errorMessage.value = error.message || 'Une erreur inattendue s\'est produite.';
        successMessage.value = ''; // Réinitialiser le message de succès

        // Réinitialiser le message d'erreur après un délai
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000); // 3 secondes
        
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
::v-deep  .tab-evaluations td:nth-child(5)  { 
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
.main-content2 { 
  margin-top: 120px;
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
label:hover {
      cursor: pointer; /* Change le curseur lors du survol */
      color: #407CEE; /* Couleur au survol */
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
.search-container input{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    border-radius: 12px;
    width: 350px;
    margin-right: 50px;
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
@media (max-width: 992px) {
 .main-content2{
  margin-top: 360px;
 
  margin-left: 0;
 }
 .main-content2  h3,  .main-content2  h2{
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
  .classes {
    margin-left: 10%;
    margin-right: 10%;
}
.tableau1{
  margin-left: 0;
  margin-right: 0;
}

}
@media (max-width: 768px) {
  .main-content2{
  margin-top: 550px;
 }
}
@media (max-width: 576px) {
  .main-content2{
  margin-top: 750px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
 }
 .main-content2 h2{
  font-size: 18px;
 }
 .title_recherche{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
 }
 .search-container input{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    border-radius: 12px;
    width: 300px;
    margin-left: 5%
  }
  .bouton{
    display: flex;
    align-items:center;
    justify-content: center;
  }
}
@media (max-width: 390px) {
  .main-content2 {
    margin-top: 900px;
  width: 85%;
  
}
}
@media (max-width: 360px) {
  .main-content2{
  margin-top: 770px;
  width: 80%;
  margin-left: auto;
  margin-right: auto
 }
 .main-content2 h2{
  font-size: 16px;
 }
}

</style>
