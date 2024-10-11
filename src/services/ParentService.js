

import { apiUrl } from '@/config/apiConfig'; // Importation de l'URL de l'API
import axios from 'axios'; // Importation de la bibliothèque axios

export const getNombreEnfant = async (parentId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/parents/${parentId}/nombre-eleves`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Extraire et retourner le nombre d'élèves du parent
      return response.data.parent.nombre_eleves; 
    } catch (error) {
      console.error('Erreur:', error);
      return 0; // Retourne 0 en cas d'erreur
    }
  };
  
  