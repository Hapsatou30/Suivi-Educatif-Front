import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getMatieres = async () => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
  
      // Récupération du nombre total de professeurs en utilisant axios.get
      const response = await axios.get(`${apiUrl}/matieres`, { 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher les données reçues pour le débogage
       console.log('Données reçues :', response.data); // Vérifie les données reçues de l'API
  
      return response.data; // Retourner le nombre total de professeurs
    } catch (error) {
      // Gérer les erreurs lors de la récupération du nombre de professeurs
      console.error('Erreur:', error);
      return 0; // Valeur par défaut en cas d'erreur
    }
  };

  export const ajouterMatiere = async (matiere) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.post(`${apiUrl}/matieres`, matiere, { 
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

  export const modifierMatiere = async (nouvellesDonnees) => {
    try {
      const idValue = nouvellesDonnees.id; // Récupérer l'ID directement des nouvelles données
      // console.log('ID de l\'année à modifier :', idValue); // Vérification de l'ID
      // console.log('Nouvelles données :', nouvellesDonnees); // Vérification des nouvelles données
  
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.put(`${apiUrl}/matieres/${idValue}`, {
        nom: nouvellesDonnees.nom,
        coefficient: nouvellesDonnees.coefficient,
        description: nouvellesDonnees.description
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Matiere modifiée :', response.data);
      return response.data; // Renvoie les nouvelles données
    } catch (error) {
      console.error('Erreur lors de la modification de la Matiere :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };
  
  // Méthode pour supprimer une Matiere 
  export const supprimerMatiere = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/matieres/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      console.log('Matiere supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de la matiere :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };
  
  export const getNbrMatiere = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      // console.log('Token récupéré :', token);
  
      // Récupération du nombre total de professeurs en utilisant axios.get
      const response = await axios.get(`${apiUrl}/professeur/${id}/nombre-matieres`, { 
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
