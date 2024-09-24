<template>
    <nav aria-label="Pagination">
      <ul class="pagination">
        <!-- Bouton "Précédent" -->
        <li :class="['page-item', { disabled: currentPage === 1 }]">
          <button 
            class="page-link" 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1">
            <span class="material-symbols-outlined">
            arrow_left
            </span>
          </button>
        </li>
  
        <!-- Boutons pour chaque page -->
        <li 
          v-for="page in totalPages" 
          :key="page" 
          :class="['page-item', { active: page === currentPage }]">
          <button 
            class="page-link" 
            @click="changePage(page)">
            {{ page }}
          </button>
        </li>
  
        <!-- Bouton "Suivant" -->
        <li :class="['page-item', { disabled: currentPage === totalPages }]">
          <button 
            class="page-link" 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages">
            <span class="material-symbols-outlined">
            arrow_right
            </span>
          </button>
        </li>
      </ul>
    </nav>
  </template>
<script setup>
import { defineProps, defineEmits, computed } from 'vue';

// Propriétés passées au composant pour gérer la pagination
const props = defineProps({
  totalItems: {
    type: Number, // Nombre total d'éléments
    required: true
  },
  pageSize: {
    type: Number, // Nombre d'éléments par page
    default: 5
  },
  currentPage: {
    type: Number, // Page actuelle
    default: 1
  }
});

// Événements pour émettre les changements de page
const emit = defineEmits(['pageChange']);

// Calculer le nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize);
});

// Fonction pour changer de page et émettre l'événement
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page);
  }
};
</script>
<style scoped>
.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.page-item {
  margin: 0 5px;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
.page-item:last-child .page-link {
  border-top-right-radius: var(--bs-pagination-border-radius);
  border-bottom-right-radius: var(--bs-pagination-border-radius);
  border: none;
}
.page-item:first-child .page-link[data-v-41dbdf20][data-v-41dbdf20],.page-item:last-child .page-link[data-v-41dbdf20] {
  border-top-right-radius: var(--bs-pagination-border-radius);
  border-bottom-right-radius: var(--bs-pagination-border-radius);
  border: none;
  background-color: transparent;
}
.page-item.active .page-link {
  background-color: #F7AE00; 
  color: white; 
  border-color: #F7AE00; 
  border-radius: 50%; 
  width: 50px; 
  height: 50px; 
}

.page-link {
  border: 1px solid #A098AE; 
  padding: 8px; 
  text-align: center; 
  cursor: pointer; 
  background-color: transparent; 
  color: #A098AE; 
  border-radius: 50%; 
  width: 50px; 
  height: 50px; 
  display: flex;
  align-items: center; 
  justify-content: center; 
}
.page-link:hover{
  color: #F7AE00;
}

.material-symbols-outlined {
  font-size: 40px; 
}
</style>
