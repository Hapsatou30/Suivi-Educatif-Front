<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <h2>
      Attribution des matières avec le professeur pour la classe : {{ nomClasse }}
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
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
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

// Récupérer toutes les profMat attribuées à une classe spécifique
const fetchProfMatClasse = async () => {
  const classeId = route.params.id; // Récupérer l'ID de la classe depuis les paramètres de la route
  try {
    const profClasseData = await getProfClasse(classeId); // Appel de la méthode avec l'ID de classe

    // Traiter les données reçues
    if (profClasseData && profClasseData.success) {
      profMatAttribue.value = profClasseData.data.map(profMat => profMat.prof_mat_id);
      console.log('ProfMat attribuées à la classe:', profMatAttribue.value);
    } else {
      console.error('Erreur dans les données récupérées ou succès false.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs pour la classe :', error);
  }
};

const fetchMatProf = async () => {
  try {
    const response = await getMatProf();
    console.log('Réponse API brute:', response);

    if (response && Array.isArray(response.données)) {
      itemList.value = response.données.map(profMat => ({
        id: profMat.id,
        matiere: profMat.matiere,
        professeur: profMat.professeur,
        checked: profMatAttribue.value.includes(profMat.id) 
      }));

      console.log('Liste des ProfMat:', itemList.value);
    } else {
      console.error('La réponse n\'est pas un tableau.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des professeurs :', error);
  }
};

// Méthode pour récupérer les détails d'une année
const detailsAnneeClasse = async (id) => {
  try {
    const response = await getAnneeClasseDetails(id);
    console.log('Réponse API brute:', response); 

    // Vérification si response contient un objet valide
    if (response && response.donnees_classe) {
      const classe = response.donnees_classe; 
      console.log('Détails de la classe:', classe);
      nomClasse.value = classe.nom; // Mise à jour de la variable ici
    } else {
      console.error('Aucun détail de la classe trouvé ou structure inattendue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la classe :', error);
  }
};

// Mettre à jour les professeurs sélectionnés depuis le composant checkbox
const updateSelectedItems = (items) => {
  selectedProfMat.value = items; // Items contient les ids des professeurs sélectionnés
  console.log('Professeurs sélectionnés:', selectedProfMat.value);
};

// Méthode pour attribuer les professeurs à la classe
const attribuerProfClasse = async () => {
  if (selectedProfMat.value.length > 0) {
    try {
      const response = await ajouterProfClasse({
        annee_classe_id: anneClasseId, // Utilisez ce champ
        prof_mat_ids: selectedProfMat.value,
      });


      console.log("Réponse du serveur:", response);

      if (response && response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: response.message || 'Les professeurs ont été attribués avec succès !',
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        // Rechargez les professeurs pour mettre à jour la liste
        await fetchMatProf();
      } else {
        throw new Error(response.message || 'Une erreur est survenue lors de l\'attribution.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des professeurs :', error);
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
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Aucune sélection',
      text: 'Veuillez sélectionner au moins un professeur avant de soumettre.',
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
  console.log('ID de la classe:', anneClasseId);
  detailsAnneeClasse(anneClasseId);
  fetchProfMatClasse().then(fetchMatProf);
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
  justify-content: space-between; /* Centrer les boutons */
  margin-top: 20px; /* Espacement au-dessus des boutons */
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
