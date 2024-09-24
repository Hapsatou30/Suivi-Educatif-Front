<template>
    <div>
      <!-- Création d'une table -->
      <table>
        <thead>
          <tr>
            <!-- Génération dynamique des en-têtes du tableau à partir de la propriété 'headers' -->
            <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Génération dynamique des lignes du tableau à partir de la propriété 'data' -->
          <tr
            v-for="(row, rowIndex) in data"
            :key="rowIndex"
            :class="{'background': (rowIndex + 1) % 2 === 0, 'no-background': (rowIndex + 1) % 2 !== 0}"
          >
            <!-- Génération des cellules de chaque ligne -->
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Définir les propriétés du composant pour recevoir des données externes
  const props = defineProps({
    headers: {
      type: Array, // Type attendu pour les en-têtes : tableau
      required: true // Cette propriété est requise
    },
    data: {
      type: Array, // Type attendu pour les données : tableau
      required: true // Cette propriété est requise
    }
  });
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse; /* Élimine les espaces entre les cellules */
  }
  
  th, td {
    padding: 20px; 
    text-align: center; 
    font-family: "Poppins", sans-serif;
    font-size: 18px;
  }
  
  th {
    background-color: white; 
    font-family: "Poppins", sans-serif;
    font-size: 20px;
    color: #F7AE00;
  }
  
  .background {
    background-color: #C7DCF2; /* Fond bleu clair pour les lignes désignées */
  }
  
  .no-background {
    background-color: white; /* Texte blanc pour les lignes sans fond */
    border-left: 3px solid #F7AE00; /* Bordure gauche jaune */
  }
  </style>
  