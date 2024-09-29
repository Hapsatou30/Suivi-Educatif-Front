<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <affiche />
    <div class="row">
      <div class="col-6">
        <div class="widgets-container">
          <widget title="Classes" :number="classesCount" iconSrc="/public/images/Vector.svg" />
          <widget title="Matières" :number="matiereCount" iconSrc="/public/images/Icon.svg" />
        </div>
      </div>
      <div class="col-6">
        <h3>Emploi du temps d’aujourd’hui</h3>
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          :headers="['Horaire', 'Matiere', 'Classe']" 
          :data="paginatedData" 
        />

        <!-- Message affiché si la tableData est vide -->
        <p v-else class="no-evaluations-message">Aucune évaluation prévue pour aujourd'hui.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getNbrClasseProf } from '@/services/ClasseProfs';
import { profile } from '@/services/AuthService';
import { getNbrMatiere } from '@/services/MatiereService';
import tabEvaluations from '@/components/tabEvaluations.vue';

// Variables réactives
const classesCount = ref(0);
const matiereCount = ref(0);
const professeurId = ref('');
const tableData = ref([]);

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    // Récupérer l'ID du professeur connecté
    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Fonction pour récupérer les données des classes du professeur
const fetchData = async () => {
  if (professeurId.value) {
    classesCount.value = await getNbrClasseProf(professeurId.value);
    matiereCount.value = await getNbrMatiere(professeurId.value);
  }
};

// Appelle la récupération des données une fois que le composant est monté
onMounted(async () => {
  await fetchProfile(); 
  await fetchData(); 
});
</script>


<style scoped>
.main-content { 
  margin-top: 120px;
}

.widgets-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  margin-left: 300px;
}
.main-content .row{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.main-content .row .col-6 .widgets-container{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
}

</style>