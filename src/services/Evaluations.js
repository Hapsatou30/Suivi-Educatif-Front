
import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getEvaluationsJour = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations-jour`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data.données;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const getEvaluationsParProf = async (professeurId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations/professeur/${professeurId}`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };


  export const getEvaluations = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const supprimerEvaluation = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/evaluations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Evaluation supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'évaluation :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };