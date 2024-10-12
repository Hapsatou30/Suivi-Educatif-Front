<template>
  <div class="table-container">
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
          <td v-if="$slots.photo">
            <slot name="photo" :photo="row.photo" />
          </td>
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" v-if="cellIndex !== 0">
            {{ cell }}
          </td>
          <td v-if="$slots.justification">
            <slot name="justification" :justification="row.justification" />
          </td>
          <td v-if="$slots.actions">
            <slot name="actions" :row="row" />
          </td>
          <td v-if="$slots.action">
            <slot name="action" :col="row" />
          </td>
          <td v-if="$slots.resources">
            <slot name="resources" :ressources="row.ressources" />
          </td>
          <td v-if="$slots.resume">
            <slot name="resume" :resume="row.resume" />
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
.table-container {
  overflow-x: auto; /* Ajout du défilement horizontal */
}

table {
  width: 100%;
  border-collapse: collapse; /* Élimine les espaces entre les cellules */
}

th,
td {
  padding: 15px; /* Ajustement du padding pour un look plus compact */
  text-align: center;
  font-family: "Poppins", sans-serif;
  font-size: 16px; /* Ajustement de la taille de la police pour une meilleure lisibilité */
}

th {
  background-color: white;
  font-size: 18px;
  color: #F7AE00;
}

.background {
  background-color: #C7DCF2; /* Fond bleu clair pour les lignes désignées */
}

.no-background {
  background-color: white; /* Texte blanc pour les lignes sans fond */
  border-left: 3px solid #F7AE00; /* Bordure gauche jaune */
}

/* Media queries pour améliorer la responsivité */
@media (max-width: 768px) {
  th,
  td {
    padding: 10px; /* Réduire le padding pour les petits écrans */
    font-size: 14px; /* Réduire la taille de la police */
  }
}

@media (max-width: 480px) {
  th,
  td {
    font-size: 12px; /* Réduire encore la taille de la police pour les très petits écrans */
    padding: 8px; /* Ajuster le padding */
  }
}
</style>
