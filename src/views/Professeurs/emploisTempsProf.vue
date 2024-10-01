<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
      <matrice :horaires="horaires" :data="donnees" :jours="joursDeLaSemaine" />
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import matrice from '@/components/matrice.vue';
import { profile } from '@/services/AuthService';
import { geHoraireProf } from '@/services/HoraireService'; // Importer le service pour récupérer les horaires

const horaires = ref([
  { temps: '08:00 - 10:00' },
  { temps: '10:15 - 12:00' },
  { temps: '12:15 - 14:00' },
  { temps: '14:15 - 16:00' },
  { temps: '16:15 - 18:00' }
]);

const joursDeLaSemaine = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
const professeurId = ref('');
const donnees = ref([[], [], [], [], []]); // Initialisation vide pour les données dynamiques

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    // Récupérer l'ID du professeur connecté
    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
      await fetchHoraires(professeurId.value); // Appel pour récupérer les horaires après avoir obtenu l'ID
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Fonction pour récupérer les horaires du professeur
const fetchHoraires = async (professeurId) => {
  try {
    const response = await geHoraireProf(professeurId);
    const horairesProf = response.données;

    // Transformation des données pour correspondre au format attendu
    const donneesTemp = [[], [], [], [], []]; // Réinitialisation du tableau

    horairesProf.forEach(horaire => {
      const jourIndex = joursDeLaSemaine.value.indexOf(horaire.jour.trim()); // Supprime les espaces
      const tempsIndex = horaires.value.findIndex(h => h.temps === `${horaire.heure_debut.slice(0, 5)} - ${horaire.heure_fin.slice(0, 5)}`);

      // Ajout de log pour déboguer
      console.log(`Horaire: ${horaire.nom_matiere}, Jour: ${horaire.jour}, Heure: ${horaire.heure_debut.slice(0, 5)} - ${horaire.heure_fin.slice(0, 5)}`);
      console.log(`JourIndex: ${jourIndex}, TempsIndex: ${tempsIndex}`);

      if (jourIndex !== -1 && tempsIndex !== -1) {
        if (!donneesTemp[tempsIndex][jourIndex]) {
          donneesTemp[tempsIndex][jourIndex] = [];
        }
        donneesTemp[tempsIndex][jourIndex].push({
          id: horaire.id,
          Matiere: horaire.nom_matiere,
          classe: horaire.classe
        });
      } else {
        console.warn(`L'horaire ${horaire.nom_matiere} n'a pas pu être placé correctement.`);
      }
    });

    console.log('Données finales pour la matrice:', donneesTemp);
    donnees.value = donneesTemp; // Mettre à jour la matrice avec les nouvelles données
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires:', error);
  }
};

onMounted(async () => {
  await fetchProfile();
});
</script>
  
  
  <style scoped>
  .main-content {
    margin-top: 120px;
  }
  
  
  </style>