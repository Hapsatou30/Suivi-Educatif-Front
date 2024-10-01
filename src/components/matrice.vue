<template>
    <div class="tableau-horaires ">
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
          <tr>
            <td>08:00 - 10:00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>10:15 - 12:00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>12:15 - 14:00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>14:15 -16:00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>16:15 - 18:00</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
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
    background-color: #f4f4f4;
  }
  </style>
  