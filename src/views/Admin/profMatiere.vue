<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <h2>
      Attribution des matières au professeur : {{ professeurNomPrenom }}
    </h2>
    <div class="check">
      <checkbox :items="itemList" :imageSrc="imageSource" />
    </div>
    <div class="button-container">
      <button @click="handleFirstButtonClick" class="btn btn-custom">Enregistrer</button>
      <button @click="handleSecondButtonClick" class="btn btn-secondary">Retour</button>
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

const router = useRouter(); // Créer une instance de router
const route = useRoute(); // Créer une instance de route pour accéder aux paramètres de l'URL

const itemList = ref([]); // Déclarer une référence pour stocker les matières
const imageSource = ref('/public/images/teacher_subject.png');
const professeurNomPrenom = ref(''); // Référence pour stocker le nom et prénom du professeur
const professeurId = route.params.id; // Récupération de l'ID du professeur depuis les paramètres de l'URL

// Méthode pour récupérer les matières
const fetchMatieres = async () => {
  try {
    const response = await getMatieres(); // Appel de la méthode pour récupérer les matières
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
    const response = await getProfesseurDetails(id); // Récupération des détails du professeur
    if (response && response.données) {
      const professeur = response.données; // Extraire les données de la réponse
      console.log('Détails du professeur:', professeur);
      professeurNomPrenom.value = `${professeur.prenom} ${professeur.nom}`;
    } else {
      console.error('Aucun détail de professeur trouvé.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du professeur :', error);
  }
};

// Récupérer les matières et les détails du professeur au moment où le composant est monté
onMounted(() => {
  fetchMatieres();
  detailsProf(professeurId);
});

// Méthodes pour les boutons
const handleFirstButtonClick = () => {
  // Logique pour l'enregistrement
  console.log("Enregistrer a été cliqué");
};

const handleSecondButtonClick = () => {
  // Retourner à la page précédente
  router.back();
};
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

.button-container .btn-secondary {
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
