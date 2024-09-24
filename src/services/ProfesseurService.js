// services/professeurService.js

const apiUrl = 'http://127.0.0.1:8000/api'; 

export const getProfesseursCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token
    console.log('Token récupéré :', token);
    const response = await fetch(`${apiUrl}/total-professeurs`,{ 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête
        }
      });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du nombre de professeurs');
    }
    const data = await response.json();
    return data.total; 
  } catch (error) {
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};
