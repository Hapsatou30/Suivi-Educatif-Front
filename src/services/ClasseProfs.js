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
    if (response.data && response.data) {
      return response.data; // Retourner l'objet entier si succès
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
      const response = await axios.get(`${apiUrl}/classes-professeurs/${classeId}`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      console.log('Données reçues prof classe:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data; // Assurez-vous de retourner la réponse complète
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};


export const getNbrClasseProf = async (professeurId) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/professeurs/${professeurId}/classes`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      console.log('Données reçues prof classe:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data.données; // Assurez-vous de retourner la réponse complète
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};
