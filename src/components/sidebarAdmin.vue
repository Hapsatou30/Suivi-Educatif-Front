<template>
  <!-- Burger menu for mobile -->
  <div class="burger-menu" @click="toggleSidebar">
    <Icon icon="mdi:menu" class="burger-icon" />
  </div>

  <!-- Sidebar -->
  <div :class="['sidebar', isSidebarOpen ? 'open' : '']">
    <div class="logo">
      <img src="@/assets/logo_blanc.png" alt="Logo" />
    </div>
    <ul class="menu">
        <li>
          <router-link to="/dashboard" class="menu-link" :class="{ active: isActive('/dashboard') }">
            <Icon icon="mdi:home-outline" /> Tableau de bord
          </router-link>
        </li>
        <li>
          <router-link to="/professeurs" class="menu-link" :class="{ active: isActive('/professeurs') || isActive('/matieres') || isActive('/prof_matiere')    }">
            <Icon icon="mdi:teacher" /> Professeurs
          </router-link>
        </li>
        <li>
          <router-link to="/annees" class="menu-link"  :class="{ active: isActive('/annees') || isActive('/classes') || isActive('/annee_classes') || isActive('/list_classes') || isActive('/class_prof') || isActive('/Emplois_du_temps') || isActive('/classe_eleves') || isActive('/eleves_classe')}">
            <Icon icon="iwwa:year" /> Année scolaire
          </router-link>
        </li>
        <li>
          <router-link to="/liste_eleves" class="menu-link">
            <Icon icon="ph:student" /> Élèves
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_notes_admin" class="menu-link"  :class="{ active: isActive('/gestion_notes_admin') || isActive('/notes_matieres') || isActive('/notes')    }">
            <Icon icon="clarity:note-line" /> Notes
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_evaluations" class="menu-link" :class="{ active: isActive('/gestion_evaluations') || isActive('/evaluations_classe') }" >
            <span class="material-symbols-outlined"> task </span>
            Évaluations
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_cahier_texte_admin" class="menu-link" :class="{ active: isActive('/gestion_cahier_texte_admin') || isActive('/cahier_texte_classe') }" >
            <Icon icon="carbon:book" /> Cahiers de textes
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_absences_admin" class="menu-link" :class="{ active: isActive('/gestion_absences_admin') || isActive('/absences_classe_admin') }">
            <Icon icon="mdi:account-off" /> Absences
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_bulletins_admins" class="menu-link"  :class="{ active: isActive('/gestion_bulletins_admins') || isActive('/bulletins_par_classe')  || isActive('/bulletins_1er_Semestre_par_eleve')  || isActive('/bulletins_2eme_Semestre_par_eleve')     }">
            <Icon icon="clarity:note-line" /> Bulletins
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
const isSidebarOpen = ref(false);

// Checks if a route is active
const isActive = (path) => route.path.startsWith(path);

// Handle screen resize
const handleResize = () => {
  isSidebarOpen.value = window.innerWidth >= 992; // Sidebar open by default on large screens
};

// Toggle sidebar visibility
const toggleSidebar = () => {
  if (window.innerWidth < 992) {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

// Initialize resize listener
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Burger menu styling */
.burger-menu {
  display: none;
  position: fixed;
  top: 60px;
  left: 15px;
  background-color: #407CEE;
  padding: 10px;
  border-radius: 5px;
  z-index: 1000;
}

.burger-icon {
  color: white;
  font-size: 24px;
}

/* Sidebar styling */
.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  background-color: #407CEE;
  padding: 20px;
  transition: left 0.3s ease-in-out;
  z-index: 999;
}

.sidebar.open {
  left: 0;
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
  margin-left: 2%;
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
}

.menu-link .iconify, .material-symbols-outlined {
  margin-right: 10px;
  font-size: 30px;
}

/* Active link styling */
.router-link-exact-active,
.active {
  background-color: white;
  color: #407CEE;
  width: 226px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.router-link-exact-active .iconify, .active .iconify {
  color: #407CEE;
}

/* Hover effect */
.menu-link:hover {
  color: #F7AE00;
}

/* Responsive styling */
@media (max-width: 992px) {
  .burger-menu {
    display: block;
  }

  .sidebar {
    left: -250px;
  }

  .sidebar.open {
    left: 0;
  }
}
@media (max-width: 576px) {

  .burger-menu {
 
  position: fixed;
  top: 2px;
  left: 15px;
}
}
</style>
