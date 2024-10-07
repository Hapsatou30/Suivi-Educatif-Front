
import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getEvaluationsJour = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations-jour`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data.données;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const getEvaluationsParProf = async (professeurId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations/professeur/${professeurId}`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const getEvaluationsParClasseProf = async (classeProfId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations/classe/${classeProfId}`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };
  export const getEvaluationsParAnneeClasse = async (anneeClasseId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations/anneeClasse/${anneeClasseId}`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const getEvaluationsParParent = async (parentId) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations/eleves/${parentId}`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };
  export const getEvaluations = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
      
      // Récupération du nombre total d'élèves en utilisant axios.get
      const response = await axios.get(`${apiUrl}/evaluations`, { 
        headers: {
          // 'Content-Type': 'application/json', // Indiquer le type de contenu de la requête
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Données reçues :', response.data); // Vérifie les données reçues
      return response.data;
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre d'élèves
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const supprimerEvaluation = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/evaluations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('Evaluation supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'évaluation :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };

  export const ajouterEvaluation = async (evaluation) => {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.post(`${apiUrl}/evaluations`, evaluation, { 
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        // Si le statut de la réponse est 400, lancer une erreur personnalisée
        if (response.data.status && response.data.status === 400) {
            throw new Error(response.data.message); // Forcer l'erreur
        }

        // console.log('Évaluation ajoutée :', response.data);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'évaluation :', error.message);
        throw error; // Relancer l'erreur pour que SweetAlert puisse l'attraper
    }
};

export const modifierEvaluation = async (evaluation) => {
  try {
      const token = localStorage.getItem('token');
      // console.log('Envoi des données au serveur :', evaluation); 
      
      const response = await axios.put(`${apiUrl}/evaluations/${evaluation.id}`, evaluation, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
      // Si le statut de la réponse est 400, lancer une erreur personnalisée
      if (response.data.status && response.data.status === 400) {
          throw new Error(response.data.message); // Forcer l'erreur
      }

      // console.log('Évaluation modifiée :', response.data);
      return response.data;
  } catch (error) {
      console.error('Erreur lors de la modification de l\'évaluation :', error.message);
      throw error; // Relancer l'erreur pour que SweetAlert puisse l'attraper
  }
};

