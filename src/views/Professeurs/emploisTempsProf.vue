<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
      <matrice />
    </div>
  </template>
  
  <script setup>
  import sidebarProf from '@/components/sidebarProf.vue';
  import topBarProf from '@/components/topBarProf.vue';
  import matrice from '@/components/matrice.vue';

  </script>
  
  
  <style scoped>
  .main-content {
    margin-top: 120px;
  }
  
  
  </style>