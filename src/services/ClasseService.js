

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getClassesCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de classes en utilisant axios.get
    const response = await axios.get(`${apiUrl}/nombre-classes`, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API

    return response.data.nombreClasses; // Retourner le nombre total de classes
  } catch (error) {
    // Gérer les erreurs lors de la récupération du nombre de classes
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};

export const getClasses = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de professeurs en utilisant axios.get
    const response = await axios.get(`${apiUrl}/classes`, { 
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



export const ajouterClasse = async (classe) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.post(`${apiUrl}/classes`, classe, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher la réponse pour le débogage
    console.log('matiere ajouté :', response.data);
    return response.data; // Renvoie toute la réponse pour analyse
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la matiere :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};
export const modifierClasse = async (nouvellesDonnees) => {
  try {
    const idValue = nouvellesDonnees.id; // Récupérer l'ID directement des nouvelles données
    // console.log('ID de l\'année à modifier :', idValue); // Vérification de l'ID
    // console.log('Nouvelles données :', nouvellesDonnees); // Vérification des nouvelles données

    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.put(`${apiUrl}/classes/${idValue}`, {
      nom: nouvellesDonnees.nom,
      niveau: nouvellesDonnees.niveau,
      capacite: nouvellesDonnees.capacite
    }, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    console.log('Classe modifiée :', response.data);
    return response.data; // Renvoie les nouvelles données
  } catch (error) {
    console.error('Erreur lors de la modification de la classe :', error.response.data);
    return null; // Valeur par défaut en cas d'erreur
  }
  
};

// Méthode pour supprimer une année scolaire
export const supprimerClasse = async (id) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.delete(`${apiUrl}/classes/${id}`, {
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
