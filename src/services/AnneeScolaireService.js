// services/AnneeScolaireService.js

const apiUrl = 'http://127.0.0.1:8000/api';

export const AnneeScolaireService = {
  // Méthode pour récupérer l'année scolaire en cours
  async getAnneeEnCours() {
    try {
      const token = localStorage.getItem('token'); // Récupérer le token
      console.log('Token récupéré :', token); // Vérifie que le token est bien récupéré
      
      // Récupération des années scolaires
      const response = await fetch(`${apiUrl}/annees-scolaires`, {
        headers: {
          Authorization: `Bearer ${token}` // Utiliser le token dans l'en-tête
        }
      });

      // Vérifiez si la réponse est OK
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des années scolaires');
      }
      
      const data = await response.json(); // Convertir la réponse en JSON
      console.log('Réponse de l\'API :', data); // Vérifie la réponse de l'API

      // Filtrer pour trouver l'année qui est en cours
      const anneeEnCours = data.données.find(annee => annee.etat === 'En_cours'); // Changez 'etat' si nécessaire
      console.log('Année en cours:', anneeEnCours);
      return anneeEnCours; // Retourner l'année scolaire en cours
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'année scolaire en cours', error);
      throw error; // Relancer l'erreur pour la gérer au niveau supérieur
    }
  }
};
