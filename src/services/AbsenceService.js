

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios


export const postAbsences = async (absence) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    // console.log('Token récupéré :', token);

    // Récupération du nombre total de annees-scolaires en utilisant axios.get
    const response = await axios.post(`${apiUrl}/absences`, absence, { 
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    //  console.log('ajouter :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner le nombre total de annees-scolairess
  } catch (error) {
    if (error.response) {
      // Afficher les erreurs de validation reçues du serveur
      console.error('Erreur de validation:', error.response.data);
    } else {
      // Autre type d'erreur (comme une erreur réseau)
      console.error('Erreur:', error.message);
    }
  }
  
};

// Méthode pour supprimer une  absence
export const supprimerAbsence = async (absenceId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.delete(`${apiUrl}/absences/${absenceId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // console.log('absence supprimée :', response.data);
    return response.data; // Renvoie les données de réponse
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};

// Méthode pour récupérer les détails d'un professeur par son ID
export const getAbsenceClasseProf = async (classProfId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/absences/${classProfId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Détails du absence récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du annees-scolaires
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};
// Méthode pour récupérer les détails d'un professeur par son ID
export const getAbsenceAnneeClasse = async (anneeClasseId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/absences/annee-classe/${anneeClasseId}`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Détails du absence récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du annees-scolaires
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};

export const getAbsenceParents = async (parentId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/parents/${parentId}/absences`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Détails du absence récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du annees-scolaires
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};
export const getAbsencesEleve = async (classeEleveId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/classe-eleve/${classeEleveId}/absences`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    //  console.log('Détails du absence récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du annees-scolaires
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};

export const modifierAbsence = async (id, formData) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // Assurez-vous que l'ID est correctement référencé ici
      const response = await axios.post(`${apiUrl}/absences/${id}`,formData, {
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

       console.log('absences :', response.data);
      return response.data; // Renvoie les données de la réponse pour analyse
  } catch (error) {
      console.error('Erreur lors de la modification de l\'absence :', error.response ? error.response.data : error.message);
      return { error: error.response ? error.response.data.error : error.message }; // Renvoie l'erreur sous forme d'objet
  }
};

export const getAbsencesSemaine = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
    const response = await axios.get(`${apiUrl}/absences/toutes`, {
      headers: {
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
      }
    });

    // Afficher les données reçues pour le débogage
    //  console.log('Détails du absence récupérés :', response.data); // Vérifie les données reçues de l'API

    return response.data; // Retourner les détails du annees-scolaires
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du absence :', error);
    return null; // Valeur par défaut en cas d'erreur
  }
};