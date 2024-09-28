<template>
  <div>
    <table>
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          :class="{'background': (rowIndex + 1) % 2 === 0, 'no-background': (rowIndex + 1) % 2 !== 0}"
        >
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>

          <!-- Slot pour les actions -->
          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
          
          <!-- Slot pour l'action spécifique aux élèves -->
          <td v-if="$slots.action">
            <slot name="action" :col="row" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  headers: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
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
  