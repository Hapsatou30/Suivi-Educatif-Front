<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Liste des élèves de la classe de : {{ nom }}
        </h2>
        <div class="eleves">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-eleves1"
                    :headers="['Prénom & Nom', 'Matricule', 'Bulletins']" :data="paginatedData.map(({ prenom, nom, matricule, id_classeEleve }) => ({
                        eleve: `${prenom} ${nom}`,
                        matricule,
                        id_classeEleve
                    }))">

                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn " @click="redirectToSubeject(row.id_classeEleve)"
                                style="color: #407CEE; font-size: 40px;" title="Voir les bulletins">
                                <Icon icon="marketeq:eye" />
                            </button>
                        </div>
                    </template>

                </tabEvaluations>

                <p v-else class="alert alert-info">Aucun élève trouvé.</p>
            </div>

            <!-- Pagination -->
            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
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
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getEleveClasse } from '@/services/ClasseEleve';
import { Icon } from '@iconify/vue';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const tableData = ref([]); // Données des élèves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const anneeClasse_id = route.params.anneeClasse_id;
const nom = route.params.nom;

// Récupération des données des élèves
const fetchData = async () => {
    try {
        // Récupérer les élèves de la classe
        const response = await getEleveClasse(anneeClasse_id);
        console.log('Réponse de getEleveClasse:', response);

        // Vérifie si les élèves existent
        if (response.données && response.données[0].eleves) {
            tableData.value = response.données[0].eleves;
            tableData.value.sort((a, b) => a.nom.localeCompare(b.nom));
        } else {
            console.error('Aucun élève trouvé dans la réponse.');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
};






// Méthode pour changer de page dans la pagination
const handlePageChange = (page) => {
    currentPage.value = page;
};


// Calculer les données paginées
const paginatedData = computed(() => {
    if (!tableData.value || tableData.value.length === 0) {
        return [];
    }
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});


// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};


// Appel des méthodes au montage du composant
onMounted(() => {
    fetchData();

});
const redirectToSubeject = (id_classeEleve) => {
  // Redirige vers la page annee_classes avec l'id dans l'URL
  router.push({ name: 'bulletins_1er_Semestre_par_eleve', params: { id_classeEleve } });
};
</script>



<style scoped>
::v-deep .eleves .tableau1 .tab-eleves1 td:nth-child(3) {
    display: none;
}



.tableau-absences {
    margin-left: 300px;
    margin-right: 50px;
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

.absences {
    margin-top: 100px;
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

.retour {
    display: flex;
    justify-content: end;
    margin-right: 50px;
    margin-bottom: 20px;
    margin-top: 50px;
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
@media (max-width: 992px) {
  .main-content {
 margin-top: -50%;
 width: 180%;
 margin-left: -38%;
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
 width: 160%;
 margin-left: -30%;
 margin-top:-70px ;
  
}
}
@media (max-width: 576px) {
  .main-content {
width: 105%;
 margin-left: -02%;
 margin-top: -80;
  
}
.main-content h2 {
  font-size: 18px;
  text-align: center;
  width: 70%;
  margin-left: 13%;
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
width: 105%;
 margin-left: -02%;
 margin-top: -80;
  
}
}
@media (max-width: 360px) {
    .main-content {
width: 105%;
 margin-left: -02%;
 margin-top: -80;
  
}
}
</style>