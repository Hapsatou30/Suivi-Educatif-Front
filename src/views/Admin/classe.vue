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
       <div class="row  d-flex" style="display: flex; align-items: center;">
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
        <div class=" col-md-6 mt-4" style="display: flex; justify-content: end; ">
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
          :headers="['N°', 'Nom', 'Capacité', 'Action']"
          :data="paginatedData"
        />

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
import { getClasses, ajouterClasse } from '@/services/ClasseService'; 
import Swal from 'sweetalert2';
import boutons from '@/components/boutons.vue';

const formData = ref({
  nom: '',
  niveau: '',
  capacite: ''
});

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Récupérer les données des classes
const fetchData = async () => {
  const response = await getClasses();
  if (response && response.length > 0) {
      tableData.value = response.map((item, index) => ({
          numero: index + 1, // Ajout du numéro
          nom: item.nom,
          capacite: item.capacite,
      }));
  } else {
      console.log('Aucune classe trouvée ou erreur lors de la récupération des données.');
  }
};

// Fonction pour gérer le changement de page
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Données paginées
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// Gestion de la soumission du formulaire
const handleFormSubmit = async () => {
  try {
    const response = await ajouterClasse(formData.value);
    if (response.status === 201) { 
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Classe ajoutée avec succès !',
        confirmButtonColor: '#407CEE',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      await fetchData(); // Recharger les données après ajout
      resetForm(); // Réinitialiser le formulaire
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'ajout de la classe.',
        confirmButtonColor: '#d33',
        timer: 2000,
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
  formData.value = {
    nom: '',
    niveau: '',
    capacite: ''
  };
};

// Charger les données lors de l'initialisation du composant
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
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
