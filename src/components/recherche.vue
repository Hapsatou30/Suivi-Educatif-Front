<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="Rechercher..."
        class="search-input"
      />
      
      <!-- Affichage dynamique des résultats -->
      <ul v-if="filteredResults.length > 0" class="search-results">
        <li v-for="(result, index) in filteredResults" :key="index" @click="selectResult(result)">
          {{ result }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  // Déclaration d'une variable réactive pour stocker la requête de recherche
  const searchQuery = ref('');
  const results = ref([]); // Les résultats seront remplis à partir de l'API
  
  // Fonction pour récupérer les résultats depuis la base de données
  const loadResults = async () => {
    results.value = await fetchResults(); // Récupérer les données de l'API
  };
  
  // Calculer les résultats filtrés en fonction de la requête de recherche
  const filteredResults = computed(() => {
    return results.value.filter(result =>
      result.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
  
  // Fonction appelée lors de la recherche
  const onSearch = () => {
    console.log('Recherche pour:', searchQuery.value);
  };
  
  // Fonction pour gérer la sélection d'un résultat
  const selectResult = (result) => {
    console.log('Résultat sélectionné:', result);
    // Ici, vous pouvez émettre un événement ou effectuer une action avec le résultat sélectionné
  };
  
  // Charger les résultats lors du montage du composant
  onMounted(loadResults);
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    border-radius: 12px;
    width: 395px;
  }
  
  .search-input {
    padding: 8px;
    border: none;
    border-radius: 4px;
    width: 100%;
  }
  
  .search-results {
    list-style-type: none;
    margin: 0;
    padding: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }
  
  .search-results li {
    padding: 8px;
    cursor: pointer;
  }
  
  .search-results li:hover {
    background-color: #f0f0f0;
  }
  </style>
  