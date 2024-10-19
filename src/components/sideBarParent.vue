<template>
  <div class="burger-menu" @click="toggleSidebar">
    <Icon icon="mdi:menu" class="burger-icon" />
  </div>

  <div :class="['sidebar', isSidebarOpen ? 'open' : '']">
    <div class="logo">
      <img src="@/assets/logo_blanc.png" alt="Logo" />
    </div>
    <ul class="menu">
      <li>
        <router-link to="/dashboardParent" class="menu-link" :class="{ active: isActive('/dashboardParent') }">
          <Icon icon="mdi:home-outline" /> Tableau de bord
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_notes_parent" class="menu-link" :class="{ active: isActive('/gestion_notes_parent') || isActive('/notes_enfant') }">
          <Icon icon="clarity:note-line" /> Notes
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_evaluation_parent" class="menu-link" :class="{ active: isActive('/gestion_evaluation_parent') || isActive('/evaluation_enfant') }">
          <Icon icon="pajamas:planning" /> Évaluations
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_absences_parent" class="menu-link" :class="{ active: isActive('/gestion_absences_parent') || isActive('/absences_par_enfant') }">
          <Icon icon="healthicons:i-training-class" /> Absences
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_cahier_texte_parent" class="menu-link" :class="{ active: isActive('/cahier_texte_enfant') || isActive('/gestion_cahier_texte_parent') }">
          <Icon icon="carbon:book" /> Cahiers de textes
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_emplois_du_temps_parent" class="menu-link" :class="{ active: isActive('/gestion_emplois_du_temps_parent') || isActive('/emplois_du_temps_enfant') }">
          <Icon icon="cil:calendar" /> Emplois du temps
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (path) => {
  return route.path.startsWith(path);
};

// État pour gérer l'affichage de la sidebar
const isSidebarOpen = ref(false);

// Écouteur d'événements pour mettre à jour l'état lors du redimensionnement
const handleResize = () => {
  if (window.innerWidth >= 1000) {
    isSidebarOpen.value = true; // Ouvre par défaut en mode ordinateur
  } else {
    isSidebarOpen.value = false; // Ferme en mode mobile
  }
};

// Ajoute un écouteur d'événement pour la redimension
onMounted(() => {
  handleResize(); // Appel initial
  window.addEventListener('resize', handleResize);
});

// Fonction pour basculer la barre latérale
const toggleSidebar = () => {
  if (window.innerWidth < 1000) {
    isSidebarOpen.value = !isSidebarOpen.value; // Basculer uniquement en mode mobile
  }
};
</script>

<style scoped>
/* Bouton burger */
.burger-menu {
  display: none; 
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1000;
  background-color: #407CEE;
  padding: 10px;
  border-radius: 5px;
}

.burger-icon {
  color: white;
  font-size: 24px;
}

/* Sidebar */
.sidebar {
  position: fixed;
  left: -250px; /* Masqué par défaut */
  top: 0;
  width: 250px;
  height: 100vh; 
  background-color: #407CEE;
  transition: left 0.3s ease-in-out; 
  z-index: 999; 
}

.sidebar.open {
  left: 0; /* Affiché lorsque ouvert */
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 150px;
  height: 150px;
}

.menu {
  list-style-type: none;
  padding: 0;
  margin-left: 10%;
  margin-top: 50px;
}

.menu li {
  margin: 20px 0;
}

.menu-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 18px;
  padding: 5px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  width: 226px;
}

.menu-link .iconify,.material-symbols-outlined  {
  margin-right: 10px;
  font-size: 30px;
}

.router-link-exact-active,
.active {
  background-color: white;
  color: #407CEE;
  width: 226px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.router-link-exact-active .iconify, 
.active .iconify {
  color: #407CEE;
}

.menu-link:hover {
  color: #F7AE00;
}

/* Styles responsifs */
@media (max-width: 1000px) {
  .burger-menu {
    display: block; /* Afficher le bouton burger pour les appareils inférieurs à 1000px */
  }

  .sidebar {
    left: -250px; /* Masqué par défaut sur mobile */
  }

  .sidebar.open {
    left: 0; /* Afficher la sidebar lorsque ouvert */
  }
}
</style>
