<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
      <matrice  :horaires="horaires" :data="donnees" :jours="joursDeLaSemaine" />
           
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import sidebarProf from '@/components/sidebarProf.vue';
  import topBarProf from '@/components/topBarProf.vue';
  import matrice from '@/components/matrice.vue';



const horaires = ref([
  { temps: '08:00 - 10:00' },
  { temps: '10:15 - 12:00' },
  { temps: '12:15 - 14:00' },
  { temps: '14:15 - 16:00' },
  { temps: '16:15 - 18:00' }
]);

const joursDeLaSemaine = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);

// Remplacez ceci par vos données réelles
const donnees = ref([
  // Exemple de structure de données
  [ [{ id: 1, Matiere: 'Mathématiques', classe: '6ème A' }, /* ... */], [], [], [], [] ],
  [ [], [{ id: 1, Matiere: 'Mathématiques', classe: '6ème A' }], [], [], [] ],
  [ [], [], [{ id: 1, Matiere: 'Mathématiques', classe: '6ème A' }], [], [] ],
  [ [], [], [], [{ id: 1, Matiere: 'Mathématiques', classe: '6ème A' }], [] ],
  [ [], [], [], [], [{ id: 1, Matiere: 'Mathématiques', classe: '6ème A' }] ]
]);
  </script>
  
  
  <style scoped>
  .main-content {
    margin-top: 120px;
  }
  
  
  </style>