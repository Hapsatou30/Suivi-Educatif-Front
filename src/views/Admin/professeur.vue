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

    <div class="form-container mt-4">
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
      <div class="tableau">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-evaluation" 
          :headers="['Matricule', 'Prénom & Nom', 'Contact', 'Action']" 
          :data="paginatedData.map(({ matricule, nom, prenom, telephone,email, id }) => ({
            matricule,
            nom: `${prenom} ${nom}`,
            telephone,
            email,
            id 
          }))"
        >
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="editProfesseur(row.id)" style="color: #4862C4;" title="Modifier les informations du professeur">
                <Icon icon="mdi:pencil-outline" /> 
              </button>
              <button class="btn " @click="deleteProfesseur(row.id)" style="color: red;" title="Supprimer le professeur">
                <Icon icon="mdi:trash-can-outline" /> 
              </button>
              <button class="btn" @click="redirectToProfMatiere(row.id)" style="color: #F7AE00;" title="Attribuer des matières">
                <Icon icon="material-symbols:dictionary" /> 
              </button>
            </div>
          </template>
        </tabEvaluations>

        <p v-else class="no-professeurs-message">Aucun professeur trouvé.</p>
      </div>

      <pagination 
        class="paginate"
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
import { getProfesseurs, ajouterProfesseur, modifierProfesseur, supprimerProfesseur } from '@/services/ProfesseurService'; 
import Swal from 'sweetalert2';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

import boutons from '@/components/boutons.vue';

const router = useRouter();
const newProfesseur = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  id: null  
});

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getProfesseurs();
    tableData.value = response.map((item, index) => ({
      matricule: item.matricule, 
      nom: item.nom,
      prenom: item.prenom,
      telephone: item.telephone,
      email: item.email,
      id: item.id,
      user_id: item.user_id  
    }));
    console.log("Données récupérées :", tableData.value); // Ajoutez ce log
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
        console.log("Données à envoyer:", newProfesseur.value);
        const response = await (newProfesseur.value.id !== null 
          ? modifierProfesseur(newProfesseur.value) 
          : ajouterProfesseur(newProfesseur.value));
        
        console.log("Réponse du serveur:", response);
        
        if (response) {  // Vérification modifiée
          await fetchData();  // Récupérez de nouveau la liste des professeurs après la modification
        } else {
          console.error("La réponse du serveur est vide ou invalide.");
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Professeur modifié avec succès !',
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
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



const editProfesseur = (id) => {
  const row = tableData.value.find(item => item.id === id);
  if (row) {
    newProfesseur.value = {
      id: row.id, 
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone,
      user_id: row.user_id,
      matricule: row.matricule
    };
  }
};

const deleteProfesseur = async (id) => {
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
      await supprimerProfesseur(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'Le professeur a été supprimé avec succès.',
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
  newProfesseur.value = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    id: null,
    user_id: null,  // Ajoutez-le si nécessaire pour la modification
    matricule: ''
  };
};


const redirectToProfMatiere = (id) => {
  // Redirige vers la page prof_matiere avec l'id dans l'URL
  router.push({ name: 'prof_matiere', params: { id } });
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
 
  input::placeholder{
    color: #ccc;
    font-size: 12px;
  }
 
 .bouton .btn-submit:hover {
    background-color: #407CEE;
    color: white;
  }
.professeurs {
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  margin-left: 300px;
  margin-right: 50px;
 
}
.professeurs h3{
  color: black;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  
}
.professeurs .tableau {
  width: 100%;
 
}
.professeurs .paginate{
 
  display: flex;
  justify-content: end;
}
/* Styles similaires à ceux du code d'origine */
.professeurs .tab-evaluation td:nth-child(5),.professeurs .tab-evaluation td:nth-child(4) { 
  display: none; /* Masquer la colonne de l'ID */
}
.professeurs .boutons{
  display: flex;
  align-items: center;
  justify-content: center;
}
.boutons .btn{
  font-size: 30px;
}
p {
  font-size: 18px;
  color: red;
  font-family: "Poppins", sans-serif;
}

</style>

