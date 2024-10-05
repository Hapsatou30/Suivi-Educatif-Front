import axios from 'axios'; // Importation de la bibliothèque axios pour effectuer des requêtes HTTP
import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API à partir du fichier de configuration

// Méthode de connexion
export const login = async (email, password) => {
  try {
    // Envoi d'une requête POST à l'API pour se connecter avec les informations fournies (email et mot de passe)
    const response = await axios.post(`${apiUrl}/login`, { email, password });
    
    // Vérification si la réponse de l'API contient des données
    if (response.data) {
      return response.data; // Si la connexion réussit, retourne les données reçues
    }
  } catch (error) {
    // Gestion des erreurs potentielles lors de la connexion
    console.error('Erreur lors de la tentative de connexion', error); // Affiche un message d'erreur dans la console pour le débogage
    throw error; // Relève l'erreur pour permettre à l'appelant de gérer cette erreur
  }
};

// Méthode de déconnexion
export const logout = async () => {
  try {
    // Récupération du token JWT depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Vérification si le token existe
    if (token) {
      // Envoi d'une requête GET à l'API pour se déconnecter
      const response = await axios.get(`${apiUrl}/logout`, {
        headers: {
          Authorization: `Bearer ${token}` // Authentification avec le token JWT
        }
      });
      
      // Suppression du token du localStorage après la déconnexion
      localStorage.removeItem('token');
      return response.data; // Retourne les données de réponse de l'API
    }
  } catch (error) {
    // Gestion des erreurs potentielles lors de la déconnexion
    console.error('Erreur lors de la tentative de déconnexion', error); // Affiche un message d'erreur dans la console pour le débogage
    throw error; // Relève l'erreur pour permettre à l'appelant de gérer cette erreur
  }
};

// Méthode pour rafraîchir le token
export const refreshToken = async () => {
  try {
    // Récupération du token JWT depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Vérification si le token existe
    if (token) {
      // Envoi d'une requête GET à l'API pour rafraîchir le token
      const response = await axios.get(`${apiUrl}/refresh`, {
        headers: {
          Authorization: `Bearer ${token}` // Authentification avec le token JWT
        }
      });
      
      // Vérification si la réponse de l'API contient un nouveau token
      if (response.data && response.data.token) {
        // Mise à jour du token dans le localStorage
        localStorage.setItem('token', response.data.token);
        return response.data.token; // Retourne le nouveau token
      }
    }
  } catch (error) {
    // Gestion des erreurs potentielles lors du rafraîchissement du token
    console.error('Erreur lors de la tentative de rafraîchir le token', error); // Affiche un message d'erreur dans la console pour le débogage
    throw error; // Relève l'erreur pour permettre à l'appelant de gérer cette erreur
  }
};

export const profile = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/profile`, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
     console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner le nombre total de professeurs
  } catch (error) {
    // Gérer les erreurs lors de la récupération du nombre de professeurs
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};
export const modifierProfileProfesseur = async (id, formDataToSend) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // Assurez-vous que l'ID est correctement référencé ici
      const response = await axios.post(`${apiUrl}/professeur/${id}`, formDataToSend, {
          headers: {
              Authorization: `Bearer ${token}` ,// Utiliser le token dans l'en-tête pour l'authentification
              "content-type": "multipart/form-data",
          }
      });

      console.log('profil modifié :', response.data);
      return response.data; // Renvoie les données de la réponse pour analyse
  } catch (error) {
      console.error('Erreur lors de la modification du profil :', error.response ? error.response.data : error.message);
      return { error: error.response ? error.response.data.error : error.message }; // Renvoie l'erreur sous forme d'objet
  }
};