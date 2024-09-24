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
