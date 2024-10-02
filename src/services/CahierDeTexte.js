import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getCahierTexte = async (anneeClasseId) => {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token depuis le stockage local

        // Récupération du nombre total de professeurs en utilisant axios.get
        const response = await axios.get(`${apiUrl}/cahiers-texte/classe/${anneeClasseId}`, { 
            headers: {
                Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête pour l'authentification
            }
        });

        console.log('Données reçues depuis l\'API:', response.data.données); 
        return response.data; // Retourner le nombre total de professeurs
    } catch (error) {
        // Gérer les erreurs lors de la récupération du nombre de professeurs
        console.error('Erreur:', error);
        return 0; // Valeur par défaut en cas d'erreur
    }
};
