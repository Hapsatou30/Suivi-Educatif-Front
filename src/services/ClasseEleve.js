import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const ajouterEleveClasse = async (classeEleve) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/classes-eleves`, classeEleve, {
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
    return { success: false, message: 'Erreur lors de l\'ajout des eleve.' }; // Retourner une structure d'erreur
  }
};

export const getEleveClasse = async (classeId) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/classes-eleves/${classeId}`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
              
          }
      });

      // Afficher les données reçues pour le débogage
      console.log('Données reçues eleve classe:', response.data); // Vérifie les données reçues de l'API

      return response.data; // Retourner les données de l'API
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};
export const getClasseEleve = async (eleveId) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
  
       
        const response = await axios.get(`${apiUrl}/classes-eleves?eleve_id=${eleveId}`, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });
  
        // Afficher les données reçues pour le débogage
        console.log('Données reçues eleve classe:', response.data); // Vérifie les données reçues de l'API
  
        return response.data; // Retourner les données de l'API
    } catch (error) {
        // Gérer les erreurs lors de la récupération des professeurs
        console.error('Erreur:', error);
        return null; // Valeur par défaut en cas d'erreur
    }
  };
