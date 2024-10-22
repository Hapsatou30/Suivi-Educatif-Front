<template>
    <sideBarEleve />
    <topBarEleve />
    <div class="main-content">
        <affiche />
        
        
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import sideBarEleve from '@/components/sideBarEleve.vue';
import topBarEleve from '@/components/topBarEleve.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { profile } from '@/services/AuthService';
// import tabEvaluations from '@/components/tabEvaluations.vue';
// import pagination from '@/components/paginations.vue'; 
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');
const eleveId = ref([]);
const tableData = ref([]); // Initialiser avec un tableau vide pour éviter undefined
const currentPage = ref(1); // Page actuelle
const pageSize = ref(5); // Nombre d'éléments par page

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;

        // Récupérer l'ID du parent connecté
        if (user && user.eleve) {
            eleveId.value = user.eleve.id;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};









// Calculer les données à afficher pour la page actuelle
const paginatedData = computed(() => {
    if (!tableData.value || tableData.value.length === 0) return [];
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    const dataToDisplay = tableData.value.slice(start, end);
    // console.log('Paginated Data:', dataToDisplay); // Ajoutez ce log pour déboguer
    return dataToDisplay;
});


// Fonction pour gérer le changement de page
const handlePageChange = (page) => {
    currentPage.value = page;
};

// Appels aux fonctions lors du montage du composant
onMounted(async () => {
    await fetchProfile();
    
});
</script>

<style scoped>
.main-content {
    margin-top: 120px;
    overflow-x: hidden;
}

.evaluations{
    margin-top: 80px;
}
.evaluations h2{
    text-align: start;
}

.widgets-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    margin-left: 300px;
    margin-right: 50px;
}

.absence_jour {
    margin-right: 50px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
}

.cards-container {
    display: flex;
    flex-wrap: wrap;
    /* Pour autoriser le retour à la ligne si l'espace est insuffisant */
    gap: 20px;
    /* Espace entre les cartes */
    justify-content: flex-start;
    /* Aligner les cartes à gauche */
    margin-top: 20px;
}

.card {
    flex: 1 1 300px;
    /* Chaque carte occupera au moins 300px et pourra s'agrandir si de la place est disponible */
    max-width: 300px;
}


.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #F7AE00;
}

.card-title {
    margin: 0 0 12px;
    font-size: 24px;
    color: white;
    text-align: center;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.left-paragraph {
    margin: 0;
    font-size: 18px;
    color: white;
}

.right-paragraph {
    margin: 0;
    font-size: 18px;
    color: red;
}
.tableau1 {
    margin-left: 300px;
    margin-right: 50px;
  }
.diagrammes{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    margin-left: 300px;
    margin-right: 50px;
   
}

/* Media queries pour rendre la section responsive sur mobile */
@media (max-width: 992px) {
    .main-content {
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}
  .header {
    flex-direction: column;
    align-items: flex-start; /* Aligner les éléments à gauche sur mobile */
    margin: 0; /* Supprimer les marges latérales */
  }

  .widgets-container, .diagrammes {
    flex-direction: column;
    align-items: flex-start; 
    justify-content: start;
    margin-top: 30px;
    margin-bottom: 20px;
    margin-left: 0;

    
  }
  .evaluations{
    margin-top: 8%;
    margin-bottom: 70%;
}
.evaluations h2{
    font-size: 20px;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0px;
}
.tableau1 {
    margin-left: 0;
    margin-right: 0;
  }
  .absence_jour {
    margin: 20px 0; /* Ajouter un peu d'espace au-dessus et en-dessous sur mobile */
    width: 100%; /* Faire en sorte que l'élément prenne toute la largeur disponible */
  }

  .card {
    flex: 1 1 100%; /* Les cartes occuperont toute la largeur sur mobile */
    max-width: 100%; /* S'assurer qu'elles ne dépassent pas la largeur de l'écran */
  }

  .card-title {
    font-size: 20px; /* Réduire la taille du titre sur mobile */
  }

  .left-paragraph, .right-paragraph {
    font-size: 16px; /* Réduire la taille des paragraphes sur mobile */
  }
  .chart-container1{
  margin-left: 0;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.chart-container{
margin-right: 0;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
  width: 90%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
 
}
  
}

@media (max-width: 576px) {
  .main-content {
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}
 .evaluations{
    margin-top: 0;
    margin-bottom: 100%;
}
.evaluations h2{
    font-size: 20px;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0px;
}
    .tableau1 {
    margin-left: 0;
    margin-right: 0;
  }
  
  .card-title {
    font-size: 18px; /* Réduire encore plus la taille du titre pour les petits écrans */
  }

  .left-paragraph, .right-paragraph {
    font-size: 14px; /* Réduire la taille des paragraphes pour les petits écrans */
  }
  h5{
    font-size: 18px;
    text-align: center;
  }
  .chart-container1{
  margin-left: 0;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.chart-container{

  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
  width: 90%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
 
}
  }
</style>