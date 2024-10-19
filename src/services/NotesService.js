import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios


export const getNoteClasse = async (classeProf_id) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/notes/classe/${classeProf_id}`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      // console.log('Données reçues Notes:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data; // Assurez-vous de retourner la réponse complète
  } catch (error) {
      // Gérer les erreurs lors de la récupération des professeurs
      console.error('Erreur:', error);
      return null; // Valeur par défaut en cas d'erreur
  }
};
export const getNoteEleve = async (classeEleve_id) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/eleves/${classeEleve_id}/notes`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      //  console.log('Données reçues Notes:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data; // Assurez-vous de retourner la réponse complète
  } catch (error) {
    if (error.response) {
        // La réponse a été reçue mais le serveur a retourné un code d'erreur (ex. 400, 401, etc.)
        console.error('Erreur de réponse:', error.response.data);
    } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Erreur de requête:', error.request);
    } else {
        // Erreur lors de la configuration de la requête
        console.error('Erreur de configuration:', error.message);
    }
}

};

export const getNoteElevesParent = async (parentId) => {
  try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

      // Récupération des professeurs avec leur matière en utilisant le classeId
      const response = await axios.get(`${apiUrl}/parents/${parentId}/notes`, { 
          headers: {
              Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
          }
      });

      // Afficher les données reçues pour le débogage
      //  console.log('Données reçues Notes:', response.data); // Vérifie les données reçues de l'API

      // Retourner l'objet complet
      return response.data; // Assurez-vous de retourner la réponse complète
  } catch (error) {
    if (error.response) {
        // La réponse a été reçue mais le serveur a retourné un code d'erreur (ex. 400, 401, etc.)
        console.error('Erreur de réponse:', error.response.data);
    } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error('Erreur de requête:', error.request);
    } else {
        // Erreur lors de la configuration de la requête
        console.error('Erreur de configuration:', error.message);
    }
}

};
export const supprimerNote = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.delete(`${apiUrl}/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // console.log('note supprimée :', response.data);
      return response.data; // Renvoie les données de réponse
    } catch (error) {
      console.error('Erreur lors de la suppression de la note :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };

  export const ajouterNote = async (note) => {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
      const response = await axios.post(`${apiUrl}/notes`, note, { 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
        }
      });
  
      // Afficher la réponse pour le débogage
      // console.log('note ajouté :', response.data);
      return response.data; // Renvoie toute la réponse pour analyse
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la note :', error);
      return null; // Valeur par défaut en cas d'erreur
    }
  };

  export const modifierNote = async (note) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.put(`${apiUrl}/notes/${note.id}`, note, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Assurez-vous de vérifier la structure de la réponse
        console.log('Réponse de l\'API:', response.data); // Ajoutez ce log pour voir la réponse

        // Vérifiez le statut renvoyé par l'API
        if (response.data.status && response.data.status === 400) {
            throw new Error(response.data.message);
        }

        return response.data;

    } catch (error) {
        console.error('Erreur lors de la modification de la note :', error.response ? error.response.data : error.message);
        throw error;
    }
};
