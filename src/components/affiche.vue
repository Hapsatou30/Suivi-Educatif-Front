<template>
  <div class="card-container">
    <div class="left-section">
      <h1 class="title">Bienvenue dans <span>SAMA ÉCOLE</span></h1>
      <p class="sub-title">Année scolaire : <span class="annee_cours"> {{ anneeEnCours ? anneeEnCours.annee_debut + ' - ' + anneeEnCours.annee_fin : 'Non disponible' }}</span> </p>

    </div>
    <div class="right-section">
      <img src="/public/images/Teacher and student.png" alt="Image école" class="school-image" />
    </div>
  </div>
</template>

<script setup>
//importation des dépendances
import { ref, onMounted } from 'vue';
import { AnneeScolaireService } from '@/services/AnneeScolaireService'; 

const anneeEnCours = ref(null); // Variable pour stocker l'année scolaire en cours

// Fonction pour récupérer l'année scolaire en cours
const fetchAnneeEnCours = async () => {
  try {
    anneeEnCours.value = await AnneeScolaireService.getAnneeEnCours();
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'année scolaire en cours:', error);
  }
};

// Appeler la fonction lors du montage du composant
onMounted(fetchAnneeEnCours);
</script>

  <style scoped>
  .card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-left: 300px;
    margin-right: 50px;
    border-radius: 12px;
    height: 160px;
  }
  
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .title {
    font-size: 30px;
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    margin: 0;
    color: black;
  }
  span{
    color: #F7AE00;
  }
  
  .sub-title {
    font-size: 18px;
    margin-top: 10px;
    color: #333;
  }
  
  .right-section {
    display: flex;
    align-items: center;
  }
  
  .school-image {
    width: 386px;
    height: 177px;
    border-radius: 8px;
    position: relative;
    top: -9px;
  }
  .annee_cours{
    font-weight: bold;
    color: black;
  }
  </style>
  