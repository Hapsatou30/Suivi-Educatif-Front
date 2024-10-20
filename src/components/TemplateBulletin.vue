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
          <li>Moyenne Classe: <span>10.02</span></li>
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
        <td>{{ matiere.devoirs || '-' }}</td> 
        <td>{{ matiere.examen || '-' }}</td>
        <td>{{ matiere.moyenne || '-' }}</td>
        <td>{{ matiere.coef || '-' }}</td>
        <td>{{ (matiere.moyenne * matiere.coef).toFixed(2) || '-' }}</td>
        <td>{{ matiere.rang || '-' }}</td>
        <td>{{ matiere.appreciations || '-' }}</td>
      </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Totaux</td>
          <td></td>
          <td></td>
          <td></td>
          <td>{{ totalCoef }}</td> <!-- Calcul du total des coefficients -->
          <td>{{ totalMoyCoef.toFixed(2) }}</td> <!-- Calcul du total Moy*Coef -->
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
              <td>13.5</td>
              <td>2</td>
              <td>12.8</td>
            </tr>
            <tr>
              <td>2ème Semestre</td>
              <td>14.0</td>
              <td>1</td>
              <td>13.2</td>
            </tr>
            <tr>
              <td>Moyenne Générale</td>
              <td>13.75</td>
              <td>1</td>
              <td>13.0</td>
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
          <input class="form-check-input" type="radio" name="mention" id="mention1" />
          <label class="form-check-label" for="mention1">Félicitations</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="mention" id="mention2" />
          <label class="form-check-label" for="mention2">Encouragements</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="mention" id="mention3" />
          <label class="form-check-label" for="mention3">Tableau d'honneur</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="mention" id="mention4" />
          <label class="form-check-label" for="mention4">Passable</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="mention" id="mention5" checked />
          <label class="form-check-label" for="mention5">Insuffisant</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Déclaration des props pour passer les données dynamiques
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
  matieres: Array,
   absences: {
    type: Object,
    default: () => ({
      total: 0,
      justifiees: 0,
      nonJustifiees: 0,
    }),},
});

// Calcul du total des coefficients
const totalCoef = computed(() => {
  return props.matieres.reduce((total, matiere) => total + 1, 0); // Ici, la valeur statique est 1
});

// Calcul du total Moy*Coef
const totalMoyCoef = computed(() => {
  return props.matieres.reduce((total, matiere) => total + (0 * 1), 0); // Ici, c'est basé sur les valeurs statiques
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
