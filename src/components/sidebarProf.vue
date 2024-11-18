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
        <router-link to="/dashboard_prof" class="menu-link" :class="{ active: isActive('/dashboard_prof') }">
          <Icon icon="mdi:home-outline" /> Tableau de bord
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_notes" class="menu-link" :class="{ active: isActive('/gestion_notes') || isActive('/notes_classe') }">
          <Icon icon="clarity:note-line" /> Notes
        </router-link>
      </li>
      <li>
        <router-link to="/planning" class="menu-link" :class="{ active: isActive('/planning') }">
          <Icon icon="pajamas:planning" /> Planning
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_absences" class="menu-link" :class="{ active: isActive('/gestion_absences') || isActive('/fiche_de_presence') }">
          <Icon icon="healthicons:i-training-class" /> Fiche de présence
        </router-link>
      </li>
      <li>
        <router-link to="/gestion_cahier_texte" class="menu-link" :class="{ active: isActive('/gestion_cahier_texte') || isActive('/cahier_texte_prof') }">
          <Icon icon="carbon:book" /> Cahiers de textes
        </router-link>
      </li>
      <li>
        <router-link to="/emplois_du_temps_prof" class="menu-link" :class="{ active: isActive('/emplois_du_temps_prof') }">
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

const isSidebarOpen = ref(false);

const handleResize = () => {
  if (window.innerWidth >= 1000) {
    isSidebarOpen.value = true;
  } else {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

const toggleSidebar = () => {
  if (window.innerWidth < 1000) {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};
</script>

<style scoped>
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

.sidebar {
  position: fixed;
  left: -250px;
  top: 0;
  width: 250px;
  height: 100vh;
  background-color: #407CEE;
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

.menu-link .iconify {
  margin-right: 10px;
  font-size: 30px;
}

.active {
  background-color: white;
  color: #407CEE;
  width: 226px;
  border-top-left-radius: 40px;
  border-bottom-left-radius: 40px;
}

.active .iconify {
  color: #407CEE;
}

.menu-link:hover {
  color: #F7AE00;
}

@media (max-width: 992px) {
  .burger-menu {
    display: block;
    margin-top: -10px;
  }

  .sidebar {
    left: -250px;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>
