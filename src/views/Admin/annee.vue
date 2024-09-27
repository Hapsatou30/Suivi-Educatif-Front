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
              required 
            />
          </div>
          <div class="col-md-6">
            <label for="annee_fin" class="form-label">Année de fin :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="formData.annee_fin" 
              placeholder="Entrez l'année de fin" 
              required 
            />
          </div>
        </div>

        <div class="row mb-3" v-if="formData.id !== null">
          <div class="col-md-6">
            <label for="etat" class="form-label">État :</label>
            <select 
              id="etat" 
              class="form-select" 
              v-model="formData.etat" 
              required
            >
              <option value="Fermée">Fermée</option>
              <option value="En_cours">En cours</option>
            </select>
          </div>
        </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="annees">
      <h3 style="font-size: 24px;">Liste des Années scolaires</h3>
      <div class="tableau1">
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
            <button class="btn btn-custom" @click="editAnnee(row.id)" style=" color: #4862C4;" title="Modifier l'année">
                     <Icon icon="mdi:pencil-outline" /> 
            </button>
          <button class="btn btn-custom1" @click="deleteAnnee(row.id)" style="color: red;" title="Supprimer l'année">
            <Icon icon="mdi:trash-can-outline" /> 
         </button>
           </div>
          </template>
        </tabEvaluations>


        <p v-else class="no-evaluations-message">Aucune année trouvée.</p>
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

const editAnnee = (id) => {
  console.log('Modifier l\'année avec l\'ID :', id);
  const row = tableData.value.find(item => item.id === id);
  if (row) {
    formData.value = {
      id: row.id, 
      annee_debut: row.annee_debut,
      annee_fin: row.annee_fin,
      etat: row.etat
    };
    console.log('formData après modification:', formData.value);
  }
};


const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getAnnees();
    console.log('Données récupérées :', response);
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
  try {
    const response = await (formData.value.id !== null ? modifierAnnee(formData.value) : ajouterAnnee(formData.value));
    console.log('Réponse du serveur:', response);

    // Vérifiez si la réponse contient un message d'erreur
    if (response && response.status && response.status !== 200) {
      // Supposons que le message d'erreur soit dans `response.message`
      throw new Error(response.message || 'Une erreur inattendue s\'est produite.');
    }

    const successMessage = formData.value.id !== null ? 'Année modifiée avec succès !' : 'Année ajoutée avec succès !';

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

onMounted(fetchData);
</script>


<style>
/* Masquer la colonne ID dans le tableau */
.tab-evaluations td:nth-child(5) { 
  display: none; /* Masquer la colonne de l'ID */
}

.boutons {
    background-color: transparent; 
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
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
    /* margin-left: 300px; */
    margin-right: 50px;
   
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between; */
  }
   .annees h3{
     font-size: 24px;
     font-family: "Poppins", sans-serif;
     font-weight: 500;
     text-align: start;
     margin-left: 300px;
   }
  .tableau1{
    margin-left: 300px;
    margin-right: 50px;
    width: 930px;
   
    }
.pagination1{
margin-left: 275px;
margin-right: 50px;
display: flex;
justify-content: end;
}

</style>
