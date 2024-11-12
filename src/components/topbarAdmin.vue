<template>
  <div class="topbar">
    <div class="left-section">
      <Icon icon="mdi:calendar-outline" class="icon" />
      <span class="date">{{ currentDate }}</span>
    </div>
    <div class="right-section">
      <div class="notifications" @click="handleNotificationClick">
        <Icon icon="mdi:bell-outline" class="notification" />
        <span class="badge">{{ unreadCount }}</span>
      </div>
      <div class="logout" @click="handleLogout">
        <Icon icon="humbleicons:logout" width="30" height="30" class="deconnexion" />
        Deconnexion
      </div>
    </div>

    <!-- Modal de notifications -->
    <NotificationModal
      v-if="isModalVisible"
      :title="'Notifications'"
      :notifications="notifications"
      :confirmText="'Fermer'"
      :cancelText="null"
      @close="handleCloseModal"
    />
  </div>
</template>

<script setup>
// Importation des dépendances
import { Icon } from '@iconify/vue';
import { ref, onMounted,computed } from 'vue';
import { logout } from '@/services/AuthService';
import { getNotifications } from '@/services/NotificationService';
import NotificationModal from './NotificationModal.vue';

// Déclaration des variables réactives
const currentDate = ref('');
const isModalVisible = ref(false); // Gérer la visibilité du modal
const notifications = ref([]); // Stocker les notifications récupérées

// Fonction pour formater la date
const formatDate = () => {
  const date = new Date();
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('fr-FR', options);
};


// Méthode pour gérer la déconnexion
const handleLogout = async () => {
  try {
    await logout();
    window.location.href = '/login';
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
  }
};

const unreadCount = computed(() => {
  return notifications.value.filter(notification => notification.is_read === 0).length; // Compte les notifications non lues
});


// Méthode pour récupérer et afficher les notifications
const fetchNotifications = async () => {
  try {
    const response = await getNotifications(); // Appel à la méthode pour récupérer les notifications
    notifications.value = response.données; // Stocker les notifications récupérées dans la variable
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications', error);
  }
};

// Méthode pour gérer le clic sur l'icône des notifications
const handleNotificationClick = () => {
  isModalVisible.value = true; // Ouvrir le modal
};

// Fonction pour fermer le modal
const handleCloseModal = () => {
  isModalVisible.value = false;
};


// Calculer et afficher la date actuelle au montage du composant
onMounted(() => {
  currentDate.value = formatDate();
  fetchNotifications();
});
</script>

<style scoped>
/* Styles existants */
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
  width: 200px;
  height: 50px;
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
  margin-right: 10px;
}

.date {
  font-size: 20px;
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
.badge {
  position: relative; /* Positionner le badge sur l'icône */
  top: -15px; /* Ajuster la position verticale */
  right: 4px; /* Ajuster la position horizontale */
  background-color: red; /* Couleur de fond du badge */
  color: white; /* Couleur du texte */
  border-radius: 50%; /* Rendre le badge circulaire */
  padding: 5px 8px; /* Espacement interne */
  font-size: 14px; /* Taille de police */
}

/* Optionnel: rendre le badge moins visible quand il affiche 0 */
.badge {
  opacity: 1; /* Assure que l'élément est visible */
}
/* Rendre la topbar responsive */
@media (max-width: 992px) {
  .topbar {
    flex-direction: column; 
    padding: 10px;
    margin-left: 0;
    height: auto;
  }

  .left-section, .right-section {
    width: 100%;
    justify-content: center; /* Centrer les éléments */
    margin-left: 0; /* Supprimer la marge */
    margin-right: 0;
    margin-bottom: 10px; /* Espacement entre les sections sur petits écrans */

  }

  .left-section {
    height: auto; /* Ajuster la hauteur pour l'adapter au contenu */
    padding: 10px; /* Ajouter un peu d'espace autour du contenu */
    font-size: 20px; /* Réduire la taille de la police */
    display: flex;
  }

  .icon {
    font-size: 24px; /* Réduire la taille de l'icône sur petits écrans */
    margin-right: 5px;
  }

  .date {
    font-size: 18px; /* Réduire la taille de la date sur petits écrans */
  }

  .notifications, .logout {
    font-size: 20px; /* Ajuster la taille des icônes de notification et de déconnexion */
  }

  .badge {
    font-size: 12px; /* Réduire la taille du badge */
    padding: 3px 6px;
    top: -10px;
    right: 2px;
  }
}

/* Pour les très petits écrans */
@media (max-width: 576px) {
  .right-section {
    display: flex;
    align-items: center;

  }
  .left-section{
    display: none;
  }

  .topbar {
    padding: 5px;
  }

  .icon, .notifications, .logout {
    font-size: 20px; /* Encore réduire la taille des icônes */
  }

 
}

</style>
