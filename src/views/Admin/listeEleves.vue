<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <div class="mb-3"
      style="display: flex; align-items: end; justify-content: end ; margin-left: 300px; border-radius: 12px; margin-right: 50px;">
      <input type="text" class="form-control" v-model="searchQuery" @input="searchParent"
        placeholder="Rechercher un parent (email ou téléphone)" style="width: 300px;" />
    </div>

    <h2>Formulaire pour ajouter des eleves</h2>
    <div class="form-container mt-4">
      <form @submit.prevent="handleFormSubmit">
        <!-- Étape 1 : Informations du parent -->
        <div v-if="currentStep === 1">
          <h3 style="text-align: center; margin-bottom: 20px;">Informations du parent</h3>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="nom_parent" class="form-label">Nom du parent :</label>
              <input type="text" class="form-control" v-model="formData.parent_nom"
                placeholder="Entrez le nom du parent" @blur="validateField('parent_nom')"
                :class="{ 'is-invalid': errors.parent_nom }" required />
              <div v-if="errors.parent_nom" class="text-danger">{{ errors.parent_nom }}</div>
            </div>
            <div class="col-md-6">
              <label for="prenom_parent" class="form-label">Prénom du parent :</label>
              <input type="text" class="form-control" v-model="formData.parent_prenom"
                placeholder="Entrez le prénom du parent" @blur="validateField('parent_prenom')"
                :class="{ 'is-invalid': errors.parent_prenom }" required />
              <div v-if="errors.parent_prenom" class="text-danger">{{ errors.parent_prenom }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="email_parent" class="form-label">Email du parent :</label>
              <input type="email" class="form-control" v-model="formData.parent_email"
                placeholder="Entrez l'email du parent" @blur="validateField('parent_email')"
                :class="{ 'is-invalid': errors.parent_email }" required />
              <div v-if="errors.parent_email" class="text-danger">{{ errors.parent_email }}</div>
            </div>
            <div class="col-md-6">
              <label for="telephone_parent" class="form-label">Téléphone du parent :</label>
              <input type="text" class="form-control" v-model="formData.parent_telephone"
                placeholder="Entrez le téléphone du parent" @blur="validateField('parent_telephone')"
                :class="{ 'is-invalid': errors.parent_telephone }" required />
              <div v-if="errors.parent_telephone" class="text-danger">{{ errors.parent_telephone }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="adresse_parent" class="form-label">Adresse du parent :</label>
              <input type="text" class="form-control" v-model="formData.parent_adresse"
                placeholder="Entrez l'adresse du parent" @blur="validateField('parent_adresse')"
                :class="{ 'is-invalid': errors.parent_adresse }" required />
              <div v-if="errors.parent_adresse" class="text-danger">{{ errors.parent_adresse }}</div>
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
              <input type="text" class="form-control" v-model="formData.nom" placeholder="Entrez le nom de l'élève"
                @blur="validateField('nom')" :class="{ 'is-invalid': errors.nom }" required />
              <div v-if="errors.nom" class="text-danger">{{ errors.nom }}</div>
            </div>
            <div class="col-md-6">
              <label for="prenom_eleve" class="form-label">Prénom de l'élève :</label>
              <input type="text" class="form-control" v-model="formData.prenom"
                placeholder="Entrez le prénom de l'élève" @blur="validateField('prenom')"
                :class="{ 'is-invalid': errors.prenom }" required />
              <div v-if="errors.prenom" class="text-danger">{{ errors.prenom }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="email_eleve" class="form-label">Email de l'élève :</label>
              <input type="email" class="form-control" v-model="formData.email" placeholder="Entrez l'email de l'élève"
                @blur="validateField('email')" :class="{ 'is-invalid': errors.email }" />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="col-md-6">
              <label for="genre_eleve" class="form-label">Genre :</label>
              <select class="form-control" v-model="formData.genre" @blur="validateField('genre')"
                :class="{ 'is-invalid': errors.genre }" required>
                <option value="">Sélectionnez le genre</option>
                <option value="Masculin">Masculin</option>
                <option value="Feminin">Féminin</option>
              </select>
              <div v-if="errors.genre" class="text-danger">{{ errors.genre }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="date_naissance_eleve" class="form-label">Date de naissance :</label>
              <input type="date" class="form-control" v-model="formData.date_naissance"
                @blur="validateField('date_naissance')" :class="{ 'is-invalid': errors.date_naissance }" required />
              <div v-if="errors.date_naissance" class="text-danger">{{ errors.date_naissance }}</div>
            </div>
            <div class="col-md-6">

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
      <div class="title_recherche" style="display: flex; align-items:  center; justify-content: space-between;">
        <h3>Liste des élèves</h3>

        <!-- Barre de recherche -->
        <div class="search-container">
          <input type="text" v-model="searchQuery1" class="form-control mb-3" placeholder="Recherchez un élève " />
        </div>
      </div>
      <div class="tableau1">
        <tabEvaluations v-if="paginatedData.length > 0" class="tab-eleves"
          :headers="['Prénom & Nom', 'Matricule', 'Nom_Parent', 'Téléphone', 'Action']" :data="paginatedData.map(({ prenom, nom, matricule, nom_parent, prenom_parent, telephone_parent, id
          }) => ({
            nom: `${prenom} ${nom}`,
            matricule,
            nom_parent: `${prenom_parent} ${nom_parent}`,
            telephone_parent,
            id
          }))">
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="editStudent(row.id)" style="color: #407CEE;"
                title=" Modifier les informations d'un eleve">
                <Icon icon="mdi:pencil-outline" />
              </button>
              <button class="btn " @click="deleteStudent(row.id)" style="color: red;" title="Supprimer le professeur">
                <Icon icon="mdi:trash-can-outline" />
              </button>
              <button class="btn" @click="attribuerClasse(row)" :disabled="estDejaDansClasse(row)"
                style="color: #407CEE; font-size: 40px;" title="Ajouter dans une classe">
                <Icon icon="material-symbols:school" />
              </button>
            </div>
          </template>
        </tabEvaluations>
        <p v-else class="no-evaluations-message">Aucun élève trouvé.</p>
      </div>

      <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
        :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
    </div>
    <div v-if="showModal"
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div
        style="position: relative; width: 90%; max-width: 500px; padding: 20px; background: white; border-radius: 8px; z-index: 1001; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <h3>Ajouter dans une classe</h3>
        <span class="close" @click="closeModal"
          style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>

        <form @submit.prevent="enregistrerClasse">
          <div class="form-group" style="margin-bottom: 15px;">
            <label for="classe">Sélectionnez une classe :</label>
            <select id="classe" v-model="classeSelectionnee" class="form-control"
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
              <option value="" disabled>Choisissez une classe</option>
              <option v-for="classe in classes" :key="classe.id" :value="classe.id">{{ classe.nom }}
              </option>
            </select>
          </div>

          <div class="form-group" style="margin-top: 20px;  display: flex; justify-content: end">
            <button type="submit"
              style="background-color: #407CEE; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; width: 200px; font-size: 20px;"
              class="btn btn-primary">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>



  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getEleves, ajouterEleve, modifierEleve, supprimerEleve } from '@/services/EleveService';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { getAnneClasses } from '@/services/AnneeClasseService';
