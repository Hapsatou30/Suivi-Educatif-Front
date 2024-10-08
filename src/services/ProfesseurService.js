

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getProfesseursCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/total-professeurs`, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API

    return response.data.total; // Retourner le nombre total de professeurs
  } catch (error) {
    // Gérer les erreurs lors de la récupération du nombre de professeurs
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};

export const getProfesseurs = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/professeurs`, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    //  console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API

    return response.data.données; // Retourner le nombre total de professeurs
  } catch (error) {
    // Gérer les erreurs lors de la récupération du nombre de professeurs
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};
// Méthode pour récupérer les détails d'un professeur par son ID
export const getProfesseurDetails = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/professeur/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Détails du professeur récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du professeur
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du professeur :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};

export const ajouterProfesseur = async (professeur) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.post(`${apiUrl}/professeurs`, professeur, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher la réponse pour le débogage
    // console.log('Professeur ajouté :', response.data);
    return response.data; // Renvoie toute la réponse pour analyse
  } catch (error) {
    console.error('Erreur lors de l\'ajout du professeur :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};

export const modifierProfesseur = async (professeur) => {
  try {
    const token = localStorage.getItem('token');
    // console.log('Envoi des données au serveur :', professeur); 
    
    const response = await axios.post(`${apiUrl}/professeur/${professeur.id}`, professeur, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // console.log('Professeur modifié :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la modification du professeur :', error.response ? error.response.data : error.message);

    if (error.response && error.response.data.errors) {
      // Afficher les erreurs spécifiques de validation
      console.error('Détails des erreurs:', error.response.data.errors);
    }
    
    return null;
  }
};


// Méthode pour supprimer uneprofesseur
export const supprimerProfesseur = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.delete(`${apiUrl}/professeur/${id}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // console.log('professeurs supprimée :', response.data);
    return response.data; // Renvoie les données de réponse
  } catch (error) {
    console.error('Erreur lors de la suppression du professeurs :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};


