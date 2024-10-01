<template>
    <div class="tableau-horaires">
      <table>
        <thead>
          <tr>
            <th>Horaires</th>
            <th>Lundi</th>
            <th>Mardi</th>
            <th>Mercredi</th>
            <th>Jeudi</th>
            <th>Vendredi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(horaire, index) in horaires" :key="index">
            <td>{{ horaire.temps }}</td>
            <td v-for="(jour, dayIndex) in jours" :key="dayIndex">
              <div v-if="data[dayIndex] && data[dayIndex][index]?.length > 0" class="carte">
                <div v-for="item in data[dayIndex][index]" :key="item.id">
                  <h4>{{ item.Matiere }}</h4>
                  <p>{{ item.classe }}</p>
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
  .carte h4{
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
  