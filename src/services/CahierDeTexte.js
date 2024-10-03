import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getCahierTexte = async (anneeClasseId) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

        // Récupération du nombre total de professeurs en utilisant axios.get
        const response = await axios.get(`${apiUrl}/cahiers-texte/classe/${anneeClasseId}`, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        console.log('Données reçues depuis l\'API:', response.data.données); 
        return response.data; // Retourner le nombre total de professeurs
    } catch (error) {
        // Gérer les erreurs lors de la récupération du nombre de professeurs
        console.error('Erreur:', error);
        return 0; // Valeur par défaut en cas d'erreur
    }
};

export const ajouterCahierTexte = async (cahier_texte) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.post(`${apiUrl}/cahiers-texte`, cahier_texte, { 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher la réponse pour le débogage
      console.log('cahier_texte ajouté :', response.data);
      return response.data; // Renvoie toute la réponse pour analyse
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la cahier_texte :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };

  export const modifierCahierTexte = async (cahierTexte) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
        // Assurez-vous que l'ID est correctement référencé ici
        const response = await axios.put(`${apiUrl}/cahiers-texte/${cahierTexte.id}`, cahierTexte, {
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        console.log('Cahier de texte modifié :', response.data);
        return response.data; // Renvoie les données de la réponse pour analyse
    } catch (error) {
        console.error('Erreur lors de la modification du cahier de texte :', error.response ? error.response.data : error.message);
        return { error: error.response ? error.response.data.error : error.message }; // Renvoie l'erreur sous forme d'objet
    }
};

  export const getCahierTexteById = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.get(`${apiUrl}/details-cahiers-texte/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher les données reçues pour le débogage
      console.log('Détails du annees-scolaires récupérés :', response.data); // Vérifie les données reçues de l'API
  
      return response.data; // Retourner les détails du annees-scolaires
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du annees-scolaires :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };
  
  export const supprimerClasse = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/cahiers-texte/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Classe supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de la Classe :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };