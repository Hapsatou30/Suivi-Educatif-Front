<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <affiche />
    <div class="widgets-container">
      <widget title="Élèves" :number="elevesCount" iconClass="twemoji:man-student-medium-dark-skin-tone" />
      <widget title="Professeurs" :number="professeursCount" iconClass="noto-v1:woman-teacher-dark-skin-tone" />
      <widget title="Classes" :number="classesCount" iconSrc="/public/images/Vector.svg" />
    </div>

    <div class="addTeacher">
      <Icon icon="ei:plus" class="plus" /> 
      <h3>Ajouter un professeur</h3>
    </div>

    <div class="evaluations">
      <h2>Les évaluations du jour</h2>
      <div>
        <!-- Vérifier si la tableData est vide -->
        <tabEvaluations 
          v-if="tableData.length > 0"
          :headers="['Matière', 'Professeur', 'Type', 'Heure', 'Classe', 'Durée(mins)']" 
          :data="tableData" 
        />

        <!-- Message affiché si la tableData est vide -->
        <p v-else class="no-evaluations-message">Aucune évaluation prévue pour aujourd'hui.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getElevesCount } from '@/services/EleveService';
import { getProfesseursCount } from '@/services/ProfesseurService';
import { getClassesCount } from '@/services/ClasseService';
import { Icon } from '@iconify/vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import { getEvaluationsJour } from '@/services/Evaluations';

const elevesCount = ref(0);
const professeursCount = ref(0);
const classesCount = ref(0);
const tableData = ref([]);

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
    
    console.log('Données du tableau :', tableData.value);
  }
};


onMounted(() => {
  fetchData();
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
  margin-right: 50px;
}
.addTeacher {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 30px;
  margin-right: 50px;
}
h3 {
  margin-left: 10px;
  font-size: 24px;
  font-weight: bold;
}
.plus {
  font-size: 60px;
}

.evaluations {
  margin-top: 40px;
  margin-left: 300px;
  margin-right: 50px;
}
</style>
