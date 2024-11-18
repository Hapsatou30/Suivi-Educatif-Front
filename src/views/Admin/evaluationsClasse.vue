<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Les évaluations à Venir pour la classe de: {{ nomClasse }}
        </h2>
        <div class="mon_planning">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedOtherProf.length > 0" class="tab-planning1"
                    :headers="['Matière', 'Professeur', 'Date', 'Heure', 'Durée (mins)', 'Evaluation',]"
                    :data="paginatedOtherProf.map(({ matiere, professeur, date, heure, duree, type_evaluation }) => ({ matiere, professeur, date, heure, duree, type_evaluation }))">
                </tabEvaluations>
                <p v-else class="alert alert-info">Aucune évaluation prévue.</p>
            </div>
            <pagination class="pagination1" v-if="otherProfEvaluations.length > pageSize"
                :totalItems="otherProfEvaluations.length" :pageSize="pageSize" :currentPage="currentPageOther"
                @pageChange="handlePageChangeOther" />
        </div>

        <div class="historique" style="margin-top: 100px;">
            <h2>
                Les évaluations Passées
            </h2>
             <!-- Barre de recherche -->
    <div class="search-container" >
      <input 
        type="text" 
        v-model="searchQuery" 
        class="form-control mb-3" 
        placeholder="Recherchez un professeur " 
      />
    </div>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-planning2"
                    :headers="['Matière', 'Professeur', 'Date', 'Heure', 'Durée (mins)', 'Évaluation']"
                    :data="paginatedData.map(({ matiere, professeur, date, heure, duree, type_evaluation }) => ({ matiere, professeur, date, heure, duree, type_evaluation }))">
                </tabEvaluations>

                <p v-else class="alert alert-info">Aucune évaluation passée.</p>
                <pagination class="pagination2" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                    :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
            </div>
        </div>

        <div class="retour">
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { getEvaluationsParAnneeClasse } from '@/services/Evaluations';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');

const router = useRouter();
const route = useRoute();

const nomClasse = ref('');
const anneClasseId = route.params.anneeClasse_id;

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const otherProfEvaluations = ref([]);
const currentPageOther = ref(1);
const pastEvaluations = ref([]);

const fetchEvaluationsFutur = async () => {
    try {
        const response = await getEvaluationsParAnneeClasse(anneClasseId);
        // console.log('response', response);

        if (response.status === 200) {
            // Filtrer pour garder seulement les évaluations à venir
            const evaluationsFutures = response.evaluations.filter(evaluation =>
                dayjs(evaluation.date).isAfter(dayjs())
            );

            otherProfEvaluations.value = evaluationsFutures;
        } else {
            console.error('Erreur lors de la récupération des évaluations:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};
const fetchEvaluationsPasses = async () => {
    try {
        const response = await getEvaluationsParAnneeClasse(anneClasseId);

        if (response.status === 200) {
            const evaluationsPasses = response.evaluations.filter(evaluation =>
                dayjs(evaluation.date).isBefore(dayjs())
            );

            pastEvaluations.value = evaluationsPasses;
            tableData.value = evaluationsPasses; // Ajoutez cette ligne pour assigner à tableData
        } else {
            console.error('Erreur lors de la récupération des évaluations:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des évaluations:', error);
    }
};
// Propriété pour stocker la requête de recherche
const searchQuery = ref('');

// Filtrer les evaluations en fonction de la requête de recherche
const filtrerEvaluations = computed(() => {
  // Si la requête de recherche est vide, on retourne tous les evaluations
  if (!searchQuery.value) {
    return tableData.value;
  }

  // Convertir la requête de recherche en minuscules pour ignorer la casse
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  
  // Filtrer les evaluations en fonction du nom, prénom, email ou matricule
  return tableData.value.filter(evaluation =>
    evaluation.matiere.toLowerCase().includes(lowerCaseQuery) || 
    evaluation.professeur.toLowerCase().includes(lowerCaseQuery) || 
    evaluation.date.toLowerCase().includes(lowerCaseQuery)  
  );
});

// Pagination pour les évaluations des autres professeurs
const paginatedOtherProf = computed(() => {
    const start = (currentPageOther.value - 1) * pageSize.value;
    return otherProfEvaluations.value.slice(start, start + pageSize.value);
});


const handlePageChangeOther = (newPage) => {
    currentPageOther.value = newPage;
};

const handlePageChange = (page) => {
    currentPage.value = page;
};

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filtrerEvaluations.value.slice(start, end); // Utiliser tableData pour la pagination
});

// Méthode pour récupérer les détails d'une année
const detailsAnneeClasse = async (id) => {
    try {
        const response = await getAnneeClasseDetails(id);
        // console.log('Réponse API brute:', response);

        // Vérification si response contient un objet valide
        if (response && response.donnees_classe) { // Corrigé ici pour accéder à 'donnees_classe'
            const classe = response.donnees_classe; // Corrigé ici pour accéder à 'donnees_classe'
            // console.log('Détails de la classe:', classe);
            nomClasse.value = `${classe.nom}`; // Mise à jour de la variable ici
        } else {
            console.error('Aucun détail de la classe trouvé ou structure inattendue.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la classe :', error);
    }
};


// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};

// Appel des méthodes dans onMounted
onMounted(() => {
    //  console.log(anneClasseId);
    detailsAnneeClasse(anneClasseId);
    fetchEvaluationsFutur();
    fetchEvaluationsPasses();
});
</script>


<style scoped>
::v-deep .tab-noteMatiere td:nth-child(6) {
    display: none;
    /* Masquer la colonne de l'ID */
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
.pagination2 {
    display: flex;
    justify-content: end;
  }
  .search-container{
    display: flex;
     align-items:  center; 
     justify-content: end;
     margin-right: 50px;
  }
  .search-container input{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    border-radius: 12px;
    width: 350px;
  }
  @media (max-width: 992px) {
  .main-content {
 width: 115%;
 margin-left: -4%;
 margin-top: 50px;
  
}
  .main-content h2 {
  margin-left: 0px;
  margin-left: -4%;
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
 width: 100%;
 margin-left: 2%;
 margin-top: 150px;
  
}
}
@media (max-width: 576px) {
  .main-content {
width: 85%;
 margin-left: 12%;
 margin-top: 300px;
  
}
.main-content h2 {
  font-size: 18px;
  text-align: center;
  width: 90%;
}
.search-container input {
 display: flex;
 align-items: center;
 justify-content: center;
  width: 100%;
  margin-right: 50px;
  margin-left: 0;
}
.retour .btn-secondary,
.retour .btn-secondary:hover {
 
  width: 120px;
  height: 50px;
  font-size: 20px;

}
}
@media (max-width: 390px) {
  .main-content {
width: 80%;
 margin-left: 15%;
 margin-top: 370px;
  
}
}
@media (max-width: 360px) {
  .main-content {
width: 75%;
margin-left: 17.5%;
 margin-top: 400px;
  
}
}
</style>