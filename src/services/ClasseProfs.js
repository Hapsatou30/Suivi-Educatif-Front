import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const ajouterProfClasse = async (classeprof) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/classes-professeurs`, classeprof, {
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
    return { success: false, message: 'Erreur lors de l\'ajout des profs.' }; // Retourner une structure d'erreur
  }
};
export const getProfClasse = async (classeId) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/classes-professeurs?annee_classe_id=${classeId}`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      console.log('Données reçues prof classe:', response.data); // Vérifie les données reçues de l'API

      return response.data; // Retourner les données de l'API
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};
