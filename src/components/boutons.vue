<template>
  <div class="btn-group">
    <!-- Premier bouton avec titre et route dynamiques -->
    <div class="left">
      <router-link
        :to="{ name: page1 }"
        class="btn"
        :class="{ active: isActive(page1) }"
      >
        {{ title1 }}
      </router-link>
    </div>

    <!-- Deuxième bouton avec titre et route dynamiques -->
    <div class="right">
      <router-link
        :to="{ name: page2 }"
        class="btn"
        :class="{ active: isActive(page2) }"
      >
        {{ title2 }}
      </router-link>
    </div>
  </div>
</template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  // Définir les props pour les titres et les routes
  const props = defineProps({
    title1: {
      type: String,
      required: true, 
    },
    title2: {
      type: String,
      required: true, 
    },
    page1: {
      type: String,
      required: true, 
    },
    page2: {
      type: String,
      required: true, 
    }
  });
  
  // Récupère la route actuelle
  const route = useRoute();
  
  // Fonction qui vérifie si la route actuelle correspond à celle du bouton
  const isActive = (pageName) => {
    return route.name === pageName;
  };
  </script>
  
  <style scoped>
/* Style pour le conteneur des boutons */
.btn-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 300px;
  max-width: 1200px; /* Limiter la largeur maximale */
  padding: 0 20px; /* Ajouter du padding sur les côtés */
  gap: 20px; /* Espacement entre les boutons */
}

.btn {
  padding: 10px 20px;
  background-color: white;
  border-color: #F7AE00;
  color: #F7AE00;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s;
  width: 300px;
  max-width: 300px; /* Largeur maximale */
  text-align: center; /* Centrer le texte */
  margin-bottom: 40px;
}

.btn.active {
  background-color: #F7AE00;
  color: white;
}

.btn:hover {
  background-color: white;
  color: #F7AE00;
}



/* Responsivité pour les mobiles */
@media (max-width: 480px) {
  .btn-group {
    flex-direction: column; /* Aligne les boutons en colonne */
    gap: 15px; /* Espacement entre les boutons réduit */
  }

  .btn {
    font-size: 18px; /* Taille de police encore plus petite pour les très petits écrans */
    padding: 8px 15px; /* Réduit l'espacement pour les boutons */
  }
}
</style>
