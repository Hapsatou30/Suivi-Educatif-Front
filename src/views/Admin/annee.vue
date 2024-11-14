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
    <h2>Formulaire pour ajouter les années scolaires</h2>

    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="annee_debut" class="form-label">Année de début :</label>
            <input 
            type="text" 
            class="form-control" 
            v-model="formData.annee_debut" 
            placeholder="Entrez l'année de début" 
            @blur="validateField('annee_debut')" 
            :class="{ 'is-invalid': errors.annee_debut }" 
            required 
          />
          <div v-if="errors.annee_debut" class="text-danger">{{ errors.annee_debut }}</div>
          </div>
          <div class="col-md-6">
            <label for="annee_fin" class="form-label">Année de fin :</label>
            <input 
            type="text" 
            class="form-control" 
            v-model="formData.annee_fin" 
            placeholder="Entrez l'année de fin" 
            @blur="validateField('annee_fin')" 
            :class="{ 'is-invalid': errors.annee_fin }" 
            required 
          />
          <div v-if="errors.annee_fin" class="text-danger">{{ errors.annee_fin }}</div>
          </div>
        </div>

        <div class="row mb-3" v-if="formData.id !== null">
          <div class="col-md-6">
            <label for="etat" class="form-label">État :</label>
            <select 
            id="etat" 
            class="form-select" 
            v-model="formData.etat" 
            @blur="validateField('etat')" 
            :class="{ 'is-invalid': errors.etat }" 
            required
          >
            <option value="Fermée">Fermée</option>
            <option value="En_cours">En cours</option>
          </select>
          <div v-if="errors.etat" class="text-danger">{{ errors.etat }}</div>
        </div>
        </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit" :disabled="!formIsValid">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="annees">
      <h3 style="font-size: 24px;">Liste des Années scolaires</h3>
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
          :headers="['N°', 'Année de début', 'Année de fin', 'État', 'Action']"
          :data="paginatedData.map(({ numero, annee_debut, annee_fin, etat, id }) => ({
            numero,
            annee_debut,
            annee_fin,
            etat,
            id 
          }))"
        >
          <template #actions="{ row }">
           <div class="boutons">
            <button class="btn" @click="redirectToAnneeClasses(row.id)" style="color: #F7AE00;" title="Attribuer des classes">
                <Icon icon="material-symbols:school" /> 
              </button>
            <button class="btn " @click="editAnnee(row.id)" style=" color: #407CEE;" title="Modifier l'année">
                     <Icon icon="mdi:pencil-outline" /> 
            </button>
            <button class="btn" @click="redirectToClassesList(row.id)" style="color: #F7AE00;" title="Liste des classes ouvertes">
                <Icon icon="clarity:list-line" /> 
              </button>
          <button class="btn " @click="deleteAnnee(row.id)" style="color: red;" title="Supprimer l'année">
            <Icon icon="mdi:trash-can-outline" /> 
         </button>
           </div>
          </template>
        </tabEvaluations>


        <p v-else class="alert alert-info" >
          Aucune année trouvée.
        </p>
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
import { getAnnees, ajouterAnnee, modifierAnnee, supprimerAnnee } from '@/services/AnneeScolaireService'; 
import Swal from 'sweetalert2';
import boutons from '@/components/boutons.vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const formData = ref({
  annee_debut: '',
  annee_fin: '',
  etat: 'Fermée', 
  id: null  
});

const successMessage = ref('');
const errorMessage = ref('');
const errors = ref({
  annee_debut: null,
  annee_fin: null,
  etat: null
});

const anneeEnCours = new Date().getFullYear(); // Obtient l'année actuelle

const validateField = (field) => {
  // Vérification si le champ est vide
  if (!formData.value[field]) {
    errors.value[field] = `Le champ ${field} est obligatoire.`;
    return;
  } else {
    errors.value[field] = null;
  }

  // Validation pour 'annee_debut'
  if (field === 'annee_debut') {
    const anneeDebut = parseInt(formData.value.annee_debut);

    // Vérifie si 'annee_debut' est un nombre valide
    if (isNaN(anneeDebut) || formData.value.annee_debut.length !== 4) {
      errors.value.annee_debut = "L'année de début doit être un nombre à 4 chiffres.";
    }
    // Vérifie si 'annee_debut' est égale ou supérieure à l'année en cours
    else if (anneeDebut < anneeEnCours || anneeDebut > anneeEnCours + 1) {
      errors.value.annee_debut = `L'année de début doit être égale ou supérieure à ${anneeEnCours} et ne pas dépasser ${anneeEnCours + 1}.`;
    }
  }

  // Validation pour 'annee_fin'
  if (field === 'annee_fin') {
    const anneeFin = parseInt(formData.value.annee_fin);
    const anneeDebut = parseInt(formData.value.annee_debut);

    // Vérifie si 'annee_fin' est un nombre valide
    if (isNaN(anneeFin) || formData.value.annee_fin.length !== 4) {
      errors.value.annee_fin = "L'année de fin doit être un nombre à 4 chiffres.";
    }
    // Vérifie si 'annee_fin' est supérieure ou égale à 'annee_debut'
    else if (anneeFin < anneeDebut) {
      errors.value.annee_fin = "L'année de fin doit être supérieure ou égale à l'année de début.";
    }
    // Vérifie si 'annee_fin' ne dépasse pas l'année en cours + 2
    else if (anneeFin > anneeEnCours + 2) {
      errors.value.annee_fin = `L'année de fin ne doit pas dépasser ${anneeEnCours + 2}.`;
    }
  }
};


