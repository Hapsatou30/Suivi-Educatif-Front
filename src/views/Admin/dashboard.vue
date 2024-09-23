<template>
  <sidebar_admin />
  <topbar_admin />
    <div class="details">
      <h1>Détails de l'élément</h1>
      <p>Ceci est la page de détails.</p>
    </div>
  </template>
  
  <script setup>
  import sidebar_admin from '@/components/sidebar_admin.vue';
  import topbar_admin from '@/components/topbar_admin.vue';
  </script>
  
  <style scoped>
  .details {
    text-align: center;
  }
  </style>
  