<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <h2>
      Attibution des Classes pour l’année :  {{ anneeScolaire }}
    </h2>
    <div class="check">
      <!-- Écoute de l'événement d'items sélectionnés depuis le composant checkbox -->
      <checkbox :items="itemList" :imageSrc="imageSource" @update:selectedItems="updateSelectedItems" />
    </div>
    <div class="button-container">
      <button @click="attribuerclasses" class="btn btn-custom">Enregistrer</button>
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
import {  getAnneeDetails } from '@/services/AnneeScolaireService';
import { getClasses } from '@/services/ClasseService'; 
import { ajouterAnneClasses, getAnneClasses } from '@/services/AnneeClasseService'; 
import Swal from 'sweetalert2';
import imageSource from '@/assets/annee_classes.png';


const router = useRouter();
const route = useRoute();

const itemList = ref([]);
const anneeScolaire = ref('');
const anneeId = route.params.id;
const selectedClasses = ref([]); // Référence pour stocker les IDs des classes sélectionnées
const classesAttribuees = ref([]); // Pour stocker les classes déjà attribuées

// Récupérer les classes attribuées
const fetchAnneeClasses = async (id) => {
  try {
    const response = await getAnneClasses();
    // console.log('Données reçues de getAnneClasses:', response.données); 

    if (response?.données) {
      const idAsNumber = Number(id); // Convertir l'ID en nombre si nécessaire
      const annee = response.données.find(an => an.id === idAsNumber); 

      if (annee) {
        // Stocker les classes attribuées pour utilisation dans fetchClasses
        classesAttribuees.value = annee.classes.map(classe => classe.nom);
        // console.log('Classes attribuées au annee:', classesAttribuees.value);
      } else {
        console.warn('Aucun annee trouvé avec cet ID.');
      }
    } else {
      console.error('Aucune donnée reçue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des classes de l\'annee :', error);
  }
};

// Récupérer toutes les classes et cocher celles déjà attribuées
const fetchClasses = async () => {
  try {
    const response = await getClasses();
    // console.log('Réponse API brute:', response); // Affiche la réponse brute

    // Vérifiez si la réponse est un tableau et non un objet
    if (Array.isArray(response)) {
      itemList.value = response.map(classe => ({
        id: classe.id,
        nom: classe.nom,
        niveau: classe.niveau,
        capacite: classe.capacite,
        checked: classesAttribuees.value.includes(classe.nom)
      }));
      // console.log('Liste des classes:', itemList.value);
    } else {
      console.error('La réponse n\'est pas un tableau.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
  }
};



// Méthode pour récupérer les détails d'une année
const detailsAnnee = async (id) => {
  try {
    const response = await getAnneeDetails(id);
    // console.log('Réponse API brute:', response); // Vérifier ce que retourne réellement l'API

    // Vérification si response contient un objet valide
    if (response && response.données) {
      const annee = response.données;
      // console.log('Détails de l\'année:', annee);
      anneeScolaire.value = `${annee.annee_debut} - ${annee.annee_fin}`;
    } else {
      console.error('Aucun détail de l\'année trouvé ou structure inattendue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du annees-scolaires :', error);
  }
};



// Mettre à jour les classes sélectionnées depuis le composant checkbox
const updateSelectedItems = (items) => {
  selectedClasses.value = items; // Items contient les ids des classes sélectionnées
  // console.log('Classes sélectionnées:', selectedClasses.value);
};

// Méthode pour attribuer les classes au professeur
const attribuerclasses = async () => {
  if (selectedClasses.value.length > 0) {
    try {
      const response = await ajouterAnneClasses({
        annee_id: anneeId,
        classe_ids: selectedClasses.value,
      });

      // console.log("Réponse du serveur:", response);

      // Vérifiez si la réponse inclut un champ "success"
      if (response && response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Les classes ont été attribuées avec succès !',
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        await fetchClasses();
      } else {
        // Traitement des messages de succès qui sont considérés comme des erreurs
        throw new Error(response.message || 'Une erreur est survenue lors de l\'attribution.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des classes :', error);

      // Vérifiez si l'erreur provient d'un message de succès
      if (error.message.includes('Classes synchronisées avec succès')) {
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
  // console.log('ID de l\'annee:', anneeId);
  detailsAnnee(anneeId);
  fetchAnneeClasses(anneeId).then(fetchClasses);
});
  </script>
  
  <style scoped>
 .main-content {
  background-color: white;
  min-height: 100vh;  /* S'assure que la section couvre au moins 100% de la hauteur de la fenêtre */
  padding-top: 150px;
  margin-top: 0;
  overflow-x: hidden;
  
}

.button-container {
    margin-left: 300px;
    margin-right: 50px;
    display: flex;
    justify-content: space-between; /* Centrer les boutons */
    margin-top: 20px;       /* Espacement au-dessus des boutons */
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
    width: 107%;
    margin-left: -4%;
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
  width: 150%;
}
}
  </style>