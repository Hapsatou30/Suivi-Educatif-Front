<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <affiche />
    <div class="widgets-container">
      <widget title="Élèves" :number="elevesCount" iconClass="twemoji:man-student-medium-dark-skin-tone" />
      <widget title="Professeurs" :number="professeursCount" iconClass="noto-v1:woman-teacher-dark-skin-tone" />
      <widget title="Classes" :number="classesCount" :iconSrc="vectorIconSrc" />
    </div>

    <!-- Ajout du graphique circulaire -->
   <div class="row mt-5" >
    <div class="chart-container col-3">
      <h5 style="text-align: center; margin-bottom: 5px;">Répartition des élèves par sexe</h5>
      <PieChart :maleCount="elevesCountMale" :femaleCount="elevesCountFemale" />
    </div>
    <!-- Ajout du graphique en barres pour les présences et absences -->
    <div class="chart-container1 col-6">
      <h5 style="text-align: center; margin-bottom: 5px;">Présences et Absences par jour de la semaine</h5>
        <BarChart />
      </div>
   </div>

    <!-- <router-link to="/professeurs" class="addTeacher">
      <Icon icon="ei:plus" class="plus" />
      <h3>Ajouter un professeur</h3>
    </router-link> -->

    <div class="evaluations">
      <h2>Les évaluations du jour</h2>
      <div class="tableau">
        <!-- Vérifier si la tableData est vide -->
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          :headers="['Matière', 'Professeur', 'Type', 'Heure', 'Classe', 'Durée(mins)']" 
          :data="paginatedData" 
        />

        <!-- Message affiché si la tableData est vide -->
        <p v-else class="alert alert-info" >
          Aucune évaluation prévue pour aujourd'hui.
        </p>
      </div>

      <!-- Composant de pagination -->
      <pagination class="pagination"
        v-if="tableData.length > pageSize"
        :totalItems="tableData.length"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @pageChange="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getElevesCount, getEleves } from '@/services/EleveService';
import { getProfesseursCount } from '@/services/ProfesseurService';
import PieChart from '@/components/PieChart.vue'; 
import BarChart from '@/components/BarChart.vue';
import { getClassesCount } from '@/services/ClasseService';
import { Icon } from '@iconify/vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue'; 
import { getEvaluationsJour } from '@/services/Evaluations';
import vectorIconSrc from '@/assets/Vector.svg';

const elevesCount = ref(0);
const professeursCount = ref(0);
const classesCount = ref(0);
const tableData = ref([]);
const currentPage = ref(1); // Page actuelle
const pageSize = ref(5); // Nombre d'éléments par page
const elevesCountMale = ref(0);
const elevesCountFemale = ref(0);

// Calculer les données à afficher pour la page actuelle
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// Fonction pour gérer le changement de page
const handlePageChange = (page) => {
  currentPage.value = page;
};

// Récupérer les données
const fetchData = async () => {
  elevesCount.value = await getElevesCount();
  professeursCount.value = await getProfesseursCount();
  classesCount.value = await getClassesCount();
  
  const response = await getEvaluationsJour();
  if (response && response.length > 0) {
    tableData.value = response.map(item => [
      item.matiere,
      item.professeur, 
      item.type,
      item.heure,
      item.classe,
      item.duree
    ]);
  }
  
  // Récupérer les élèves et compter par genre
  const eleves = await getEleves();
console.log('Élèves récupérés :', eleves); // Vérifiez les élèves récupérés

if (Array.isArray(eleves)) {
  // Convertir les genres en minuscules pour le filtrage
  elevesCountMale.value = eleves.filter(eleve => eleve.genre.toLowerCase() === "masculin").length;
  elevesCountFemale.value = eleves.filter(eleve => eleve.genre.toLowerCase() === "feminin").length;
} else {
  console.error('Les données des élèves ne sont pas au format attendu :', eleves);
}

};

onMounted(() => {
  fetchData();
  console.log('Male Count:', elevesCountMale.value, 'Female Count:', elevesCountFemale.value);
});

</script>


<style scoped>
.main-content { 
  margin-top: 120px;
  overflow-x: hidden;
}

.widgets-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  margin-left: 300px;
  margin-right: 50px;
}
.addTeacher {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 30px;
  margin-right: 50px;
  cursor: pointer;
  text-decoration: none;
  color: black;
}
.addTeacher h3 {
  margin-left: 10px;
  font-size: 24px;
  font-weight: bold;
}
.evaluations{
  margin-bottom: 20px;
}
.evaluations h2{
  font-size: 30px; /* Taille du titre */
    margin-bottom: 20px; /* Marge inférieure */
    text-align: start; /* Centrer le texte */
    color: black; /* Couleur du texte */
    font-family: "Poppins", sans-serif; /* Police utilisée */
    font-weight: 500; 
    margin-left: 300px;
}
.plus {
  font-size: 60px;
}
.tableau{
  margin-left: 300px;
  margin-right: 50px;
}

.pagination{
  margin-left: 275px;
  margin-right: 50px;
  display: flex;
  justify-content: end;
}
.chart-container{
  background-color: rgb(241, 241, 241);
  margin-left: 300px;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
}
.chart-container1{
  background-color: rgb(241, 241, 241);
  margin-right: 50px;
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
}
.chart-container h4{
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px
}
</style>
