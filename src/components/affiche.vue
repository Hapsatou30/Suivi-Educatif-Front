<template>
  <div class="container">
    <div class="card-containeraffiche ">
      <div class="left-section ">
        <h1 class="title">Bienvenue dans <span>SAMA ÉCOLE</span></h1>
        <p class="sub-title">Année scolaire : <span class="annee_cours"> {{ anneeEnCours ? anneeEnCours.annee_debut + ' - ' + anneeEnCours.annee_fin : 'Non disponible' }}</span></p>
      </div>
      <div class="right-section ">
        <img src="@/assets/Teacher and student.png" alt="Image école" class="school-image" />
      </div>
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
.container{
  margin: 30px 0;
  overflow: hidden;
  width: 100%;
  max-width: 100%;

}
.card-containeraffiche {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 100%;
  width: 100%;
  margin-left:284px;
  margin-right: 50px;
  margin-right: 50px;
}

.card-containeraffiche:hover {
  transform: scale(1.05); /* Zoom à 105% au survol */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Ombre supplémentaire au survol */
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 150%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  margin: 0;
  color: black;
  padding-top: 5%;
}

span {
  color: #F7AE00;
}

.sub-title {
  font-size: 18px;
  margin-top: 10px;
  color: #333;
}

.school-image {
  width: 386px;
  height: auto;
  border-radius: 8px;
}

.annee_cours {
  font-weight: bold;
  color: black;
}

/* Responsivité */
@media (max-width: 992px) {
  .container{
    max-width: 95%;
    width: 95%;
   margin-right: auto;
   margin-left: auto;
  overflow: hidden;
}
.card-containeraffiche {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
 max-width: 97%;
 width: 100%;
   margin-right: auto;
   margin-left: auto;
}
  .title {
    font-size: 24px;
  }

  .sub-title {
    font-size: 16px;
  }

  .school-image {
    width: 280px;
  }
}




@media (max-width: 576px) {
  .title {
    font-size: 100%; 
  }

  .sub-title {
    font-size: 14px; 
  }

  .school-image {
    width: 200px; 
  }
}
</style>
  