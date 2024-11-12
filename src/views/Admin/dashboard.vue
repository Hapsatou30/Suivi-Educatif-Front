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
    <div class="row mt-5 diagrammes">
  <div class="chart-container col-lg-3 col-md-6 col-12">
    <h5 style="text-align: center; margin-bottom: 5px;">Répartition des élèves par sexe</h5>
    <PieChart />
  </div>
  <div class="chart-container1 col-lg-6 col-md-6 col-12">
    <h5 style="text-align: center; margin-bottom: 5px;">Présences et Absences par jour de la semaine</h5>
    <BarChart />
  </div>
</div>

   

    <div class="evaluations">
      <h2>Les évaluations du jour</h2>
      <div class="tableau">
        <!-- Vérifier si la tableData est vide -->
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          :headers="['Matière', 'Professeur', 'Typeauto', 'Heure', 'Classe', 'Durée(mins)']" 
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
import { getElevesCount } from '@/services/EleveService';
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
  
  
};

onMounted(() => {
  fetchData();
  
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
.diagrammes{
    display: flex;
    justify-content: space-between; 
    align-items: center; 
    margin-left: 300px;
    margin-right: 50px;

    
  }
.chart-container{
 
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
}
.chart-container1{
 
  margin-top: 40px;
  border-radius: 10%;
  padding: 1%;
}
@media (max-width: 992px) {
  .main-content { 
  margin-top: 1500px;
  overflow-x: hidden;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}
.widgets-container {
    flex-direction: column; /* Disposition en colonne sur mobile */
    align-items: center; /* Centrer les widgets */
    margin-left: 20px;
    margin-right: 20px;
    gap: 20px; 
  }
  .diagrammes{
    display: flex;
    flex-direction: column; /* Disposition en colonne sur mobile */
    align-items: center; /* Centrer les diagrammes */
    margin-left: 20px;
    margin-right: 20px;
    gap: 50px;
    
  }
  .chart-container{
    margin: 0 ;
  }
 .chart-container1{
  margin-right: 0;
  margin-left: 0vw;
  width: 100%;
 }
 .evaluations h2{
 
    margin-left: 0;
}
.tableau{
  margin-left: 0;
  margin-right: 0;
}
}
@media (max-width: 768px) {
  .main-content { 
  margin-top: 1600px;
  overflow-x: hidden;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
}
}
@media (max-width: 576px) {
  .main-content { 
  margin-top: 1500px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  overflow-x: hidden;
}
.widgets-container {
    flex-direction: column; /* Disposition en colonne sur mobile */
    align-items: center; /* Centrer les widgets */
    margin-left: 20px;
    margin-right: 20px;
    gap: 20px; 
  }
  .diagrammes{
    display: flex;
    flex-direction: column; /* Disposition en colonne sur mobile */
    align-items: center; /* Centrer les diagrammes */
    margin-left: 0px;
    margin-right: 0px;
    gap: 50px;
    
  }
  .chart-container{
    margin: 0 ;
  }
 .chart-container1{
  margin-right: 0;
  margin-left: 0vw;
  width: 100%;
 }
 .evaluations h2{
 font-size: 20px;
    margin-left: 0;
}
.tableau{
  margin-left: 0;
  margin-right: 0;
}
}
/* @media (max-width: 468px) {
  .main-content { 
  margin-top: 1100px;
}
} */
</style>
