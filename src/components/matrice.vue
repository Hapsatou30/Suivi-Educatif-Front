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
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  padding: 0 20px;
  overflow-x: auto;
}

.tableau-horaires table {
  width: 100%;
  border-collapse: collapse;
}

.tableau-horaires th,
.tableau-horaires td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.tableau-horaires th {
  font-size: 1.2rem;
}

.tableau-horaires td {
  font-size: 1rem;
}

.carte {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  background-color: black;
  margin-bottom: 10px;
}

.carte h4 {
  color: white;
  font-size: 1rem;
}

.carte p {
  color: white;
  font-size: 0.8rem;
  margin-top: 5px;
  text-align: end;
}

/* Responsivité pour tablettes */
@media (max-width: 992px) {
  .tableau-horaires {
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }

  .tableau-horaires th {
    font-size: 1.1rem;
  }

  .tableau-horaires td {
    font-size: 0.9rem;
  }

  .carte {
    padding: 8px;
  }

  .carte h4 {
    font-size: 0.9rem;
  }

  .carte p {
    font-size: 0.7rem;
  }
}

/* Responsivité pour mobiles */
@media (max-width: 480px) {
  .tableau-horaires {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    padding: 0 10px;
  }

  .tableau-horaires th {
    font-size: 1rem;
  }

  .tableau-horaires td {
    font-size: 0.8rem;
  }

  .carte {
    padding: 6px;
  }

  .carte h4 {
    font-size: 0.8rem;
  }

  .carte p {
    font-size: 0.6rem;
  }
}

</style>

