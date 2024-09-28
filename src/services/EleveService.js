

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getElevesCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);
    
    // Récupération du nombre total d'élèves en utilisant axios.get
    const response = await axios.get(`${apiUrl}/total-eleves`, { 
      headers: {
        // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API

    return response.data.total; // Retourner le nombre total d'élèves
  } catch (error) {
    // Gérer les erreurs lors de la récupération du nombre d'élèves
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};


export const getEleves = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/listeleves`, { 
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

export const ajouterEleve = async (eleve) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.post(`${apiUrl}/eleves`, eleve, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher la réponse pour le débogage
    console.log('eleve ajouté :', response.data);
    return response.data; // Renvoie toute la réponse pour analyse
  } catch (error) {
    if (error.response) {
      console.error('Erreur de réponse du backend :', error.response.data);
    } else if (error.request) {
      console.error('Aucune réponse reçue :', error.request);
    } else {
      console.error('Erreur dans la configuration de la requête :', error.message);
    }
    return null;
  }
  
};


export const modifierEleve = async (eleve) => {
  try {
      console.log('eleve avant modification:', eleve); // Pour débogage
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.put(`${apiUrl}/eleves/${eleve}`, eleve, {
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      console.log('eleve modifié :', response.data);
      return response.data; // Renvoie les données de la réponse pour analyse
  } catch (error) {
      console.error('Erreur lors de la modification de l\'eleve :', error.response ? error.response.data : error.message);
      return null; // Valeur par défaut en cas d'erreur
  }
};

