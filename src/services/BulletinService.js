import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const creerBulletinsPourTousLesEleves = async (bulletins) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${apiUrl}/creer-bulletins`, bulletins, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Afficher les données reçues pour le débogage
    // console.log('Données reçues :', response.data);

    // Vérifiez si la réponse inclut un champ "success"
    if (response.data ) {
      return response.data; // Retourner l'objet entier si succès
    }
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, message: 'Erreur lors de l\'ajout des classes.' }; // Retourner une structure d'erreur
  }
};