import { ajouterEleveClasse, getElevesOntClasse } from '@/services/ClasseEleve';
import { creerBulletinsPourTousLesEleves } from '@/services/BulletinService';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const tableData = ref([]); // Données des eleves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const currentStep = ref(1);
const searchQuery = ref('');

const showModal = ref(false);
const classeSelectionnee = ref(''); // Classe sélectionnée
const classes = ref([]); // Liste des classes
const eleveSelectionne = ref(null); // Élève sélectionné
const elevesAvecClasse = ref([]); // Stocker les élèves qui ont déjà une classe

const errors = ref({
  parent_nom: null,
  parent_prenom: null,
  parent_email: null,
  parent_telephone: null,
  parent_adresse: null,
  nom: null,
  prenom: null,
  email: null,
  telephone: null,
  date_naissance: null,
  genre: null
});

// Validation des champs
const validateField = (field) => {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;  // Expression régulière pour accepter uniquement des lettres
  const telephoneRegex = /^(77|78|70|76|75)\d{7}$/;  // Expression régulière pour valider le numéro de téléphone

  // Vérifier si le champ est l'email (non obligatoire)
  if (field === 'email') {
    if (!formData.value[field]) {
      errors.value[field] = null; // Pas d'erreur si l'email est vide
      return; // Sortir de la fonction
    }
  }

  // Validation des champs obligatoires
  if (!formData.value[field]) {
    errors.value[field] = `Le champ ${field.replace('_', ' ')} est requis.`;
  } else if ((field === 'parent_nom' || field === 'parent_prenom') && !nameRegex.test(formData.value[field])) {
    errors.value[field] = `Le champ ${field} ne doit pas contenir de chiffres ni de caractères spéciaux.`;
  } else if ((field === 'nom' || field === 'prenom') && !nameRegex.test(formData.value[field])) {
    errors.value[field] = `Le champ ${field} ne doit pas contenir de chiffres ni de caractères spéciaux.`;
  } else if (field === 'telephone' && !telephoneRegex.test(formData.value.telephone)) {
    errors.value.telephone = "Le numéro de téléphone doit commencer par 77, 78, 70 ou 75 et être suivi de 7 chiffres.";
  } else if (field === 'parent_email' && !/\S+@\S+\.\S+/.test(formData.value[field])) {
    errors.value[field] = "Veuillez entrer un email valide.";
  } else if (field === 'parent_telephone' && !telephoneRegex.test(formData.value.parent_telephone)) {
    errors.value.parent_telephone = "Le numéro de téléphone doit commencer par 77, 78, 76, 70 ou 75 et être suivi de 7 chiffres.";
  } else if (field === 'date_naissance') {
    const today = new Date();
    const birthDate = new Date(formData.value[field]);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeToday = birthDate < today;
    const isValidDate = !isNaN(birthDate.getTime());

    if (!isValidDate) {
      errors.value[field] = "Veuillez entrer une date de naissance valide.";
    } else if (!isBeforeToday) {
      errors.value[field] = "La date de naissance doit être dans le passé.";
    } else if (age < 11 || age > 17) {
      errors.value[field] = "L'élève doit avoir entre 11 et 17 ans.";
    } else {
      errors.value[field] = null; // Pas d'erreur
    }
  } else {
    errors.value[field] = null; // Pas d'erreur
  }
};


