import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios


export const getNoteClasse = async (classeProf_id) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/notes/matiere/${classeProf_id}`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      console.log('Données reçues Notes:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data; // Assurez-vous de retourner la réponse complète
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};

