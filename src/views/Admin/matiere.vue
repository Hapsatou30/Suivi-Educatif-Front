<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
      <boutons
      title1="Matières" 
        title2="Professeurs"
        page1="matiere"
        page2="professeur"
      />
    </div>
  </template>
  
  <script setup>
  import sidebar_admin from '@/components/sidebarAdmin.vue';
  import topbar_admin from '@/components/topbarAdmin.vue';
  import boutons from '@/components/boutons.vue';
  </script>
  