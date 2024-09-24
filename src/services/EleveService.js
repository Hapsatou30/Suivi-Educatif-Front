// services/eleveService.js

const apiUrl = 'http://127.0.0.1:8000/api'; 

export const getElevesCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token
    console.log('Token récupéré :', token);
    
   
    const response = await fetch(`${apiUrl}/total-eleves`, { 
      method: 'GET', // Méthode GET par défaut
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête
      }
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du nombre d\'élèves');
    }

    const data = await response.json();
    console.log('Données reçues :', data); // Affichez les données pour débogage
    return data.total; // Changez cela pour retourner `data.total`
    
  } catch (error) {
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};
