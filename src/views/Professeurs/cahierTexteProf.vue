<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <h2>
      Remplir le cahier de texte de la classe de : {{ nom_classe }}
    </h2>
    <div class="cahier-text container mt-4">
      <div class="image-container">
        <img :src="imageCahier" alt="" class="image-background" />
        <div class="overlay-text">
          <form @submit.prevent="handleFormSubmit">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="titre" class="form-label">Titre du Cours :</label>
                <input type="text" class="form-control" v-model="titre" placeholder="Entrez votre titre" required />
              </div>
              <div class="col-md-6" >
                <label for="date" class="form-label">Date :</label>
                <input type="date" class="form-control" v-model="date" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="resume" class="form-label">Résume du cours:</label>
                <textarea name="" class="form-control" v-model="resume" placeholder="Entrez votre résume" required style="height: 200px;"></textarea>
              </div>
              <div class="col-md-6">
                <label for="ressource" class="form-label">Ressource :</label>
                <input type="text" class="form-control" v-model="ressource" placeholder="Entrez votre ressource" required />
              </div>
            </div>
            <div class="bouton">
              <button type="submit" class="btn btn-submit">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="cahiers">
            <div class="tableau">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-cahiers"
                    :headers="['Matiere', 'Professeur','Date', 'Titre', 'Action']"
                    :data="paginatedData.map(({
                      matiere,
                      professeur,
                      date,
                      titre,
                      id
                    })=>({
                      matiere,
                      professeur,
                      date,
                      titre,
                      id
                    })
                    )
                    
                    ">
                      <template #actions="{ row }">
                        <div class="boutons">
                          <button class="btn " @click="editMatiere(row.id)" style="color: #4862C4;" title="Modifier la matière">
                            <Icon icon="mdi:pencil-outline" /> 
                          </button>
                          <button class="btn " @click="deleteMatiere(row.id)" style="color: red;" title="Supprimer la matière">
                            <Icon icon="mdi:trash-can-outline" /> 
                          </button>
                        </div>
                      </template>
                </tabEvaluations>

                <p v-else class="no-evaluations-message">pas de cahier de texte.</p>
            </div>

            <!-- Pagination -->
            <pagination 
        class="pagination2"
        v-if="tableData.length > pageSize"
        :totalItems="tableData.length"
        :pageSize="pageSize"
        :currentPage="currentPage"
        @pageChange="handlePageChange"
      />
        </div>

    <div class="retour">
      <button @click="retour" class="btn btn-secondary">Retour</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getCahierTexte } from '@/services/CahierDeTexte';
import { Icon } from '@iconify/vue';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();
const imageCahier =ref('/public/images/image.png');

// Variables réactives
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Méthode pour récupérer les cahiers de texte
const fetchCahierTexte = async () => {
  try {
    const response = await getCahierTexte(annee_classe_id);
    tableData.value = response.données.map(item => ({
      matiere: item.matiere,
      professeur: item.professeur,
      date: item.date,
      titre: item.titre,
      resume: item.resume
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des cahiers de texte :', error);
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

// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};

// Récupérer les cahiers de texte lors du montage du composant
onMounted(() => {
  fetchCahierTexte();
});
</script>




<style scoped>
.cahier-text{
  margin-left: 290px;
  margin-right: 50px;
  width: 90%;
}
.image-container {
  position: relative;
}

.image-background {
  width: 98%;
  height: auto;
  border-radius: 12px;
}

.overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  border-radius: 12px;
}
form{
  width: 900px;
  margin-left: 2%;
  margin-top: 2%;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  margin-left: 40px;
  

  
}

input[type="text"],
input[type="date"],
textarea {
  width: 85%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #000000;
  background-color: transparent;
}
input[type="text"]::placeholder, textarea::placeholder{
  color: #F7AE00;
}
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  color: #F7AE00;
}

label{
  font-weight: bold;
}
.main-content {
  margin-top: 120px;
}

.main-content h2 {
  color: black;
  font-size: 24px;
  text-align: center;
  margin-left: 300px;
}

.bouton {
    display: flex;
    justify-content: end;
    margin-right: 60px;
  }
  .bouton .btn-submit {
    background-color: #F7AE00;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  }
  .bouton .btn-submit:hover {
    background-color: #F7AE00; /* Change la couleur au survol */
  }
.cahiers{
  margin-right: 50px;
  width: 100%;
}
::v-deep .cahiers .tableau .tab-cahiers td:nth-child(5) {
 display: none;
}

.tab-cahiers {
    margin-left: 300px;
    margin-right: 50px;
}
.retour {
  display: flex;
  justify-content: end;
  margin-right: 50px;
  margin-bottom: 20px;
  margin-top: 50px;
}
p {
    font-size: 18px;
    color: red;
    font-family: "Poppins", sans-serif;
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
  color: #F7AE00;
}
 .pagination2{
 
 display: flex;
 justify-content: end;
}
</style>