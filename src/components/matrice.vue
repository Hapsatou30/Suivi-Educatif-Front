<template>
  <div class="tableau-horaires">
    <table class="table table-bordered table-responsive">
      <thead>
        <tr>
          <th>Horaires</th>
          <th v-for="(jour, dayIndex) in jours" :key="dayIndex">{{ jour }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(horaire, horaireIndex) in horaires" :key="horaireIndex">
          <td>{{ horaire.temps }}</td>
          <td v-for="(jour, dayIndex) in jours" :key="dayIndex">
            <div v-if="data[horaireIndex] && data[horaireIndex][dayIndex]?.length > 0" class="carte"
              :style="{
                backgroundColor: isMatiere ? classeColors[data[horaireIndex][dayIndex][0].Matiere] : classeColors[data[horaireIndex][dayIndex][0].classe]
              }">
              <div v-for="item in data[horaireIndex][dayIndex]" :key="item.id">
                <h4>{{ item.Matiere }}</h4>
                <div class="foot" style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px;">
                  <p>{{ item.classe }}</p>
                  <p>{{ item.professeur }}</p>
                </div>
              </div>
            </div>
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
    isMatiere: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.tableau-horaires {
  margin-left: 300px;
  margin-right: 50px;
  width: 78%;
  overflow-x: auto;

}

.tableau-horaires table {
  width: 100%; /* Prend toute la largeur disponible */
  border-collapse: collapse; /* Pour un aspect plus propre */
}

.tableau-horaires th,
.tableau-horaires td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.tableau-horaires th {
  font-size: 1.5rem; /* Utiliser des unités relatives pour plus de flexibilité */
  color: black;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.tableau-horaires td {
  font-size: 1.2rem; /* Utiliser des unités relatives pour plus de flexibilité */
  font-family: "Poppins", sans-serif;
  font-weight: 300;
}

.carte {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px; /* Arrondi plus léger pour un look moderne */
  background-color: black;
  margin-bottom: 10px; /* Espacement entre les cartes */
}

.carte h4 {
  color: white;
  font-size: 1.2rem; /* Ajuster la taille pour la responsivité */
  font-family: "Poppins", sans-serif;
}

.carte p {
  color: white;
  font-size: 0.9rem; /* Ajuster la taille pour la responsivité */
  font-family: "Poppins", sans-serif;
  margin-top: 5px;
  text-align: end;
}
</style>

