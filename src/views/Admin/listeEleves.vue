<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>Formulaire pour ajouter des eleves</h2>
        <div class="form-container mt-4">
            <form @submit.prevent="handleFormSubmit">
                <!-- Étape 1 : Informations du parent -->
                <div v-if="currentStep === 1">
                    <h3 style="text-align: center; margin-bottom: 20px;">Informations du parent</h3>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="nom_parent" class="form-label">Nom du parent :</label>
                            <input type="text" class="form-control" v-model="formData.parent_nom" placeholder="Entrez le nom du parent" required />
                        </div>
                        <div class="col-md-6">
                            <label for="prenom_parent" class="form-label">Prénom du parent :</label>
                            <input type="text" class="form-control" v-model="formData.parent_prenom" placeholder="Entrez le prénom du parent" required />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="email_parent" class="form-label">Email du parent :</label>
                            <input type="email" class="form-control" v-model="formData.parent_email" placeholder="Entrez l'email du parent" required />
                        </div>
                        <div class="col-md-6">
                            <label for="telephone_parent" class="form-label">Téléphone du parent :</label>
                            <input type="text" class="form-control" v-model="formData.parent_telephone" placeholder="Entrez le téléphone du parent" required />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="adresse_parent" class="form-label">Adresse du parent :</label>
                            <input type="text" class="form-control" v-model="formData.parent_adresse" placeholder="Entrez l'adresse du parent" required />
                        </div>
                        <div class="suivant col-md-6" style="margin-top: 30px; display: flex; justify-content: end;">
                            <button type="button" class="btn" @click="nextStep">Suivant</button>
                        </div>
                    </div>
                </div>

                <!-- Étape 2 : Informations de l'élève -->
                <div v-if="currentStep === 2">
                    <h3 style="text-align: center; margin-bottom: 20px;">Informations de l'élève</h3>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="nom_eleve" class="form-label">Nom de l'élève :</label>
                            <input type="text" class="form-control" v-model="formData.nom" placeholder="Entrez le nom de l'élève" required />
                        </div>
                        <div class="col-md-6">
                            <label for="prenom_eleve" class="form-label">Prénom de l'élève :</label>
                            <input type="text" class="form-control" v-model="formData.prenom" placeholder="Entrez le prénom de l'élève" required />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="email_eleve" class="form-label">Email de l'élève :</label>
                            <input type="email" class="form-control" v-model="formData.email" placeholder="Entrez l'email de l'élève" required />
                        </div>
                        <div class="col-md-6">
                            <label for="telephone_eleve" class="form-label">Téléphone de l'élève :</label>
                            <input type="text" class="form-control" v-model="formData.telephone" placeholder="Entrez le téléphone de l'élève" required />
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="date_naissance_eleve" class="form-label">Date de naissance :</label>
                            <input type="date" class="form-control" v-model="formData.date_naissance" required />
                        </div>
                        <div class="col-md-6">
                            <label for="genre_eleve" class="form-label">Genre :</label>
                            <select class="form-control" v-model="formData.genre" required>
                                <option value="">Sélectionnez le genre</option>
                                <option value="Masculin">Masculin</option>
                                <option value="Feminin">Féminin</option>
                            </select>
                        </div>
                    </div>
                    <div class="bouton d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" @click="previousStep">Précédent</button>
                        <button type="submit" class="btn btn-submit">Enregistrer</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="eleves">
            <h3>Liste des eleves</h3>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-eleves"
                    :headers="['Prénom & Nom', 'Matricule', 'Nom_Parent', 'Téléphone', 'Action']" :data="paginatedData.map(({ prenom, nom, matricule, nom_parent, prenom_parent, telephone_parent,id
                     }) => ({
                        nom: `${prenom} ${nom}`,
                        matricule,
                        nom_parent: `${prenom_parent} ${nom_parent}`,
                        telephone_parent,
                        id
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn " @click="editStudent(row.id)" style="color: #4862C4;" title=" Modifier les informations d'un eleve">
                                <Icon icon="mdi:pencil-outline" /> 
                            </button>
                            <button class="btn " @click="deleteStudent(row.id)" style="color: red;" title="Supprimer le professeur">
                                <Icon icon="mdi:trash-can-outline" /> 
                            </button>
                            <button class="btn" @click="seeStudent(row.id)" style="color: red; font-size: 40px;" title="Voir les details de cet élève">
                                <Icon icon="marketeq:eye" /> 
                            </button>
                        </div>
                    </template>
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucun élève trouvé.</p>
            </div>

            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
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
import { getEleves, ajouterEleve, modifierEleve,supprimerEleve} from '@/services/EleveService';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2'; 

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const tableData = ref([]); // Données des eleves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
// Variables réactives
const currentStep = ref(1);

// Données réactives pour le formulaire
const formData = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  photo: '', // Si nécessaire pour ajouter une photo
  date_naissance: '',
  genre: '',
  parent_telephone: '',
  parent_nom: '',
  parent_prenom: '',
  parent_email: '',
  parent_adresse: ''
});


