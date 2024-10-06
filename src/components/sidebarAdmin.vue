<template>
    <div class="sidebar">
      <div class="logo">
        <img src="/public/images/logo_blanc.png" alt="Logo" />
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
          <router-link to="/absences" class="menu-link">
            <Icon icon="mdi:account-off" /> Absences
          </router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { Icon } from '@iconify/vue';
  import { useRoute } from 'vue-router';

const route = useRoute();

const isActive = (path) => {
  return route.path.startsWith(path);
};
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    background-color: #407CEE;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    padding: 20px;
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
    padding: 05px;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
  }
  
  .menu-link .iconify, .material-symbols-outlined {
    margin-right: 10px;
    font-size: 30px;
  }
  
  /* Style pour les liens actifs */
  .router-link-exact-active {
    background-color: white;
    color: #407CEE;
    width: 226px;
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }
  
  .router-link-exact-active .iconify, .router-link-exact-active .material-symbols-outlined {
    color: #407CEE;
  }
  
  /* Hover effect */
  .menu-link:hover {
    color: #F7AE00;
  }
  .active {
  background-color: white;
  color: #407CEE;
  width: 226px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.active .iconify, .active .material-symbols-outlined {
  color: #407CEE;
}

/* Hover effect */
.menu-link:hover {
  color: #F7AE00;
}
  </style>
  