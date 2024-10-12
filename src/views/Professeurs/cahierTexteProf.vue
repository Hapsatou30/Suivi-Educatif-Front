<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <h2>{{ isEditMode ? 'Modifier' : 'Remplir' }} le cahier de texte de la classe de : {{ nom_classe }}</h2>
    <div class="cahier-text container mt-4">
      <div class="image-container">
        <img :src="imageCahier" alt="" class="image-background" />
        <div class="overlay-text">
          <form @submit.prevent="handleFormSubmit">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="titre" class="form-label">Titre du Cours :</label>
                <input 
              type="text" 
              class="form-control" 
              v-model="formData.titre" 
              placeholder="Entrez votre titre" 
              @blur="validateField('titre')" 
              :class="{ 'is-invalid': errors.titre }" 
              required 
            />
            <div v-if="errors.titre" class="text-danger">{{ errors.titre }}</div>
          </div>
              <div class="col-md-6">
                <label for="date" class="form-label">Date :</label>
                <input 
              type="date" 
              class="form-control" 
              v-model="formData.date" 
              @blur="validateField('date')" 
              :class="{ 'is-invalid': errors.date }" 
              required 
              readonly
            />
            <div v-if="errors.date" class="text-danger">{{ errors.date }}</div>
         </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="resume" class="form-label">Résumé du cours :</label>
                <textarea 
              class="form-control" 
              v-model="formData.resume" 
              placeholder="Entrez votre résumé" 
              @blur="validateField('resume')" 
              :class="{ 'is-invalid': errors.resume }" 
              required 
              style="height: 200px;"
            ></textarea>
            <div v-if="errors.resume" class="text-danger">{{ errors.resume }}</div>
         </div>
              <div class="col-md-6">
                <label for="ressource" class="form-label">Ressource :</label>
                <input 
              type="text" 
              class="form-control" 
              v-model="formData.ressource" 
              placeholder="Entrez votre ressource" 
              @blur="validateField('ressource')" 
              :class="{ 'is-invalid': errors.ressource }" 
            />
            <div v-if="errors.ressource" class="text-danger">{{ errors.ressource }}</div>
         </div>
            </div>
            <div class="bouton">
              <button type="submit" class="btn btn-submit" :disabled="!formIsValid">
                {{ isEditMode ? 'Mettre à jour' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Tableau des cahiers de texte -->
    <div class="cahiers">
      <div class="tableau">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-cahiers" 
          :headers="['Matière', 'Professeur', 'Date', 'Titre', 'Action']"
          :data="paginatedData.map(({ matiere, professeur, date, titre, id,professeur_id }) => ({
            matiere,
            professeur,
            date,
            titre,
            id,
            professeur_id
          }))"
        >
          <template #actions="{ row }">
  <div class="boutons" v-if="row.professeur_id === professeurId">
    <button class="btn" @click="editCahier(row.id)" style="color: #407CEE;" title="Modifier le cahier de texte">
      <Icon icon="mdi:pencil-outline" /> 
    </button>
    <button class="btn" @click="deleteCahier(row.id)" style="color: red;" title="Supprimer le cahier de texte">
      <Icon icon="mdi:trash-can-outline" /> 
    </button>
  </div>
</template>

        </tabEvaluations>

        <p v-else class="no-evaluations-message">Pas de cahier de texte.</p>
      </div>

      <!-- Pagination -->
      <pagination 
        class="pagination2" 
        v-if="tableData.length > pageSize" 
        :totalItems="tableData.length" 
        :pageSize="pageSize" 
        :currentPage="currentPage" 
        @pageChange="handlePageChange" 
      />
    </div>

    <div class="retour">
      <button @click="retour" class="btn btn-secondary">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getCahierTexte, ajouterCahierTexte, modifierCahierTexte, getCahierTexteById, supprimerClasse } from '@/services/CahierDeTexte';
import { Icon } from '@iconify/vue';
import Swal from 'sweetalert2';
import { profile } from '@/services/AuthService';
import imageCahier from '@/assets/image.png';
const router = useRouter();
const route = useRoute();

const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;
const professeurId = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const errors = ref({
  titre: '',
  date: '',
  resume: '',
  ressource: ''
});

const validateField = (field) => {
  if (!formData.value[field]) {
    errors.value[field] = `Le champ ${field} est obligatoire.`;
  } else if (field === 'resume' && formData.value.resume.length > 100) {
    errors.value.resume = "Le resume ne doit pas dépasser 100 caractères.";
  }
  else {
    errors.value[field] = null;
  }
};

const formIsValid = computed(() => {
  return !Object.values(errors.value).some(error => error !== null) &&
         Object.values(formData.value).every(field => field !== '');
});

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    // Récupérer l'ID du professeur connecté
    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Préremplissage de la date avec la date d'aujourd'hui
const today = new Date().toISOString().split('T')[0]; // Formate la date au format YYYY-MM-DD
const formData = ref({
  titre: '',
  date: today, // Date préremplie
  resume: '',
  ressource: '',
  classe_prof_id: classeProf_id,
  id: null
});

const isEditMode = ref(false);

