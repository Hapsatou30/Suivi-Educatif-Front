<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <affiche />
      <div class="widgets-container">
      <widget title="Élèves" :number="elevesCount" iconClass="ic:baseline-group" />
      <widget title="Professeurs" :number="professeursCount" iconClass="ic:baseline-person" />
      <widget title="Classes" :number="classesCount" iconClass="ic:baseline-class" />
    </div>
  
  </div>
    
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import sidebar_admin from '@/components/sidebar_admin.vue';
  import topbar_admin from '@/components/topbar_admin.vue';
  import affiche from '@/components/affiche.vue';
  import widget from '@/components/widget.vue';
  import { getElevesCount } from '@/services/EleveService';
  import { getProfesseursCount } from '@/services/ProfesseurService';
  import { getClassesCount } from '@/services/ClasseService';
  
  const elevesCount = ref(0);
  const professeursCount = ref(0);
  const classesCount = ref(0);
  
  const fetchData = async () => {
    elevesCount.value = await getElevesCount();
    professeursCount.value = await getProfesseursCount();
    classesCount.value = await getClassesCount();
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
  margin-top: 20px;
  margin-left: 300px;
  margin-right: 50px;
}

  </style>
  