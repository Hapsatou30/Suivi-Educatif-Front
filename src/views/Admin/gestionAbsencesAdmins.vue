<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">

    <h2>Gestion des absences </h2>
    <div class="search-container" style="display: flex; align-items:  center; justify-content: end;">
      <input type="text" v-model="searchQuery" class="form-control mb-3" placeholder="Recherchez une classe " />
    </div>

    <div class="classes">

      <div class="tableau1">
        <tabEvaluations v-if="paginatedData.length > 0" class="tab-gestionNotes"
          :headers="['N°', 'Nom ', 'Capacité', 'Niveau', 'Absences']" :data="paginatedData.map(({ numero, nom, capacite, niveau, id, anneeClasse_id }) => ({
            numero,
            nom,
            capacite,
            niveau,
            id,
            anneeClasse_id

          }))">
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn " @click="redirectToSubeject(row.anneeClasse_id)"
                style="color: #407CEE; font-size: 40px;" title="Voir les absences">
                <Icon icon="marketeq:eye" />
              </button>
            </div>
          </template>
        </tabEvaluations>

        <p v-else class="alert alert-info">
          Aucune classe trouvée.
        </p>
      </div>

      <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
        :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getAnneClasses } from '@/services/AnneeClasseService';
import { Icon } from '@iconify/vue';

const router = useRouter();

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

const fetchData = async () => {
  try {
    const response = await getAnneClasses();
    // console.log('Réponse de l\'API:', response);

    // Vérifiez si 'données' est un tableau
    if (Array.isArray(response.données)) {
      // Aplatir les classes pour les récupérer dans un seul tableau
      const classes = response.données.flatMap(annee =>
        annee.classes.map((classe, index) => ({
          numero: index + 1,
          nom: classe.nom,
          niveau: classe.niveau,
          capacite: classe.capacite,
          id: classe.id,
          anneeClasse_id: classe.anneeClasse_id
        }))
      );

      tableData.value = classes;
    } else {
      console.error('La réponse n\'est pas un tableau:', response.données);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
  }
};



// propriété pour la barre de recherche
const searchQuery = ref('');

// Filtrer les professeurs en fonction de la requête de recherche
const filteredClasses = computed(() => {
  // Si la requête de recherche est vide, on retourne tous les matieres
  if (!searchQuery.value) {
    return tableData.value;
  }
  // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return tableData.value.filter(classe =>
    classe.nom.toLowerCase().includes(lowerCaseQuery) ||
    classe.niveau.toLowerCase().includes(lowerCaseQuery)

  );
});
const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredClasses.value.slice(start, end);
});


const redirectToSubeject = (anneeClasse_id) => {
  // Redirige vers la page annee_classes avec l'id dans l'URL
  router.push({ name: 'absences_classe_admin', params: { anneeClasse_id } });
};

onMounted(fetchData);
</script>


<style scoped>
/* Masquer la colonne ID dans le tableau */
::v-deep .tab-gestionNotes td:nth-child(6) {
  display: none;
  /* Masquer la colonne de l'ID */
}

::v-deep.tab-gestionNotes td:nth-child(5) {
  display: none;
  /* Masquer la colonne de l'ID */
}

.boutons {
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.boutons .btn {
  font-size: 24px;
}

.main-content {
  margin-top: 120px;
}

.main-content h2 {
  color: black;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: center;
  margin-left: 300px;
}

.form-container {
  max-width: 100%;
  border: 1px solid #F7AE00;
  border-radius: 12px;
  background-color: white;
  margin-left: 300px;
  margin-right: 50px;
  margin-top: 30px;
  padding: 30px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 20px;
}

input {
  width: 100%;
  /* Changez ceci pour s'adapter à votre mise en page */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 58px;
}

input::placeholder {
  color: #ccc;
  font-size: 12px;
}

.col-md-6 .btn-submit {
  background-color: #407CEE;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  padding: 8px;
  width: 200px;
  height: 58px;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  margin-top: 10px;
}

.col-md-6 .btn-submit:hover {
  background-color: #365F9B;
  /* Change la couleur au survol */
}

.classes {
  margin-top: 50px;
}

.classes h3 {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  text-align: start;
  margin-left: 300px;
}

.tableau1 {
  margin-left: 300px;
  margin-right: 50px;
}

.pagination1 {
  margin-left: 275px;
  margin-right: 50px;
  display: flex;
  justify-content: end;
}

p {
  font-size: 18px;
  color: red;
  font-family: "Poppins", sans-serif;
}

.search-container input {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  border-radius: 12px;
  width: 350px;
  margin-right: 50px;
}
@media (max-width: 992px) {
  .main-content {
 width: 150%;
 margin-left: -20%;
 margin-top: 0px;
  
}
  .main-content h2 {
  margin-left: 0px;
}
.form-container {
  margin-left: 0px;
  margin-right: 50px;
}
.classes h3 {
  margin-left: 0px;
}
.tableau1 {
  margin-left: 0px;
}
.classes {
  margin-top: 0px;
}
}
@media (max-width: 768px) {
  .main-content {
 width: 150%;
 margin-left: -20%;
 margin-top: 100px;
  
}
}
@media (max-width: 576px) {
  .main-content {
width: 85%;
 margin-left: 12%;
 margin-top: 150px;
  
}
.main-content h2 {
  font-size: 20px;
  text-align: center;
  margin-left: -25px;
}
.search-container input {
 display: flex;
 align-items: center;
 justify-content: center;
  width: 100%;
  margin-right: 50px;
  margin-left: 0;
}
}
@media (max-width: 390px) {
  .main-content {
width: 80%;
 margin-left: 15%;
 margin-top: 150px;
  
}
}
@media (max-width: 360px) {
  .main-content {
width: 75%;
margin-left: 17.5%;
 margin-top: 200px;
  
}
}
</style>