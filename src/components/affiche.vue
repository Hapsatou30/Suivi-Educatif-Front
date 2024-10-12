<template>
  <div class="card-container">
    <div class="left-section">
      <h1 class="title">Bienvenue dans <span>SAMA ÉCOLE</span></h1>
      <p class="sub-title">Année scolaire : <span class="annee_cours"> {{ anneeEnCours ? anneeEnCours.annee_debut + ' - ' + anneeEnCours.annee_fin : 'Non disponible' }}</span> </p>

    </div>
    <div class="right-section">
      <img src="@/assets/Teacher and student.png" alt="Image école" class="school-image" />
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
  height: 160px;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-container:hover {
  transform: scale(1.05); /* Zoom à 105% au survol */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Ombre supplémentaire au survol */
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

span {
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

.annee_cours {
  font-weight: bold;
  color: black;
}


@media (max-width: 768px) {
  .card-container {
   
    margin: 0; 
    padding: 10px;
    height: auto;
  }

  .title {
    font-size: 24px; 
    text-align: center;
  }

  .sub-title {
    font-size: 16px; 
    text-align: center;
  }

  .right-section {
    margin-top: 20px;
  }

  .school-image {
    width: 280px; 
    height: auto;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 20px; 
  }

  .sub-title {
    font-size: 14px; 
  }

  .school-image {
    width: 200px; 
  }
}

  </style>
  