<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
      <h2>
        Attibution des Classes pour l’année :  {{ nomClasse }}
      </h2>
      <div class="check">
        <!-- Écoute de l'événement d'items sélectionnés depuis le composant checkbox -->
        <checkbox :items="itemList" :imageSrc="imageSource" @update:selectedItems="updateSelectedItems" />
      </div>
      <div class="button-container">
        <button @click="attribuerProfClasse" class="btn btn-custom">Enregistrer</button>
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
  import {  getAnneeClasseDetails } from '@/services/AnneeClasseService';
  import { getMatProf } from '@/services/ProfMatiere';
  import { ajouterProfClasse, getProfClasse } from '@/services/ClasseProfs';
  import Swal from 'sweetalert2';
  
  const router = useRouter();
  const route = useRoute();
  
  const itemList = ref([]);
  const imageSource = ref('/public/images/classProf.png');
  const nomClasse = ref('');
  const anneClasseId = route.params.id;
  const selectedProfMat = ref([]); // Référence pour stocker les IDs des prof_mat sélectionnées
  const profMatAttribue = ref([]); // Pour stocker les prof_mat déjà attribuées
  
  
 

  
  // Récupérer toutes les profMAth et cocher celles déjà attribuées
  const fetchMatProf = async () => {
  try {
    const response = await getMatProf();
    console.log('Réponse API brute:', response); // Affiche la réponse brute

    // Vérifiez si response.données est un tableau
    if (response && Array.isArray(response.données)) {
        itemList.value = response.données.map(profMat => ({
            id: profMat.id,
            matiere: profMat.matiere,
            professeur: profMat.professeur,
            // checked: profMatAttribue.value.includes(profMat.professeur)
        }));

      console.log('Liste des ProfMath1:', itemList.value);
    } else {
      console.error('La réponse n\'est pas un tableau.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
  }
};

  
  
  
  // Méthode pour récupérer les détails d'une année
  const detailsAnneeClasse = async (id) => {
  try {
    const response = await getAnneeClasseDetails(id);
    console.log('Réponse API brute:', response); // Vérifiez ce que retourne réellement l'API

    // Vérification si response contient un objet valide
    if (response && response.donnees_classe) { // Corrigé ici pour accéder à 'donnees_classe'
      const classe = response.donnees_classe; // Corrigé ici pour accéder à 'donnees_classe'
      console.log('Détails de la classe:', classe);
      nomClasse.value = `${classe.nom}`; // Mise à jour de la variable ici
    } else {
      console.error('Aucun détail de la classe trouvé ou structure inattendue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la classe :', error);
  }
};


  
  
  
  // Mettre à jour les classes sélectionnées depuis le composant checkbox
  const updateSelectedItems = (items) => {
    selectedProfMat.value = items; // Items contient les ids des classes sélectionnées
    console.log('Classes sélectionnées:', selectedProfMat.value);
  };
  
  // Méthode pour attribuer les classes au professeur
  const attribuerProfClasse = async () => {
    if (selectedProfMat.value.length > 0) {
      try {
        const response = await ajouterProfClasse({
            annee_classe_id: anneClasseId,
            prof_mat_ids: selectedProfMat.value,
        });
  
        console.log("Réponse du serveur:", response);
  
        // Vérifiez si la réponse inclut un champ "success"
        if (response && response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: response.message || 'Les profMats ont été attribuées avec succès !',
            confirmButtonColor: '#407CEE',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
          });
  
          await fetchMatProf();
        } else {
          // Traitement des messages de succès qui sont considérés comme des erreurs
          throw new Error(response.message || 'Une erreur est survenue lors de l\'attribution.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'attribution des profMat :', error);
  
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
    console.log('ID de l\'annee_Classe:', anneClasseId);
    detailsAnneeClasse(anneClasseId);
     fetchMatProf();
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
  
    </style>