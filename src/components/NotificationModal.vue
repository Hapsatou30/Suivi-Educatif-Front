<template>
    <div class="modal">
      <div class="modal-content">
        <h2>{{ title }}</h2>
        <ul>
          <li
            v-for="notification in notifications"
            :key="notification.id"
            @mouseenter="markAsRead(notification.id)" 
          >
            <div class="notification-card" :class="{ read: notification.is_read, unread: !notification.is_read }">
              <p>{{ notification.contenu }}</p>
              <small>{{ formatDate(notification.created_at) }}</small>
            </div>
          </li>
        </ul>
        <button @click="closeModal">{{ confirmText }}</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { markNotificationAsRead, markNotificationAsUnread, supprimerNotification } from '@/services/NotificationService'; // Importer le service
  
  // Props
  const props = defineProps({
    title: String,
    notifications: Array,
    confirmText: String,
  });
  
  // Emit
  const emit = defineEmits(['close']);
  
  // Méthode pour fermer le modal
  const closeModal = () => {
    emit('close');
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    try {
      const notification = props.notifications.find(n => n.id === notificationId);
      if (notification && !notification.is_read) {
        await markNotificationAsRead(notificationId); // Appel à la méthode du service
        notification.is_read = true; // Marquer comme lue localement
        // console.log(`Notification ${notificationId} marquée comme lue`); // Débogage
  
        // Supprimer automatiquement la notification si elle est lue
        await supprimerNotification(notificationId); // Appel à l'API pour supprimer la notification
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification', error);
    }
  };
  
  // Marquer une notification comme non lue
  const markAsUnread = async (notificationId) => {
    try {
      const notification = props.notifications.find(n => n.id === notificationId);
      if (notification && notification.is_read) {
        await markNotificationAsUnread(notificationId); // Appel à la méthode du service
        notification.is_read = false; // Marquer comme non lue localement
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification', error);
    }
  };
  
  // Appeler markAsRead pour toutes les notifications non lues lors de l'affichage
  onMounted(() => {
    props.notifications.forEach(notification => {
      if (!notification.is_read) {
        markAsRead(notification.id); // Marquer comme lue au moment de l'affichage
      }
    });
  });
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #f7f7f7;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  h2 {
    margin-bottom: 10px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 15px;
  }
  
  .notification-card {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  .unread {
    background-color: #ffffff; /* Blanc pour non lu */
    border: 1px solid #ccc; /* Bord gris pour non lu */
  }
  
  .read {
    background-color: #ffffff; /* Blanc pour non lu */
    border: 1px solid #ccc; /* Bord gris pour non lu */
  }
  
  button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #f7ae00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .notification-card p {
    color: black;
  }
  </style>
  