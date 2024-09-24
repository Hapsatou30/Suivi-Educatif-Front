

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
