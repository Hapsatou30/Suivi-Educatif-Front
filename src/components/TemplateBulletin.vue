<template>
  <div>
    <!-- Header avec deux logos et un texte centré -->
    <header class="header ">
      <img src="@/assets/Flag_of_Senegal.svg.png" alt="Logo Gauche" class="logo-left" />
      <div class="header-text">
        <p>République du Sénégal</p>
        <p>Ministère de l'Éducation nationale</p>
        <h3>Les Cours Privés Général Mouhamadou Mansour Seck</h3>
        <h4>ANNÉE SCOLAIRE : 2024-2025</h4>
      </div>
      <img src="@/assets/ministere.png" alt="Logo Droite" class="logo-right" />
    </header>

    <!-- Conteneur pour les deux div alignés -->
    <div class="container-fluid">
      <div class="column">
        <ul>
          <li>Tél: <span>338765678</span></li>
          <li>Email: <span>samaecole@gmail.com</span></li>
          <li>Niveau: <span>Troisième</span></li>
          <li>Effectif: <span>25</span></li>
          <li>Moyenne Classe: <span>10.02</span></li>
        </ul>
      </div>

      <div class="column">
        <ul>
          <li>Matricule: <span>EAM2345</span></li>
          <li>Sexe: <span>Féminin</span></li>
          <li>Classe: <span>3ème A</span></li>
          <li>Prénom & Nom: <span>Amina Zahra Fall</span></li>
          <li>Né(e) le: <span>20-04-2010</span></li>
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
        <tr>
          <td>Mathématiques</td>
          <td>12</td>
          <td>15</td>
          <td>13.5</td>
          <td>4</td>
          <td>54</td>
          <td>1</td>
          <td>Très bien</td>
        </tr>
        <tr>
          <td>Français</td>
          <td>14</td>
          <td>16</td>
          <td>15</td>
          <td>3</td>
          <td>45</td>
          <td>2</td>
          <td>Bien</td>
        </tr>
        <tr>
          <td>Histoire</td>
          <td>13</td>
          <td>14</td>
          <td>13.5</td>
          <td>2</td>
          <td>27</td>
          <td>3</td>
          <td>Assez bien</td>
        </tr>
        <tr>
          <td>Physique</td>
          <td>10</td>
          <td>12</td>
          <td>11</td>
          <td>4</td>
          <td>44</td>
          <td>4</td>
          <td>Passable</td>
        </tr>
        <tr>
          <td>Anglais</td>
          <td>15</td>
          <td>17</td>
          <td>16</td>
          <td>2</td>
          <td>32</td>
          <td>1</td>
          <td>Très bien</td>
        </tr>
        <tr>
          <td>SVT</td>
          <td>13</td>
          <td>14</td>
          <td>13.5</td>
          <td>3</td>
          <td>40.5</td>
          <td>2</td>
          <td>Bien</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>Totaux</td>
          <td></td>
          <td></td>
          <td></td>
          <td>18</td> <!-- Total Coef -->
          <td>242.5</td> <!-- Total Moy*Coef -->
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>

  </div>
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
            <td>3</td>
            <td>2</td>
            <td>1</td>
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
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        <label class="form-check-label" for="flexRadioDefault1">
          Félicitations
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        <label class="form-check-label" for="flexRadioDefault1">
          Encouragements
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        <label class="form-check-label" for="flexRadioDefault1">
          Tableau d'honneur
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
        <label class="form-check-label" for="flexRadioDefault1">
          Passable
        </label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
        <label class="form-check-label" for="flexRadioDefault2">
          Insuffisant
        </label>
      </div>
    </div>

  </div>

</template>

<script setup>
// Si des scripts sont nécessaires, tu peux les ajouter ici
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
