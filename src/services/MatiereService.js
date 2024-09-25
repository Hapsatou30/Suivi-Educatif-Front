import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getMatieres = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
  
      // Récupération du nombre total de professeurs en utilisant axios.get
      const response = await axios.get(`${apiUrl}/matieres`, { 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher les données reçues pour le débogage
       console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API
  
      return response.data.données; // Retourner le nombre total de professeurs
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre de professeurs
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const ajouterMatiere = async (matiere) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.post(`${apiUrl}/matieres`, matiere, { 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher la réponse pour le débogage
      console.log('matiere ajouté :', response.data);
      return response.data; // Renvoie toute la réponse pour analyse
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la matiere :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };