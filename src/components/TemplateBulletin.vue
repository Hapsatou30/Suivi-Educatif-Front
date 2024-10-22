<template>
  <div>
    <!-- Header avec deux logos et un texte centré -->
    <header class="header ">
      <img src="@/assets/Flag_of_Senegal.svg.png" alt="Logo Gauche" class="logo-left" />
      <div class="header-text">
        <p>République du Sénégal</p>
        <p>Ministère de l'Éducation nationale</p>
        <h3>Les Cours Privés Général Mouhamadou Mansour Seck</h3>
        <h4>ANNÉE SCOLAIRE : {{ anneeScolaire }}</h4>
      </div>
      <img src="@/assets/ministere.png" alt="Logo Droite" class="logo-right" />
    </header>

    <!-- Conteneur pour les deux div alignés -->
    <div class="container-fluid">
      <div class="column">
        <ul>
          <li>Tél: <span>338765678</span></li>
          <li>Email: <span>samaecole@gmail.com</span></li>
          <li>Niveau: <span>{{ niveau }}</span></li>
          <li>Effectif: <span>{{ effectif }}</span></li>
          <li>Moyenne Classe: <span>{{ moyenneClasse }}</span></li>

        </ul>
      </div>

      <div class="column">
        <ul>
          <li>Matricule: <span>{{ matricule }}</span></li>
          <li>Sexe: <span>{{ sexe }}</span></li>
          <li>Classe: <span>{{ classe }}</span></li>
          <li>Prénom & Nom: <span>{{ prenom }} {{ nom }}</span></li>
          <li>Né(e) le: <span>{{ dateNaissance }}</span></li>
        </ul>
      </div>
    </div>

    <div class="titre">
      <h2>Bulletin du 1er Semestre</h2>
    </div>

    <!-- Tableau des matières et des résultats -->
    <table class="bulletin-table">
  <thead>
    <tr>
      <th>Matière</th>
      <th>Devoirs</th> 
      <th>Examen</th>
      <th>Moyenne</th>
      <th>Coef</th>
      <th>Moy*Coef</th>
      <th>Rang</th>
      <th>Appréciations</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="matiere in matieres" :key="matiere.nomMatiere">
      <td>{{ matiere.nomMatiere }}</td>
      <td>{{ matiere.moyenneDevoirs }}</td>
      <td>{{ matiere.noteExamen || '-' }}</td>
      <td>{{ matiere.moyenneMatiere || '-' }}</td>
      <td>{{ matiere.coeff || '-' }}</td>
      <td>{{ (matiere.moyenneMatiere * matiere.coeff).toFixed(2) || '-' }}</td>
      <td>{{ matiere.rang || '-' }}</td>
      <td>{{ getAppreciation(matiere.moyenneMatiere) }}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>Totaux</td>
      <td></td>
      <td></td>
      <td></td>
      <td>{{ totalCoef }}</td>
      <td>{{ totalMoyCoef.toFixed(2) }}</td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
</table>


    <div class="container1">
      <!-- Div de gauche avec le tableau pour les moyennes, rangs et moyennes classe -->
      <div class="column-left">
        <table class="semestre-table">
          <thead>
            <tr>
              <th></th>
              <th>Moyennes</th>
              <th>Rangs</th>
              <th>Moyennes Classe</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1er Semestre</td>
              <td>{{ moyennePremierSemestre.toFixed(2) }}</td>
              <td>---</td>
              <td>---</td>
            </tr>
            <tr>
              <td>2ème Semestre</td>
              <td>---</td>
              <td>---</td>
              <td>---</td>
            </tr>
            <tr>
              <td>Moyenne Générale</td>
              <td>---</td>
              <td>---</td>
              <td>-----</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Div de droite avec le tableau pour les absences et justifications -->
      <div class="column-right">
      <table class="absence-table">
        <thead>
          <tr>
            <th>Absences</th>
            <th>Justifiées</th>
            <th>Non Justifiées</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ absences.total }}</td>
            <td>{{ absences.justifiees }}</td>
            <td>{{ absences.nonJustifiees }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

    <div class="container2">
  <!-- Div pour les mentions -->
  <div class="column-left">
    <h3>Mentions</h3>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="mention" id="mention1" value="Félicitations" v-model="mention" :disabled="true" />
      <label class="form-check-label" for="mention1">Félicitations</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="mention" id="mention2" value="Encouragements" v-model="mention" :disabled="true" />
      <label class="form-check-label" for="mention2">Encouragements</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="mention" id="mention3" value="Tableau d'honneur" v-model="mention" :disabled="true" />
      <label class="form-check-label" for="mention3">Tableau d'honneur</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="mention" id="mention4" value="Passable" v-model="mention" :disabled="true" />
      <label class="form-check-label" for="mention4">Passable</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="mention" id="mention5" value="Insuffisant" v-model="mention" :disabled="true" checked />
      <label class="form-check-label" for="mention5">Insuffisant</label>
    </div>
  </div>
</div>

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

// Déclaration des props : ces données dynamiques sont passées au composant depuis le parent
const props = defineProps({
  anneeScolaire: String, 
  niveau: String,       
  effectif: Number,      
  matricule: String,    
  sexe: String,          
  classe: String,       
  prenom: String,       
  nom: String,          
  dateNaissance: String, 
  moyenneClasse: Number, 

  // Tableau des matières étudiées par l'élève, chaque matière contient des informations telles que la moyenne et le coefficient
  matieres: {
    type: Array,
    default: () => [] // Valeur par défaut vide si aucune matière n'est passée
  },

  // Objet pour gérer les absences, avec un nombre total d'absences, justifiées et non justifiées
  absences: {
    type: Object,
    default: () => ({
      total: 0,           
      justifiees: 0,      
      nonJustifiees: 0,   
    }),
  },
  moyenneClasse: {
    type: Number,
    required: true
  },
});

// Calcul du total des coefficients pour toutes les matières
const totalCoef = computed(() => {
  // Utilisation de reduce() pour additionner les coefficients de toutes les matières
  return props.matieres.reduce((total, matiere) => 
    total + (matiere.coeff || 0),  // Ajoute le coefficient de la matière au total, ou 0 si le coefficient est non défini
  0); // Le total commence à 0
});

// Calcul du total Moy*Coef pour toutes les matières
const totalMoyCoef = computed(() => {
  // Utilisation de reduce() pour calculer la somme des moyennes pondérées par le coefficient de chaque matière
  return props.matieres.reduce((total, matiere) => {
    const moyenneMatiere = parseFloat(matiere.moyenneMatiere) || 0; // Conversion de la moyenne en nombre, ou 0 si non définie
    const coefficient = parseFloat(matiere.coeff) || 0;             // Conversion du coefficient en nombre, ou 0 si non défini
    return total + (moyenneMatiere * coefficient);                  // Ajout du produit Moyenne * Coefficient au total
  }, 0); // Le total commence à 0
});

// Fonction pour obtenir l'appréciation en fonction de la moyenne de la matière
const getAppreciation = (moyenneMatiere) => {
  const moyenne = parseFloat(moyenneMatiere) || 0;
  if (moyenne < 10) return 'Faible';
  if (moyenne >= 10 && moyenne < 12) return 'Passable';
  if (moyenne >= 12 && moyenne < 14) return 'Assez-Bien';
  if (moyenne >= 14 && moyenne < 16) return 'Bien';
  if (moyenne >= 16 && moyenne < 18) return 'Très-Bien';
  if (moyenne >= 18 && moyenne <= 20) return 'Excellent';
  return '-'; 
};

// Calcul de la moyenne du 1er semestre
const moyennePremierSemestre = computed(() => {
  return totalCoef.value > 0 ? (totalMoyCoef.value / totalCoef.value) : 0;
});


// Fonction pour obtenir la mention en fonction de la moyenne du 1er semestre
const getMention = (moyenne) => {
  if (moyenne < 10) return 'Insuffisant';
  if (moyenne >= 10 && moyenne < 12) return 'Passable';
  if (moyenne >= 12 && moyenne < 14) return 'Tableau d\'honneur';
  if (moyenne >= 14 && moyenne < 16) return 'Encouragement';
  return 'Félicitations'; // moyenne >= 16
};
const mention = ref(getMention(moyennePremierSemestre.value));

// Mettre à jour la mention chaque fois que la moyenne change
watch(moyennePremierSemestre, (newMoyenne) => {
  mention.value = getMention(newMoyenne);
});
</script>


<style scoped>
/* Style du header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 10px solid #000000;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}

.logo-left,
.logo-right {
  width: 130px;
  height: 70px;
}

.header-text {
  font-size: 24px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
}

h3,
h4 {
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 0;
}

p {
  color: #000000;
  margin-top: 0;
  margin-bottom: 0;
}

/* Conteneur pour les deux div */
.container-fluid {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.column {
  margin: 0 10px;
  width: 40%;
  border: 1px solid black;
  border-radius: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  text-align: start;
  font-size: 20px;
}

span {
  font-weight: bold;
}

.titre {
  background-color: transparent;
  width: 98%;
  margin-left: -10%;
  margin-right: auto;
  text-align: center;
  color: rgb(0, 0, 0);
  margin-top: 30px;
  padding: 10px;
}

/* Style du tableau */
.bulletin-table {
  width: 98%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  border-collapse: collapse;
  text-align: center;
}

.bulletin-table th,
.bulletin-table td {
  border: 1px solid black;
  padding: 10px;
}

.bulletin-table th {
  background-color: #407CEE;
  color: white;
}

.bulletin-table tfoot {
  font-weight: bold;
}

/* Style pour le tableau de gauche (moyennes, rangs, moyennes classe) */
.container1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}

.column-left {
  width: 48%;
  padding: 10px;
}

.semestre-table {
  width: 100%;
  border-collapse: collapse;
}

.semestre-table th,
.semestre-table td {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

.semestre-table th {
  background-color: #407CEE;
  color: white;
}

/* Style pour le tableau de droite (absences et justifications) */
.column-right {
  width: 48%;
  padding: 10px;
}

.absence-table {
  width: 100%;
  border-collapse: collapse;
}

.absence-table th,
.absence-table td {
  border: 1px solid black;
  padding: 10px;
  text-align: center;
}

.absence-table th {
  background-color: #407CEE;
  color: white;
}

.mentions-list {
  list-style-type: none;
  padding: 0;
}

.container2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
margin-bottom: 50px;
  margin-top: 30px;
  width: 98%;
  margin-left: auto;
  margin-right: auto;
}

/* Style pour la colonne de gauche (mentions) */
.column-left {
  width: 48%;
  padding: 10px;
}

.mentions-list li {
  padding: 10px;
  margin: 5px 0;
  font-size: 20px;
}

input[type="radio"] {
  margin-right: 10px;
}
</style>
