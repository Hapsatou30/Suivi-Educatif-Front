import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const ajouterProfMatiere = async (profmat) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/professeur-matieres`, profmat, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Afficher les données reçues pour le débogage
    console.log('Données reçues :', response.data);

    // Vérifiez si la réponse inclut un champ "success"
    if (response.data && response.data.success) {
      return response.data; // Retourner l'objet entier si succès
    } else {
      // Si la réponse ne contient pas de succès, renvoyez un objet avec success à false
      return { success: false, message: response.data.message || 'Une erreur est survenue.' };
    }
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, message: 'Erreur lors de l\'ajout des matières.' }; // Retourner une structure d'erreur
  }
};


  export const getProfMatiere = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
  
      // Récupération  des professeurs  avec leur matiere 
      const response = await axios.get(`${apiUrl}/professeur-matieres`, { 
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

  export const getMatProf = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
  
      // Récupération  des professeurs  avec leur matiere 
      const response = await axios.get(`${apiUrl}/prof-matieres`, { 
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
  