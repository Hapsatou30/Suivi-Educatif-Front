import axios from 'axios';

const apiUrl = 'http://localhost:8000/api';

export const AuthService = {
    
      // Méthode de connexion
  async login(email, password) {
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email,
        password
      });

      // Si la connexion réussit, on retourne la réponse
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de connexion', error);
      throw error;
    }
  },

  // Méthode de déconnexion
  async logout() {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const response = await axios.get(
          `${apiUrl}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}` // Authentification avec le token JWT
            }
          }
        );
        
        // Suppression du token du localStorage après la déconnexion
        localStorage.removeItem('token');
        return response.data;
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de déconnexion', error);
      throw error;
    }
  },

  // Méthode pour rafraîchir le token
  async refreshToken() {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        const response = await axios.get(
          `${apiUrl}/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Mise à jour du token dans le localStorage
        if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token);
          return response.data.token;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de rafraîchir le token', error);
      throw error;
    }
  }
};