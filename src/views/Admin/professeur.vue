<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content2">
   <div class="lien_boutons">
    <boutons
      title1="Matières" 
      title2="Professeurs"
      page1="matiere"
      page2="professeur"
    />
   </div>
    <h2>Formulaire pour ajouter des Professeurs</h2>
    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <div class="row mb-3">
          <div class="col-md-6">
            <label for="nom" class="form-label">Nom :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="newProfesseur.nom" 
              placeholder="Entrez votre nom" 
              @blur="validateField('nom')" 
              :class="{ 'is-invalid': errors.nom }" 
              required 
            />
            <div v-if="errors.nom" class="text-danger">{{ errors.nom }}</div>
          </div>
          <div class="col-md-6">
            <label for="prenom" class="form-label">Prénom :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="newProfesseur.prenom" 
              placeholder="Entrez votre prénom" 
              @blur="validateField('prenom')" 
              :class="{ 'is-invalid': errors.prenom }" 
              required 
            />
            <div v-if="errors.prenom" class="text-danger">{{ errors.prenom }}</div>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-md-6">
            <label for="email" class="form-label">Email :</label>
            <input 
              type="email" 
              class="form-control" 
              v-model="newProfesseur.email" 
              placeholder="Entrez votre email" 
              @blur="validateField('email')" 
              :class="{ 'is-invalid': errors.email }" 
              required 
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>
          <div class="col-md-6">
            <label for="telephone" class="form-label">Téléphone :</label>
            <input 
              type="text" 
              class="form-control" 
              v-model="newProfesseur.telephone" 
              placeholder="Entrez votre numéro de tel" 
              @blur="validateField('telephone')" 
              :class="{ 'is-invalid': errors.telephone }" 
              required 
            />
            <div v-if="errors.telephone" class="text-danger">{{ errors.telephone }}</div>
          </div>
        </div>

        <div class="bouton">
          <button type="submit" class="btn btn-submit" :disabled="!formIsValid">Enregistrer</button>
        </div>
      </form>
    </div>

    <div class="professeurs">
      <div class="title_recherche" style="display: flex; align-items:  center; justify-content: space-between;">
        <h3>Liste des Professeurs</h3>
        
    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="form-control mb-3" 
        placeholder="Recherchez un professeur " 
      />
    </div>
      </div>
      <div class="tableau">
        <div v-if="successMessage" class="alert alert-success" role="alert">
                {{ successMessage }}
            </div>
            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                {{ errorMessage }}
            </div>
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
              <button class="btn " @click="editProfesseur(row.id)" style="color: #407CEE;" title="Modifier les informations du professeur">
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

        <p v-else class="alert alert-info" >
          Aucun professeur trouvé.
        </p>
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

const errors = ref({
  nom: null,
  prenom: null,
  email: null,
  telephone: null
});
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const successMessage = ref('');
const errorMessage = ref('');

// Méthode de validation pour chaque champ
const validateField = (field) => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;  // Expression régulière pour accepter uniquement des lettres
  const telephoneRegex = /^(77|78|70|76|75)\d{7}$/;  // Expression régulière pour valider le numéro de téléphone

  if (!newProfesseur.value[field]) {
    errors.value[field] = `Le champ ${field} est obligatoire.`;
  } else if ((field === 'nom' || field === 'prenom') && !nameRegex.test(newProfesseur.value[field])) {
    errors.value[field] = `Le champ ${field} ne doit pas contenir de chiffres ni de caractères spéciaux.`;
  } else if (field === 'email' && !/\S+@\S+\.\S+/.test(newProfesseur.value.email)) {
    errors.value.email = "Veuillez entrer un email valide.";
  } else if (field === 'telephone' && !telephoneRegex.test(newProfesseur.value.telephone)) {
    errors.value.telephone = "Le numéro de téléphone doit commencer par 77, 78,76, 70 ou 75 et être suivi de 7 chiffres.";
  } else {
    errors.value[field] = null;
  }
};


