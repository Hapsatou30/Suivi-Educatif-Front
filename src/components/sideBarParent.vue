<template>
    <div class="sidebar">
      <div class="logo">
        <img src="/public/images/logo_blanc.png" alt="Logo" />
      </div>
      <ul class="menu">
        <li>
          <router-link to="/dashboardParent" class="menu-link" :class="{ active: isActive('/dashboardParent') }">
            <Icon icon="mdi:home-outline" /> Tableau de bord
          </router-link>
        </li>
        <li>
          <router-link to="/gestion_notes_parent" class="menu-link" :class="{ active: isActive('/gestion_notes_parent') || isActive('/notes_enfant')  }">
            <Icon icon="clarity:note-line" /> Notes
          </router-link>
        </li>
        <li>
          <router-link to="/planning" class="menu-link" :class="{ active: isActive('/planning') }">
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
          <router-link to="/gestion_emplois_du_temps_parent" class="menu-link" :class="{ active: isActive('/gestion_emplois_du_temps_parent') || isActive('/emplois_du_temps_enfant')}">
            <Icon icon="cil:calendar" /> Emplois du temps
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
      width: 226px;
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
    