

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const AnneeScolaireService = {
  // Méthode pour récupérer l'année scolaire en cours
  async getAnneeEnCours() {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des années scolaires en utilisant axios.get
      const response = await axios.get(`${apiUrl}/annees-scolaires`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });

      // // Afficher la réponse de l'API dans la console
      // console.log('Réponse de l\'API :', response.data); // Vérifie la réponse de l'API

      // Filtrer pour trouver l'année qui est en cours
      const anneeEnCours = response.data.données.find(annee => annee.etat === 'En_cours'); 
      // console.log('Année en cours:', anneeEnCours);
      return anneeEnCours; // Retourner l'année scolaire en cours
    } catch (error) {
      // Gérer les erreurs lors de la récupération de l'année scolaire
      console.error('Erreur lors de la récupération de l\'année scolaire en cours', error);
      throw error; // Relancer l'erreur pour la gérer au niveau supérieur
    }
  }
};
export const getAnnees = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/annees-scolaires`, { 
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


export const ajouterAnnee = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.post(`${apiUrl}/annees-scolaires`, { 
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