// Fonctions pour changer d'étape
const nextStep = () => {
  if (currentStep.value < 2) currentStep.value++;
};

const previousStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};
const editStudent = (id) => {
    console.log('Modifier l\'élève avec l\'ID :', id);
    const row = tableData.value.find(item => item.id === id);
    console.log('Données de l\'élève trouvées :', row); 
    if (row) {
        // Remplir les données du formulaire avec les informations de l'élève sélectionné
        formData.value = {
            nom: row.nom,
            prenom: row.prenom,
            email: row.email,
            telephone: row.telephone,
            date_naissance: row.date_naissance,
            genre: row.genre,
            parent_telephone: row.telephone_parent,
            parent_nom: row.nom_parent, 
            parent_prenom: row.prenom_parent, 
            parent_email: row.email_parent, 
            parent_adresse: row.adresse_parent, 
            id: row.id, 
        };
        console.log('formData après modification:', formData.value);
    }
};


// Fonction pour gérer la soumission du formulaire
const handleFormSubmit = async () => {
  try {
    const response = await (formData.value.id ? modifierEleve(formData.value) : ajouterEleve(formData.value));
    console.log('Élève envoyé:', formData.value);

    const successMessage = formData.value.id ? 'Élève modifié avec succès !' : 'Élève ajouté avec succès !';

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
    console.log(error.response.data);
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


// Fonction pour réinitialiser le formulaire
const resetForm = () => {
  formData.value = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    photo: '',
    date_naissance: '',
    genre: '',
    parent_telephone: '',
    parent_nom: '',
    parent_prenom: '',
    parent_email: '',
    parent_adresse: ''
  };
};
const fetchData = async () => {
  try {
    const response = await getEleves();
    tableData.value = response.map((item) => ({
      prenom: item.prenom,
      nom: item.nom,
      matricule: item.matricule,
      date_naissance: item.date_naissance,
      genre: item.genre,
      telephone: item.telephone,
      email: item.email,
      nom_parent: item.parent.nom_parent,  
      prenom_parent: item.parent.prenom_parent, 
      telephone_parent: item.parent.telephone_parent, 
      adresse_parent: item.parent.adresse_parent,
      email_parent: item.parent.email_parent,
      id: item.id
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};


// Méthode pour changer de page dans la pagination
const handlePageChange = (page) => {
    currentPage.value = page; // Mettre à jour la page actuelle
};

// Calculer les données paginées à afficher
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value; // Calculer l'index de début
    const end = start + pageSize.value; // Calculer l'index de fin
    return tableData.value.slice(start, end); // Retourner les données pour la page actuelle
});


const deleteStudent = async (id) => {
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
      await supprimerEleve(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'L\'élève a été supprimée avec succès.',
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

// Appeler les méthodes au montage du composant
onMounted(fetchData);


</script>



<style>

.tab-eleves td:nth-child(5) { 
  display: none; /* Masquer la colonne de l'ID */
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


.suivant .btn {
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

.suivant .btn:hover {
    background-color: #407CEE;
    color: white;
}

.eleves {
    margin-top: 50px;
    margin-left: 300px;
    margin-right: 50px;


}

.eleves h3 {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: start;
}

.eleves .tableau1 {
    margin-right: 50px;
    width: 100%;

}

.pagination1 {
    margin-left: 275px;
    margin-right: 50px;
    display: flex;
    justify-content: end;
}

p {
    font-size: 18px;
    color: red;
    font-family: "Poppins", sans-serif;
}


.bouton .btn-secondary, .bouton .btn-secondary:hover {
    background-color: transparent;
    color: white;
    border: 1px solid #F7AE00;
    border-radius: 12px;
    cursor: pointer;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    color: #F7AE00;
   
}
</style>