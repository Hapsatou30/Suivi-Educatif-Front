<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <h2>
      Attribution des matières au professeur : {{ professeurNomPrenom }}
    </h2>
    <div class="check">
      <!-- Écoute de l'événement d'items sélectionnés depuis le composant checkbox -->
      <checkbox :items="itemList" :imageSrc="imageSource" @update:selectedItems="updateSelectedItems" />
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
import { ajouterProfMatiere } from '@/services/ProfMatiere';
import Swal from 'sweetalert2';


const router = useRouter();
const route = useRoute();

const itemList = ref([]);
const imageSource = ref('/public/images/teacher_subject.png');
const professeurNomPrenom = ref('');
const professeurId = route.params.id;

// Référence pour stocker les IDs des matières sélectionnées
const selectedMatieres = ref([]);

// Méthode pour récupérer les matières
const fetchMatieres = async () => {
  try {
    const response = await getMatieres();
    itemList.value = response.données.map(matiere => ({
      id: matiere.id,
      nom: matiere.nom,
      description: matiere.description,
      coefficient: matiere.coefficient,
    }));
    console.log(itemList.value);
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
      console.log('Détails du professeur:', professeur);
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
  console.log('Matières sélectionnées:', selectedMatieres.value);
};

// Méthode pour attribuer les matières au professeur
const attribuerMatiere = async () => {
  if (selectedMatieres.value.length > 0) {
    try {
      // Envoyer les données à l'API pour attribuer les matières
      const response = await ajouterProfMatiere({
        professeur_id: professeurId, 
        matiere_ids: selectedMatieres.value, 
      });

      console.log("Réponse du serveur:", response);

      // Vérification si l'API retourne un succès
      if (response && response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Les matières ont été attribuées avec succès !',
          confirmButtonColor: '#407CEE',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });

        // Après attribution, vous pouvez mettre à jour les données ou effectuer d'autres actions
        await fetchMatieres(); // Optionnel : recharger les matières
      } else {
        throw new Error(response.message || 'Une erreur est survenue lors de l\'attribution.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution des matières :', error);

      // Affichage d'une alerte d'erreur si quelque chose se passe mal
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
    // Affichage d'une alerte si aucune matière n'est sélectionnée
    Swal.fire({
      icon: 'warning',
      title: 'Aucune sélection',
      text: 'Veuillez sélectionner au moins une matière avant de soumettre.',
      confirmButtonColor: '#f0ad4e',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    console.log('Aucune matière sélectionnée');
  }
};



// Méthode pour retourner à la page précédente
const retour = () => {
  router.back();
};

onMounted(() => {
  fetchMatieres();
  detailsProf(professeurId);
});
</script>



<style scoped>
.main-content {
  background-color: white; 
  padding-top: 150px;          
  margin-top: 0;     
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
