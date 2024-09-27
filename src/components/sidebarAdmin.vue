<template>
    <div class="sidebar">
      <div class="logo">
        <img src="/public/images/logo_blanc.png" alt="Logo" />
      </div>
      <ul class="menu">
        <li>
          <router-link to="/dashboard" class="menu-link">
            <Icon icon="mdi:home-outline" /> Tableau de bord
          </router-link>
        </li>
        <li>
          <router-link to="/professeurs" class="menu-link">
            <Icon icon="mdi:teacher" /> Professeurs
          </router-link>
        </li>
        <li>
          <router-link to="/annees" class="menu-link">
            <Icon icon="iwwa:year" /> Année scolaire
          </router-link>
        </li>
        <li>
          <router-link to="/eleves" class="menu-link">
            <Icon icon="ph:student" /> Élèves
          </router-link>
        </li>
        <li>
          <router-link to="/notes" class="menu-link">
            <Icon icon="clarity:note-line" /> Notes
          </router-link>
        </li>
        <li>
          <router-link to="/evaluations" class="menu-link">
            <span class="material-symbols-outlined"> task </span>
            Évaluations
          </router-link>
        </li>
        <li>
          <router-link to="/cahiers-de-textes" class="menu-link">
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
  </style>
  