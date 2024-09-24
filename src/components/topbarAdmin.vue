<template>
    <div class="topbar">
      <div class="left-section">
        <Icon icon="mdi:calendar-outline" class="icon" />
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="right-section">
        <div class="notifications">
            <Icon icon="mdi:bell-outline" class=" notification" />
        </div>
        <div class="logout" @click="handleLogout"> 
        <Icon icon="humbleicons:logout" width="30" height="30" class="deconnexion" />
        Deconnexion
      </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Importation des dépendances
  import { Icon } from '@iconify/vue';
  import { ref, onMounted } from 'vue';
  import { logout } from '@/services/AuthService';

  // Déclaration d'une variable réactive pour la date actuelle
  const currentDate = ref('');

  // Fonction pour formater la date au format souhaité
  const formatDate = () => {
    const date = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' }; // Options de formatage
    return date.toLocaleDateString('fr-FR', options); // Retourne la date formatée en français
  };

  // Méthode pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // Appel de la méthode de déconnexion
      window.location.href = '/login'; // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error); // Gestion de l'erreur
    }
  };

  // Utilisation de onMounted pour mettre à jour la date lors du montage du composant
  onMounted(() => {
    currentDate.value = formatDate(); // Mettre à jour la date actuelle
  });
</script>

  
  <style scoped>
  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    padding: 0 20px;
    margin-left: 250px; 
    background-color: #FAFAF7;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;
    border-bottom: 1px dashed #F7AE00;
  }
  
  .left-section {
    display: flex;
    align-items: center;
    width: 262px;
    height: 58px;
    background-color: #F7AE00;
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
  }
  
  .right-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 50px;
  }
  
  .icon {
    font-size: 30px;
    margin-right: 20px;
  }
  
  .date {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  }
  
  .notifications {
    font-size: 30px;
    margin-right: 10px;
    color: #F7AE00;
    margin-bottom: 5px;
  }
  
  .logout {
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    color: #F7AE00;
  }
  </style>
  