// Validation générale
const isFormValid = () => {
  Object.keys(formData.value).forEach(field => {
    validateField(field); // Valider chaque champ
  });
  return !Object.values(errors.value).some(error => error); // Retourne vrai si aucune erreur
};

// Récupérer les élèves avec une classe attribuée
const fetchElevesAvecClasse = async () => {
  try {
    const response = await getElevesOntClasse();
    if (response && response.données && Array.isArray(response.données)) {
      // Stocker les élèves avec une classe
      elevesAvecClasse.value = response.données.map(eleveClasse => eleveClasse.eleve_id);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves avec classe:", error);
  }
};

// Méthode pour vérifier si un élève a déjà une classe
const estDejaDansClasse = (eleve) => {
  return elevesAvecClasse.value.includes(eleve.id);
};
// Méthode pour ouvrir le modal
const attribuerClasse = (eleve) => {
  eleveSelectionne.value = eleve; // Définir l'élève actuellement sélectionné
  showModal.value = true; // Ouvrir le modal
};

// Méthode pour fermer le modal
const closeModal = () => {
  showModal.value = false; // Fermer le modal
};

// Méthode pour récupérer les classes à partir de l'API
const fetchClasses = async () => {
  try {
    const response = await getAnneClasses();
    const annees = response.données.filter(annee => annee.etat === 'En_cours' || annee.etat === 'Ouverte');
    classes.value = annees.length > 0 ? annees[0].classes : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
  }
};

// Méthode pour enregistrer la classe sélectionnée
const enregistrerClasse = async () => {
  if (!classeSelectionnee.value || !eleveSelectionne.value) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Veuillez sélectionner une classe.',
      confirmButtonColor: '#d33',
    });
    return;
  }

  try {
    // Envoi des données à l'API
    await ajouterEleveClasse({
      eleve_id: eleveSelectionne.value.id,
      annee_classe_id: classeSelectionnee.value
    });
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Classe attribuée avec succès !',
      confirmButtonColor: '#407CEE',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    fetchElevesAvecClasse();
    closeModal();
    classeSelectionnee.value = ''; // Réinitialiser la sélection de classe
      // Appeler la méthode pour créer des bulletins pour tous les élèves
      await creerBulletinsPourTousLesEleves(); 
  } catch (error) {
    console.error('Erreur lors de l\'attribution de la classe :', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: error.message || 'Une erreur inattendue s\'est produite.',
      confirmButtonColor: '#d33',
    });
  }
};