// Vérifier si le formulaire est valide
const formIsValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null) &&
         Object.values(formData.value).every(field => field !== '');
});

const editAnnee = (id) => {
  // console.log('Modifier l\'année avec l\'ID :', id);
  const row = tableData.value.find(item => item.id === id);
  if (row) {
    formData.value = {
      id: row.id, 
      annee_debut: row.annee_debut,
      annee_fin: row.annee_fin,
      etat: row.etat
    };
    // console.log('formData après modification:', formData.value);
  }
};


const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getAnnees();
    // console.log('Données récupérées :', response);
    if (response && response.length > 0) {
      // Inclure l'ID dans les données récupérées
      tableData.value = response.map((item, index) => ({
        numero: index + 1, 
        annee_debut: item.annee_debut,
        annee_fin: item.annee_fin,
        etat: item.etat,
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
  // Valider tous les champs avant de soumettre
  validateField('annee_debut');
  validateField('annee_fin');
  if (formData.value.id !== null) {
    validateField('etat');
  }

  if (!formIsValid.value) {
    return; // Arrêter la soumission si le formulaire n'est pas valide
  }

  try {
    const response = await (formData.value.id !== null ? modifierAnnee(formData.value) : ajouterAnnee(formData.value));
    
    // Vérifier le statut de la réponse
    if (response.status === 201) {
      // Utiliser la variable réactive pour définir le message de succès
      successMessage.value = formData.value.id !== null ? 'Année modifiée avec succès !' : 'Année ajoutée avec succès !';
      errorMessage.value = ''; // Réinitialiser le message d'erreur

      await fetchData();
      resetForm();
      
      // Réinitialiser le message de succès après un délai
      setTimeout(() => {
        successMessage.value = '';
      }, 2000);
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);

    // Vérifiez si l'erreur a une réponse
    if (error.response) {
        const errorMsg = error.response.data.message || 'Une erreur inattendue s\'est produite.';
        errorMessage.value = errorMsg; // Définir le message d'erreur
        successMessage.value = ''; // Réinitialiser le message de succès

        // Réinitialiser le message d'erreur après un délai
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000); // 3 secondes (vous pouvez ajuster ce délai selon vos besoins)
        
    } else {
        // Si aucune réponse n'est reçue
        errorMessage.value = 'Une erreur inattendue s\'est produite. Veuillez vérifier votre connexion.';
        successMessage.value = ''; // Réinitialiser le message de succès

        // Réinitialiser le message d'erreur après un délai
        setTimeout(() => {
            errorMessage.value = '';
        }, 3000); // 3 secondes
    }
    
    resetForm();
}

};


const deleteAnnee = async (id) => {
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
      await supprimerAnnee(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'L\'année scolaire a été supprimée avec succès.',
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          fetchData();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      
      // Vérifiez si l'erreur a une réponse et récupérez le message d'erreur de l'API
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
    annee_debut: '',
    annee_fin: '',
    etat: 'Fermée', 
    id: null 
  };
};
const redirectToAnneeClasses = (id) => {
  // Redirige vers la page annee_classes avec l'id dans l'URL
  router.push({ name: 'annee_classes', params: { id } });
};
const redirectToClassesList = (id) => {
  // Redirige vers la page annee_classes avec l'id dans l'URL
  router.push({ name: 'list_classes', params: { id } });
};

onMounted(fetchData);
</script>


<style scoped>
/* Masquer la colonne ID dans le tableau */
::v-deep  .annees .tableau1 .tab-evaluations td:nth-child(5) { 
  display: none; /* Masquer la colonne de l'ID */
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
  .bouton {
    display: flex;
    justify-content: end;
  }
  .bouton .btn-submit {
    background-color: #407CEE;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  }
  .bouton .btn-submit:hover {
    background-color: #365F9B; /* Change la couleur au survol */
  }
  .annees {
    margin-top: 50px;
    margin-left: 300px;
    margin-right: 50px;
   
  }
   .annees h3{
     font-size: 24px;
     font-family: "Poppins", sans-serif;
     font-weight: 500;
     text-align: start;
   }
 .annees .tableau1{
    margin-right: 50px;
    width: 100%;
   
    }
.pagination1{
margin-left: 275px;
margin-right: 50px;
display: flex;
justify-content: end;
}

label:hover {
      cursor: pointer; /* Change le curseur lors du survol */
      color: #407CEE; /* Couleur au survol */
  }
  @media (max-width: 992px) {
 .main-content2{
  margin-top: -50px;
 
  margin-left: 0;
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
  .annees {
    margin-left: 10%;
    margin-right: 10%;
}


}
/* @media (max-width: 768px) {
  .main-content2{
  margin-top: 550px;
 }
} */
@media (max-width: 576px) {
  .main-content2{
  margin-top: 500px;
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
  margin-top: 720px;
  width: 80%;
  margin-left: auto;
  margin-right: auto
 }
 .main-content2 h2{
  font-size: 16px;
 }
}
</style>