const fetchData = async () => {
  try {
    const response = await getCahierTexte(annee_classe_id);
    tableData.value = response.données
      .map(item => ({
        matiere: item.matiere,
        professeur: item.professeur,
        date: item.date,
        titre: item.titre,
        resume: item.resume,
        id: item.id,
        professeur_id: item.professeur_id
      }))
      // Tri des données par date, les plus récentes en haut
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Erreur lors du chargement des cahiers de texte :', error);
  }
};




const handleFormSubmit = async () => {
   // Valider tous les champs avant de soumettre
   validateField('titre');
  validateField('date');
  validateField('resume');
  validateField('ressource');

  if (!formIsValid.value) {
    return; // Arrêter la soumission si le formulaire n'est pas valide
  }
  try {
    // console.log('Données du formulaire :', formData.value); // Ajout pour le débogage
    if (isEditMode.value) {
      if (!formData.value.id) {
        throw new Error('L\'ID du cahier de texte est manquant.');
      }
      await modifierCahierTexte(formData.value);
      Swal.fire({
        title: 'Succès',
        text: 'Cahier de texte mis à jour avec succès !',
        icon: 'success',
        timer: 3000, // Affiche l'alerte pendant 3 secondes
        showConfirmButton: false
      });
    } else {
      await ajouterCahierTexte(formData.value);
      Swal.fire({
        title: 'Succès',
        text: 'Cahier de texte ajouté avec succès !',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
    }
    resetForm();
    await fetchData();
  } catch (error) {
    Swal.fire('Erreur', 'Erreur lors de la soumission du formulaire.', 'error');
    console.error('Erreur lors de la soumission :', error);
  }
};

const editCahier = async (id) => {
  const cahier = await getCahierTexteById(id);
  // Vérifiez que vous accédez correctement aux propriétés des données
  formData.value = {
    titre: cahier.données.titre,
    date: cahier.données.date,
    resume: cahier.données.resume,
    ressource: cahier.données.ressource,
    id: cahier.données.id
  };
  isEditMode.value = true;

  // Si vous souhaitez préremplir la date avec la date d'aujourd'hui si aucune date n'est fournie
  if (!formData.value.date) {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    formData.value.date = today;
  }
};

const deleteCahier = async (id) => {
  const confirm = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Vous ne pourrez pas revenir en arrière !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer !'
  });

  if (confirm.isConfirmed) {
    try {
      await supprimerClasse(id);
      Swal.fire({
        title: 'Supprimé !',
        text: 'Le cahier de texte a été supprimé.',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
      await fetchData(); // Recharger les données
    } catch (error) {
      Swal.fire('Erreur', 'Erreur lors de la suppression du cahier de texte.', 'error');
      console.error('Erreur lors de la suppression :', error);
    }
  }
};

const resetForm = () => {
  formData.value = {
    titre: '',
    date: today,
    resume: '',
    ressource: '',
    id: null
  };
  isEditMode.value = false;
};

onMounted(fetchData);
onMounted(fetchProfile);

const retour = () => {
  router.go(-1);
};

// Pagination
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return tableData.value.slice(start, start + pageSize.value);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

</script>




<style scoped>
.cahier-text{
  margin-left: 290px;
  margin-right: 50px;
  width: 90%;
}
.image-container {
  position: relative;
}

.image-background {
  width: 98%;
  height: auto;
  border-radius: 12px;
}

.overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  border-radius: 12px;
}
form{
  width: 900px;
  margin-left: 2%;
  margin-top: 2%;
}
 label:hover {
      cursor: pointer; /* Change le curseur lors du survol */
      color: #407CEE; /* Couleur au survol */
  }
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  margin-left: 40px;
  

  
}

input[type="text"],
input[type="date"],
textarea {
  width: 85%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #000000;
  background-color: transparent;
}
input[type="text"]::placeholder, textarea::placeholder{
  color: #F7AE00;
}
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  color: #F7AE00;
}

label{
  font-weight: bold;
}
.main-content {
  margin-top: 120px;
}

.main-content h2 {
  color: black;
  font-size: 24px;
  text-align: center;
  margin-left: 300px;
}

.bouton {
    display: flex;
    justify-content: end;
    margin-right: 60px;
  }
  .bouton .btn-submit {
    background-color: #F7AE00;
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
    background-color: #F7AE00; /* Change la couleur au survol */
  }
.cahiers{
  margin-right: 50px;
  width: 100%;
}
::v-deep .cahiers .tableau .tab-cahiers td:nth-child(5) {
 display: none;
}
::v-deep .cahiers .tableau .tab-cahiers td:nth-child(6) {
 display: none;
}
.tab-cahiers {
    margin-left: 300px;
    margin-right: 50px;
}
.retour {
  display: flex;
  justify-content: end;
  margin-right: 50px;
  margin-bottom: 20px;
  margin-top: 50px;
}
p {
    font-size: 18px;
    color: red;
    font-family: "Poppins", sans-serif;
}
.retour .btn-secondary,
.retour .btn-secondary:hover {
  background-color: transparent;
  color: white;
  border: 1px solid #F7AE00;
  border-radius: 12px;
  cursor: pointer;
  width: 200px;
  height: 58px;
  font-size: 24px;
  color: #F7AE00;
}
 .pagination2{
 
 display: flex;
 justify-content: end;
}
</style>