// Données réactives pour le formulaire
const formData = ref({
  nom: '',
  prenom: '',
  email: '',
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
// Fonction pour rechercher un parent
const searchParent = () => {
  const parent = tableData.value.find(item =>
    item.email_parent === searchQuery.value ||
    item.telephone_parent === searchQuery.value
  );

  if (parent) {
    // Préremplir les informations du parent dans le formulaire
    formData.value.parent_nom = parent.nom_parent;
    formData.value.parent_prenom = parent.prenom_parent;
    formData.value.parent_email = parent.email_parent;
    formData.value.parent_telephone = parent.telephone_parent;
    formData.value.parent_adresse = parent.adresse_parent;
  } else {
    // Réinitialiser les informations du parent si aucun résultat n'est trouvé
    resetParentForm();
  }
};

// Fonction pour gérer la soumission du formulaire
const handleFormSubmit = async () => {
    // Vérifiez la validité du formulaire
    const isValid = isFormValid();
    if (!isValid) {
        return; // Arrêtez l'exécution si le formulaire n'est pas valide.
    }

    if (!Object.values(errors.value).some(error => error)) {
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
            await fetchData(); // Assurez-vous que cette fonction ne contient pas d'erreurs.
            resetForm(); // Vérifiez également cette fonction.
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Une erreur inattendue s\'est produite.';
            console.log(errorMessage);
            Swal.fire({
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
      email: item.email,
      nom_parent: item.parent.nom_parent,
      prenom_parent: item.parent.prenom_parent,
      telephone_parent: item.parent.telephone_parent,
      adresse_parent: item.parent.adresse_parent,
      email_parent: item.parent.email_parent,
      id: item.id
    }));

    // Trier les élèves par ordre alphabétique du nom
    tableData.value.sort((a, b) => a.nom.localeCompare(b.nom));

  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};
// propriété pour la barre de recherche
const searchQuery1 = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredEleves = computed(() => {
  // Si la requête de recherche est vide, on retourne tous les matieres
  if (!searchQuery1.value) {
    return tableData.value;
  }
  // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery1.value.toLowerCase();
  return tableData.value.filter(eleve =>
    eleve.nom.toLowerCase().includes(lowerCaseQuery) ||
    eleve.prenom.toLowerCase().includes(lowerCaseQuery) ||
    eleve.prenom_parent.toLowerCase().includes(lowerCaseQuery) ||
    eleve.telephone_parent.toLowerCase().includes(lowerCaseQuery)

  );
});



// Méthode pour changer de page dans la pagination
const handlePageChange = (page) => {
  currentPage.value = page; // Mettre à jour la page actuelle
};

// Calculer les données paginées à afficher
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value; // Calculer l'index de début
  const end = start + pageSize.value; // Calculer l'index de fin
  return filteredEleves.value.slice(start, end); // Retourner les données pour la page actuelle
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
// Fonction pour réinitialiser les informations du parent
const resetParentForm = () => {
  formData.value.parent_nom = '';
  formData.value.parent_prenom = '';
  formData.value.parent_email = '';
  formData.value.parent_telephone = '';
  formData.value.parent_adresse = '';
};

// Appeler les méthodes au montage du composant
onMounted(fetchData);
onMounted(fetchClasses);
onMounted(fetchElevesAvecClasse); // Appeler la méthode pour récupérer les élèves avec classe


</script>



<style>
.tab-eleves td:nth-child(5) {
  display: none;
  /* Masquer la colonne de l'ID */
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

label:hover {
  cursor: pointer;
  /* Change le curseur lors du survol */
  color: #407CEE;
  /* Couleur au survol */
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


.bouton .btn-secondary,
.bouton .btn-secondary:hover {
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