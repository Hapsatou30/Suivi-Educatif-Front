<template>
    <sideBarEleve />
    <topBarEleve />
    <div class="main-content">
       <div class="head">
        <h1 style="text-align: center; ">L'emplois du temps de la classe </h1>
       </div>
       <div class="emplois">
            <matrice :horaires="horaires" :data="donnees" :jours="joursDeLaSemaine" :classeColors="classeColors" :isMatiere="true" />
        </div>
    </div>
</template>

<script setup>
  import sideBarEleve from '@/components/sideBarEleve.vue';
  import topBarEleve from '@/components/topBarEleve.vue';
import { ref, onMounted } from 'vue';
import { getDetailsEleve } from '@/services/EleveService';
 
import matrice from '@/components/matrice.vue';
import { geHoraireClasse } from '@/services/HoraireService'; 


const classeEleve_id = ref ([]);
const prenom = ref(''); 
const anneeClasse_id = ref('');
// Données pour l'affichage
const horaires = ref([
  { temps: '08:00 - 10:00' },
  { temps: '10:15 - 12:00' },
  { temps: '12:15 - 14:00' },
  { temps: '14:15 - 16:00' },
  { temps: '16:15 - 18:00' }
]);
const joursDeLaSemaine = ref(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
const donnees = ref([[], [], [], [], []]); // Initialisation vide pour les données dynamiques

// Objet pour stocker les couleurs associées à chaque classe
const classeColors = ref({});

// Fonction pour générer une couleur aléatoire
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getMatiereColor = (matiere) => {
  const colorsFromStorage = JSON.parse(localStorage.getItem('classeColors')) || {};

  if (colorsFromStorage[matiere]) {
    console.log(`Couleur existante pour ${matiere}: ${colorsFromStorage[matiere]}`);
    return colorsFromStorage[matiere];
  }

  const newColor = getRandomColor();
  colorsFromStorage[matiere] = newColor;
  localStorage.setItem('classeColors', JSON.stringify(colorsFromStorage));

  console.log(`Nouvelle couleur générée pour ${matiere}: ${newColor}`);
  return newColor;
};


// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
    try {
      const response = await getDetailsEleve();
      
      if (response.status === 200) {
        classeEleve_id.value = response.données.classeEleve_id;
        anneeClasse_id.value = response.données.anneeClasse_id;
        //  console.log('classeEleve_id', classeEleve_id.value);
        await fetchHoraires(anneeClasse_id.value); 
        
      } else {
        console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    }
  };


// Fonction pour récupérer les horaires d'une classe
const fetchHoraires = async (anneeClasse_id) => {
  try {
    const response = await geHoraireClasse(anneeClasse_id);
    const horaireEnfant = response.données; 

    // Réinitialisation du tableau temporaire pour stocker les données selon les jours et les horaires
    const donneesTemp = [[], [], [], [], []]; 

    // Boucle à travers chaque horaire récupéré
    horaireEnfant.forEach(horaire => {
      // Si l'horaire est manquant ou non rempli, afficher un avertissement et ignorer cet horaire
      if (!horaire.horaire || horaire.horaire === "Pas encore rempli") {
        // console.warn(`L'horaire pour la matière ${horaire.matiere} n'est pas rempli.`);
        return; 
      }

      // Séparer les heures de début et de fin à partir de la chaîne d'horaire
      const [heureDebut, heureFin] = horaire.horaire.split(' - ');

      // Si les heures de début et de fin existent
      if (heureDebut && heureFin) {
        // Trouver l'index correspondant au jour dans le tableau des jours de la semaine
        const jourIndex = joursDeLaSemaine.value.indexOf(horaire.jour.trim()); 

        // Trouver l'index correspondant à la plage horaire (ex: "08:00 - 10:00") dans le tableau des horaires
        const tempsIndex = horaires.value.findIndex(h => h.temps === `${heureDebut.slice(0, 5)} - ${heureFin.slice(0, 5)}`);

        // Si le jour et la plage horaire sont trouvés dans les tableaux respectifs
        if (jourIndex !== -1 && tempsIndex !== -1) {
          // Si la cellule correspondante dans la matrice est vide, on initialise un tableau vide
          if (!donneesTemp[tempsIndex][jourIndex]) {
            donneesTemp[tempsIndex][jourIndex] = [];
          }

          // Récupération de la classe associée à cet horaire
          const matiere = horaire.matiere;

          // Associer une couleur à la matiere 
          const color = getMatiereColor(matiere);
          classeColors.value[matiere] = color; // Stocker la couleur associée à la matiere

          // Ajouter les informations sur l'horaire dans la cellule correspondante du tableau
          donneesTemp[tempsIndex][jourIndex].push({
            id: horaire.horaire_id, // ID de l'horaire
            Matiere: horaire.matiere,
            classe:horaire.nom_classe ,
            professeur: horaire.professeur
          });
        } else {
          // Si l'horaire n'a pas pu être placé correctement (jour ou plage horaire introuvable)
          console.warn(`L'horaire pour la matière ${horaire.matiere} n'a pas pu être placé correctement.`);
        }
      } else {
        // Si le format d'horaire est incorrect (absence d'heure de début ou de fin)
        console.warn(`Format d'horaire incorrect pour la matière ${horaire.matiere}.`);
      }
    });

    // Mettre à jour le tableau principal avec les nouvelles données organisées
    donnees.value = donneesTemp; 
  } catch (error) {
    // Gestion des erreurs lors de la récupération des données depuis l'API
    console.error('Erreur lors de la récupération des horaires:', error);
  }
};



onMounted(() => {
    fetchDetailsEleve();  
     
});
</script>



<style scoped>
.main-content {
    overflow-x: hidden;
}
.head h1{
    text-align: center;
    margin-left: 10%;
    margin-bottom: 50px;
    
 }

.emplois {
    margin-left: 16%;
}
@media (max-width: 992px) {
   .main-content {
    margin-top: 10%;
    width: 95%;
    margin-left: auto !important;
    margin-right: auto !important;
}

.head h1{
    margin-left: 35%;
    
 }
 .head h1{
    font-size: 24px;
    margin-top: 25px;
    text-align: center;
}
.retour {
    
    margin-left: 0;
}
.emplois {
    margin-left: 0%;
    margin-top: 50px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-top: 15%;
    width: 95%;
    margin-left: auto !important;
    margin-right: auto !important;
}
}
@media (max-width: 567px) {
    .main-content{
      margin-top: 20%;
      width: 90%;
      margin-right: auto;
      margin-left: auto;
    }
  


 .head h1{
    font-size: 18px;
    margin-top: 25px;
    text-align: justify;
   
 }
 .emplois{
  margin-left: 0%;
  
 }
}
@media (max-width: 390px) {
  .main-content{
      margin-top: 30%;
      width: 85%;
      margin-right: auto;
      margin-left: auto;
    }
  
}
@media (max-width: 360px) {
  .main-content{
      margin-top: 40%;
      width: 80%;
      margin-right: auto;
      margin-left: auto;
    }
  
}

</style>
