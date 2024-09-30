<template>
    <div class="topbar">
      <div class="left-section">
        <h4>Bonjour, {{ prenomUser }}</h4>
      </div>
      <div class="right-section ">
        <div class="notifications">
          <Icon icon="mdi:bell-outline" class="notification" />
        </div>
        <div class="photo">
          <img :src="photoUser" alt="Photo de profil" />
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  // Importation des dépendances
  import { ref, onMounted } from 'vue';
  import { profile } from '@/services/AuthService'; 
  import { Icon } from '@iconify/vue';
  
  // Variables réactives pour stocker le prénom et la photo de l'utilisateur
  const prenomUser = ref('');
  const photoUser = ref('');
  
  // Fonction pour récupérer les informations de profil de l'utilisateur
  const fetchProfile = async () => {
    try {
      const response = await profile(); 
      const user = response.user; 
      prenomUser.value = response.user.professeur.prenom;
      photoUser.value = response.user.professeur.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s'; // Si la photo n'existe pas, utilisez une image par défaut
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
  };
  
  // Appeler la fonction fetchProfile lorsque le composant est monté
  onMounted(fetchProfile);
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
  .topbar  .left-section h4{
    font-size: 18px; 
    color: #F7AE00; 
    font-family: "Poppins", sans-serif;
    font-weight: 500; 
  }
  
  .left-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    
  }
  
  .right-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 35px;
  }
  
  .icon {
    font-size: 30px;
    margin-right: 10px;
  }
  
 
  
  .notifications {
    font-size: 30px;
    margin-right: 10px;
    color: #F7AE00;
    margin-bottom: 5px;
  }
  
 .right-section .photo img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
 
 }
  </style>
  