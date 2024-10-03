<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <h1 style="text-align: center; margin-left: 300px; margin-bottom: 50px;">Mes Classes </h1>

    <div class="classes">
      <div class="tableau1">
        <tabEvaluations v-if="paginatedData.length > 0" class="tab-classes"
          :headers="['Nom de la classe ', 'Matières', 'Nombre Eleve', 'Action']" 
          :data="paginatedData.map(({ nom_classe, nom_matiere, capacite, classeProf_id ,annee_classe_id}) => ({
            nom_classe,
            nom_matiere,
            capacite,
            classeProf_id,
            annee_classe_id
            
          }))"
          
          >
          <template #actions="{ row }">
            <div class="boutons">
              <button class="btn" @click="seeClasse(row.classeProf_id, row.annee_classe_id, row.nom_classe)" style="color: red; font-size: 40px;" title="Voir les horaires de cette classe">
                <Icon icon="marketeq:eye" />
              </button>
            </div>
          </template>
        </tabEvaluations>


        <p v-else class="no-evaluations-message">Aucune classe trouvée.</p>
      </div>

      <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
        :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
    </div>
    <div class="retour">
      <button @click="retour" class="btn btn-secondary">Retour</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { useRoute, useRouter } from 'vue-router';
import { getListeClasseProf } from '@/services/ClasseProfs';
import { profile } from '@/services/AuthService';
import { Icon } from '@iconify/vue';
const route = useRoute();

const router = useRouter();
const professeurId = ref('');
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);


// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
  try {
    const response = await profile();
    const user = response.user;

    // Récupérer l'ID du professeur connecté
    if (user && user.professeur) {
      professeurId.value = user.professeur.id;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
};

// Ajoutez cette fonction dans votre script setup
const fetchData = async () => {
  try {
    // Appel du service pour récupérer les classes du professeur
    const response = await getListeClasseProf(professeurId.value);
    if (response.status === 200) {
      // Stocker les données dans tableData
      tableData.value = response.classes;
    } else {
      console.error('Erreur lors de la récupération des classes:', response.message);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
};

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

onMounted(async () => {
  await fetchProfile();
  await fetchData();
});


// Méthode pour retourner à la page précédente
const retour = () => {
  router.back();
};


const seeClasse = (classeProf_id, annee_classe_id, nom_classe) => {
  console.log('ID de la classe prof:', classeProf_id, 'ID de l\'année de classe:', annee_classe_id, 'Nom de la classe:', nom_classe);
  router.push({ 
    name: 'fiche_de_presence', 
    params: { 
      classeProf_id, 
      annee_classe_id, 
      nom_classe 
    } 
  });
};





</script>

<style scoped>
/* Masquer la colonne ID dans le tableau */
::v-deep .classes .tableau1 .tab-classes td:nth-child(4) {
  display: none;
  /* Masquer la colonne de l'ID */
}
::v-deep .classes .tableau1 .tab-classes td:nth-child(5) {
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

.retour {
  display: flex;
  justify-content: end;
  margin-right: 50px;
  margin-bottom: 20px;
}

.retour .btn-secondary,
.retour .btn-secondary:hover {
  background-color: transparent;
  color: white;
  border: 1px solid #F7AE00;
  border-radius: 12px;
  cursor: pointer;
  width: 200px;
  height: 58px;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: #F7AE00;

}

.classes p {
  font-size: 18px;
  color: red;
  font-family: "Poppins", sans-serif;
}
</style>
