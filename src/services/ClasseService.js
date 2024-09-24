// services/classeService.js

const apiUrl = 'http://127.0.0.1:8000/api'; 

export const getClassesCount = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token
    console.log('Token récupéré :', token);
    const response = await fetch(`${apiUrl}/nombre-classes`,{ 
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête
        }
      });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du nombre de classes');
    }
    const data = await response.json();
    console.log('Données reçues' , data);
    return data.nombreClasses; // Assurez-vous que votre API renvoie { count: <nombre de classes> }
  } catch (error) {
    console.error('Erreur:', error);
    return 0; // Valeur par défaut en cas d'erreur
  }
};