// Vérifier si le formulaire est valide
const formIsValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null) &&
         Object.values(newProfesseur.value).every(field => field !== '');
});

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
    // console.log("Données récupérées :", tableData.value); // Ajoutez ce log
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};

// Propriété pour stocker la requête de recherche
const searchQuery = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredProfesseurs = computed(() => {
  // Si la requête de recherche est vide, on retourne tous les professeurs
  if (!searchQuery.value) {
    return tableData.value;
  }

  // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  
  // Filtrer les professeurs en fonction du nom, prénom, email ou matricule
  return tableData.value.filter(professeur =>
    professeur.nom.toLowerCase().includes(lowerCaseQuery) || // Vérifie si le nom contient la requête
    professeur.prenom.toLowerCase().includes(lowerCaseQuery) || // Vérifie si le prénom contient la requête
    professeur.email.toLowerCase().includes(lowerCaseQuery) || // Vérifie si l'email contient la requête
    professeur.matricule.toLowerCase().includes(lowerCaseQuery) // Vérifie si le matricule contient la requête
  );
});



const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredProfesseurs.value.slice(start, end);
});
const handleFormSubmit = async () => {
    // Valider tous les champs avant de soumettre
    validateField('nom');
  validateField('prenom');
  validateField('email');
  validateField('telephone');

  if (!formIsValid.value) {
    return; // Arrêter la soumission si le formulaire n'est pas valide
  }

    try {
        // console.log("Données à envoyer:", newProfesseur.value);
        const response = await (newProfesseur.value.id !== null 
          ? modifierProfesseur(newProfesseur.value) 
          : ajouterProfesseur(newProfesseur.value));
        
        // console.log("Réponse du serveur:", response);
        
        if (response) {  // Vérification modifiée
            await fetchData();  // Récupérez de nouveau la liste des professeurs après la modification
            
            // Définir le message de succès
            successMessage.value = 'Professeur modifié avec succès !';
            errorMessage.value = ''; // Réinitialiser le message d'erreur

            // Réinitialiser le formulaire après un délai
            setTimeout(() => {
                successMessage.value = '';
                resetForm();
            }, 2000);
        } else {
            console.error("La réponse du serveur est vide ou invalide.");
            errorMessage.value = 'Une erreur s\'est produite lors de la modification du professeur.';
        }
    } catch (error) {
        console.error('Erreur lors de la soumission du formulaire :', error);
        errorMessage.value = error.message || 'Une erreur inattendue s\'est produite.';
        successMessage.value = ''; // Réinitialiser le message de succès
    
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

<style >
.main-content2 { 
  margin-top: 120px;
}
/* .lien_boutons{
  margin-left: 300px;
} */
.main-content2 h2 {
    color: black;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: center;
    margin-left: 300px;
}
.main-content2 .form-container {
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
.search-container input{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    border-radius: 12px;
    width: 350px;
  }
  

.professeurs .tableau {
  width: 100%;
  margin-bottom: 50px;
 
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
label:hover {
      cursor: pointer; /* Change le curseur lors du survol */
      color: #407CEE; /* Couleur au survol */
  }
 .bouton .btn-submit:disabled {
  background-color: #407CEE; /* couleur gris pour montrer qu'il est désactivé */
  color: #666666; /* texte grisé */
  cursor: not-allowed; /* curseur modifié pour indiquer qu'il n'est pas cliquable */
  opacity: 0.6; /* rendre le bouton semi-transparent */
}
@media (max-width: 992px) {
 .main-content2{
  margin-top: 260px;
 
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
  .professeurs {
    margin-left: 10%;
    margin-right: 10%;
}


}
@media (max-width: 768px) {
  .main-content2{
  margin-top: 550px;
 }
}
@media (max-width: 576px) {
  .main-content2{
  margin-top: 720px;
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

