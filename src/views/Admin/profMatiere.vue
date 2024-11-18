<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <h2>
      Attribution des matières au professeur : {{ professeurNomPrenom }}
    </h2>
    <div class="check">
      <!-- Écoute de l'événement d'items sélectionnés depuis le composant checkbox -->
      <checkbox :items="itemList" :imageSrc="teacher_subject" @update:selectedItems="updateSelectedItems" />
    </div>
    <div class="button-container">
      <button @click="attribuerMatiere" class="btn btn-custom">Enregistrer</button>
      <button @click="retour" class="btn btn-secondary">Retour</button>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import checkbox from '@/components/checkbox.vue';
import { getMatieres } from '@/services/MatiereService';
import { getProfesseurDetails } from '@/services/ProfesseurService';
import { ajouterProfMatiere, getProfMatiere } from '@/services/ProfMatiere';
import Swal from 'sweetalert2';
import teacher_subject from '@/assets/teacher_subject.png';

const router = useRouter();
const route = useRoute();

const itemList = ref([]);
const professeurNomPrenom = ref('');
const professeurId = route.params.id;
const selectedMatieres = ref([]); // Référence pour stocker les IDs des matières sélectionnées
const matieresAttribuees = ref([]); // Pour stocker les matières déjà attribuées


// Récupérer les matières attribuées
const fetchProfMatiere = async (id) => {
  try {
    const response = await getProfMatiere();
    // console.log('Données reçues de getProfMatiere:', response.données); 

    if (response?.données) {
      const idAsNumber = Number(id); // Convertir l'ID en nombre si nécessaire
      const professeur = response.données.find(prof => prof.id === idAsNumber); 

      if (professeur) {
        // Stocker les matières attribuées pour utilisation dans fetchMatieres
        matieresAttribuees.value = professeur.matieres.map(matiere => matiere.nom);
        // console.log('Matières attribuées au professeur:', matieresAttribuees.value);
      } else {
        console.warn('Aucun professeur trouvé avec cet ID.');
      }
    } else {
      console.error('Aucune donnée reçue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des matières du professeur :', error);
  }
};

// Récupérer toutes les matières et cocher celles déjà attribuées
const fetchMatieres = async () => {
  try {
    const response = await getMatieres();
    itemList.value = response.données.map(matiere => ({
      id: matiere.id,
      nom: matiere.nom,
      description: matiere.description,
      coefficient: matiere.coefficient,
      checked: matieresAttribuees.value.includes(matiere.nom) // Cocher si la matière est déjà attribuée
    }));
    // console.log('Liste des matières:', itemList.value);
  } catch (error) {
    console.error('Erreur lors de la récupération des matières :', error);
  }
};


// Méthode pour récupérer les détails d'un professeur
const detailsProf = async (id) => {
  try {
    const response = await getProfesseurDetails(id);
    if (response && response.données) {
      const professeur = response.données;
      // console.log('Détails du professeur:', professeur);
      professeurNomPrenom.value = `${professeur.prenom} ${professeur.nom}`;
    } else {
      console.error('Aucun détail de professeur trouvé.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du professeur :', error);
  }
};

// Mettre à jour les matières sélectionnées depuis le composant checkbox
const updateSelectedItems = (items) => {
  selectedMatieres.value = items; // Items contient les ids des matières sélectionnées
  // console.log('Matières sélectionnées:', selectedMatieres.value);
};

// Méthode pour attribuer les matières au professeur
const attribuerMatiere = async () => {
  if (selectedMatieres.value.length > 0) {
    try {
      const response = await ajouterProfMatiere({
        professeur_id: professeurId,
        matiere_ids: selectedMatieres.value,
      });

      // console.log("Réponse du serveur:", response);

      // Vérifiez si la réponse inclut un champ "success"
      if (response && response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Les matières ont été attribuées avec succès !',
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        await fetchProfMatiere(professeurId).then(fetchMatieres);
      } else {
        // Traitement des messages de succès qui sont considérés comme des erreurs
        throw new Error(response.message || 'Une erreur est survenue lors de l\'attribution.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des matières :', error);

      // Vérifiez si l'erreur provient d'un message de succès
      if (error.message.includes('Matières synchronisées avec succès')) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: error.message,
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
       
      } else {
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
    }
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune sélection',
      text: 'Veuillez sélectionner au moins une matière avant de soumettre.',
      confirmButtonColor: '#f0ad4e',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
};



// Méthode pour retourner à la page précédente
const retour = () => {
  router.back();
};

onMounted(() => {
  // console.log('ID du professeur:', professeurId);
  detailsProf(professeurId);
  fetchProfMatiere(professeurId).then(fetchMatieres);
});

</script>





<style scoped>
.main-content {
  background-color: white; 
  padding-top: 150px;          
  margin-top: 0;     
  overflow-x: hidden;
}

.button-container {
    margin-left: 300px;
    margin-right: 50px;
    display: flex;
    justify-content: space-between; 
    margin-top: 20px;      
}

.button-container .btn-custom {
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
    margin-bottom: 30px;
}

.button-container .btn-secondary, .button-container .btn-secondary:hover {
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
@media (max-width: 992px) {
  .main-content{
    height: 100vh;
  }
  .main-content h2{
   margin-left: 0%;
}
.button-container {
    margin-left: 50px;
    margin-right: 50px;
    display: flex;
    justify-content: space-between; 
    margin-top: 20px;      
}
}
@media (max-width: 576px) {
  .main-content{
   margin-top: -20%;
  }
  .main-content h2{
   margin-left: 10%;
   font-size: 20px;
   width: 75%;
}
.button-container {
    margin-left: 15%;
    display: flex;
    flex-direction: column;
    justify-content: center; 
    align-items: center;    
}
.check{
  width: 200%;
}
}
</style>
