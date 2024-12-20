import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const geHoraireClasse = async (anneeClasseId) => {
    try {
        if (!anneeClasseId) {
            console.error('L\'ID de la classe est manquant');
            return; // Sortir de la fonction si l'ID est absent
        }

        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

        // Récupération du nombre total de professeurs en utilisant axios.get
        const response = await axios.get(`${apiUrl}/annee_classe/${anneeClasseId}/horaires`, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        //  console.log('Données reçues depuis l\'API:', response.data.données); 
        return response.data; // Retourner le nombre total de professeurs
    } catch (error) {
        // Gérer les erreurs lors de la récupération du nombre de professeurs
        console.error('Erreur:', error);
        return 0; // Valeur par défaut en cas d'erreur
    }
};

export const modifierHoraire = async (horaire) => {
    try {
        // console.log('Horaire avant modification:', horaire); // Pour débogage
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
        const response = await axios.put(`${apiUrl}/horaires/${horaire.horaire_id}`, horaire, {
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });
  
        // Afficher la réponse pour le débogage
        return response.data; // Renvoie toute la réponse pour analyse
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'horaire :', error.response ? error.response.data : error.message);
        
        // Vérifier si l'erreur a une structure spécifique pour les erreurs 422
        if (error.response && error.response.status === 422) {
            // Retourner le message d'erreur général et les détails spécifiques
            return { 
                message: error.response.data.message,
                errors: error.response.data.errors
            };
        }

        // Retourner une erreur générique pour les autres types d'erreurs
        return { error: error.response ? error.response.data.error : 'Une erreur est survenue.' };
    }
};
  

  export const ajouterHoraire = async (horaire) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
        const response = await axios.post(`${apiUrl}/horaires`, horaire, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        // Afficher la réponse pour le débogage
        return response.data; // Renvoie toute la réponse pour analyse
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'horaire :', error.response ? error.response.data : error.message);
        
        // Vérifier si l'erreur a une structure spécifique pour les erreurs 422
        if (error.response && error.response.status === 422) {
            // Retourner le message d'erreur général et les détails spécifiques
            return { 
                message: error.response.data.message,
                errors: error.response.data.errors
            };
        }

        // Retourner une erreur générique pour les autres types d'erreurs
        return { error: error.response ? error.response.data.error : 'Une erreur est survenue.' };
    }
};



// Méthode pour supprimer un horaire
export const supprimerHoraire = async (id) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local
        const response = await axios.delete(`${apiUrl}/horaires/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        // console.log('Horaire supprimé :', response.data);
        return response.data; // Renvoie les données de réponse
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'horaire :', error);
        return null; // Valeur par défaut en cas d'erreur
    }
};

export const geHoraireProf = async (professeurId) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

        // Récupération du nombre total de professeurs en utilisant axios.get
        const response = await axios.get(`${apiUrl}/professeur/${professeurId}/horaires`, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        // console.log('Données reçues depuis l\'API:', response.data.données); 
        return response.data; // Retourner le nombre total de professeurs
    } catch (error) {
        // Gérer les erreurs lors de la récupération du nombre de professeurs
        console.error('Erreur:', error);
        return 0; // Valeur par défaut en cas d'erreur
    }
};
