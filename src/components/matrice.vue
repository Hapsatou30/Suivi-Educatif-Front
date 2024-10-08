<template>
  <div class="tableau-horaires">
    <table>
      <thead>
        <tr>
          <th>Horaires</th>
          <th v-for="(jour, dayIndex) in jours" :key="dayIndex">{{ jour }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(horaire, horaireIndex) in horaires" :key="horaireIndex">
          <!-- Colonne des horaires -->
          <td>{{ horaire.temps }}</td>

          <!-- Colonnes des jours -->
          <td v-for="(jour, dayIndex) in jours" :key="dayIndex">
            <!-- Vérifie si la case contient des données -->
            <div v-if="data[horaireIndex] && data[horaireIndex][dayIndex]?.length > 0" class="carte"
              :style="{
                backgroundColor: isMatiere ? classeColors[data[horaireIndex][dayIndex][0].Matiere] : classeColors[data[horaireIndex][dayIndex][0].classe]
              }">

              <!-- Affichage des matières et classes -->
              <div v-for="item in data[horaireIndex][dayIndex]" :key="item.id">
                <h4>{{ item.Matiere }}</h4>
                <div class="foot" style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                  <p>{{ item.classe }}</p>
                <p>{{ item.professeur }}</p>
                </div>
              </div>
            </div>

            <!-- Si pas de données, afficher un séparateur -->
            <div v-else>
              -------
            </div>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    horaires: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    jours: {
      type: Array,
      required: true,
    },
    classeColors: {
      type: Object,
      required: true,
    },
    // Nouvelle prop pour déterminer le type de profil
    isMatiere: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.tableau-horaires {
  width: 100%;
}

.tableau-horaires table {
  width: 78%;
  border-collapse: collapse;
  margin-left: 300px;
  margin-right: 50px;
  background-color: white;
}

.tableau-horaires th,
.tableau-horaires td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.tableau-horaires th {
  font-size: 24px;
  color: black;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.tableau-horaires td {
  font-size: 18px;
  font-family: "Poppins", sans-serif;
  font-weight: 300;
}

.carte {
  border: 1px solid #ddd;
  padding: 10px;
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: black;
}

.carte h4 {
  color: white;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
}

.carte p {
  color: white;
  font-size: 16px;
  font-family: "Poppins", sans-serif;
  margin-top: 5px;
  text-align: end;
}
</style>
