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

    <!-- Formulaire d'ajout de professeur avec Bootstrap -->
    <div class="form-container  mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom :</label>
            <input type="text" class="form-control" v-model="newProfesseur.nom" placeholder="Entrez votre nom" required />
          </div>
          <div class="col-md-6">
            <label for="prenom" class="form-label">Prénom :</label>
            <input type="text" class="form-control" v-model="newProfesseur.prenom" placeholder="Entrez votre prénom" required />
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="email" class="form-label">Email :</label>
            <input type="email" class="form-control" v-model="newProfesseur.email" placeholder="Entrez votre email" required />
          </div>
          <div class="col-md-6">
            <label for="telephone" class="form-label">Téléphone :</label>
            <input type="text" class="form-control" v-model="newProfesseur.telephone" placeholder="Entrez votre numero de tel" required />
          </div>
        </div>

       <div class="bouton">
        <button type="submit" class="btn btn-submit">Enregistrer</button>
       </div>
      </form>
    </div>

    <div class="professeurs">
      <h3>Liste des Professeurs</h3>
    </div> 

    <div class="tableau">
      <tabEvaluations 
        v-if="paginatedData.length > 0"
        :headers="['Matricule', 'Prénom & Nom', 'Contact', 'Action']" 
        :data="paginatedData"
      />


      <p v-else class="no-evaluations-message">Aucun professeur trouvé.</p>
    </div>

    <pagination class="pagination1"
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
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getProfesseurs, ajouterProfesseur } from '@/services/ProfesseurService';
import Swal from 'sweetalert2';

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Nouveau professeur
const newProfesseur = ref({
  email: '',
  nom: '',
  prenom: '',
  telephone: ''
});

const handleFormSubmit = async () => {
  try {
    const response = await ajouterProfesseur(newProfesseur.value);
    if (response.status === 201) { 
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Professeur ajouté avec succès !',
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
        text: 'Une erreur est survenue lors de l\'ajout du professeur.',
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
  newProfesseur.value = {
    email: '',
    nom: '',
    prenom: '',
    telephone: ''
  };
};

// Calculer les données à afficher pour la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;

  return tableData.value.slice(start, end).map(item => ({
    matricule: item[0],
    fullName: `${item[1]} ${item[2]}`, 
    phone: item[3],
  }));
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
      item.matricule, 
      item.prenom, 
      item.nom,
      item.telephone,
    ]);
  } else {
    console.log('Aucun professeur trouvé ou erreur lors de la récupération des données.');
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style >
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
  
  /* Mise en page avec deux colonnes */
  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .form-group {
    flex: 0 0 48%; 

  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 20px;

  }
  
  input,
  select {
    width: 395px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 58px;
  }
 
  input::placeholder, textarea::placeholder{
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
  .bouton .btn-submit{
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    color: white;
  }
  
  .bouton .btn-submit:hover {
    background-color: #407CEE;
    color: white;
  }
 .bouton {
    display: flex;
    justify-content: end;
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
.pagination1{
  margin-left: 275px;
  margin-right: 50px;
  display: flex;
  justify-content: end;
}
</style>
