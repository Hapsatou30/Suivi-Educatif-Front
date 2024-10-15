import { apiUrl } from '@/config/apiConfig'; // URL de l'API
import axios from 'axios'; // Utilisation d'axios pour faire les requêtes HTTP

// Récupérer les notifications de l'utilisateur
export const getNotifications = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/user/notifications`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });
    
    return response.data; // Retourner les notifications récupérées
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications :', error);
    return []; // Retourner un tableau vide en cas d'erreur
  }
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${apiUrl}/notifications/${notificationId}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });
    
    return response.data; // Retourner la réponse de l'API
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification comme lue :', error);
  }
};

// Marquer une notification comme non lue
export const markNotificationAsUnread = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${apiUrl}/notifications/${notificationId}/unread`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    return response.data; // Retourner la réponse de l'API
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification comme non lue :', error);
  }
};

// Méthode pour supprimer un eleve
export const supprimerNotification = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('eleves supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de  notification :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };
