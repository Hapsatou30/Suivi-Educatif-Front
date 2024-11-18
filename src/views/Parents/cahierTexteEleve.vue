<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <div class="head">
            <router-link to="/gestion_cahier_texte_parent">
                <Icon class="retour" icon="formkit:arrowleft" />
            </router-link>
            <h1 style="text-align: center; ">Le cahier de texte de la classe de <span
                    class="prenom">{{ prenom }}</span></h1>
        </div>
        <div class="cahiers">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-noteMatiere"
                    :headers="['Matière', 'Professeur', 'Date', 'Titre', 'Résumé', 'Ressource']" :data="paginatedData.map(({ matiere, professeur, formattedDate, titre, resume, ressources, id }) => ({
                        matiere,
                        professeur,
                        formattedDate,
                        titre,
                        resume,
                        ressources,
                        id,
                    }))">
                     <template #resume="{ resume }">
                        <span>{{ resume.length > 20 ? resume.substring(0, 20) + '...' : resume }}</span>
                        <a href="#" @click.prevent="openModal(resume)">Voir plus</a>
                    </template>
                    <template #resources="{ ressources }">
                        <a v-if="ressources" :href="ressources" target="_blank">Voir les ressources</a>
                    </template>
                </tabEvaluations>


                <p v-else class="alert alert-info">Pas de cahier de texte.</p>
            </div>
             <!-- Modal -->
            <div v-if="selectedResume" class="modal" @click.self="selectedResume = ''">
                <div class="modal-content">
                <span class="close" @click="selectedResume = ''">&times;</span>
                <h3>Résumé complet</h3>
                <p>{{ selectedResume }}</p>
                </div>
            </div>

            <!-- Pagination -->
            <pagination class="pagination2" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>
    </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { getDetailsEleve } from '@/services/ClasseEleve';
import { useRoute } from 'vue-router';
import { getCahierTexte } from '@/services/CahierDeTexte';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id);
const prenom = ref('');
const anneeClasse_id = ref('');

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const selectedResume = ref(''); // État pour stocker le résumé sélectionné


const fetchDetailsEleve = async () => {
    try {
        const response = await getDetailsEleve(classeEleve_id.value);
        if (response.status === 200) {
            prenom.value = response.données.prenom;
            anneeClasse_id.value = response.données.anneeClasse_id;

        } else {
            console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    }
};
const fetchData = async () => {
    try {
        const response = await getCahierTexte(anneeClasse_id.value);
        console.log('rrrr', anneeClasse_id);
        console.log('response', response);

        tableData.value = response.données.map(item => ({
            matiere: item.matiere,
            professeur: item.professeur,
            date: new Date(item.date), // Convertir en objet Date pour trier
            formattedDate: new Date(item.date).toLocaleDateString('fr-FR'), // Format français (dd/MM/yyyy)
            titre: item.titre,
            resume: item.resume,
            ressources: item.ressources,
            id: item.id,
        }))
        .sort((a, b) => b.date - a.date); // Trier du plus récent au plus ancien

    } catch (error) {
        console.error('Erreur lors du chargement des cahiers de texte :', error);
    }
}

const handlePageChange = (page) => {
    currentPage.value = page;
};

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});

onMounted(async () => {
    await fetchDetailsEleve();
    await fetchData();
});
const openModal = (resume) => {
  selectedResume.value = resume; // Stocker le résumé sélectionné
};

</script>

<style scoped>
::v-deep .tab-noteMatiere td:nth-child(5) {
  display: none;

}
.modal {
  position: fixed;
  z-index: 1000;
  right: 0; 
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: flex-end; 
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 0; /* Supprimer la marge pour aligner à droite */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Largeur du contenu modal */
  max-width: 400px; /* Ajustez la largeur maximale selon vos besoins */
  height: 100%; /* Prendre toute la hauteur de la page */
  border-radius: 8px; /* Si vous souhaitez arrondir les coins */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Ajouter une ombre pour le relief */
  overflow-y: auto; /* Ajouter un défilement si le contenu dépasse la hauteur */
}


.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.main-content {
    margin-top: 120px;
}

.head {
    display: flex;
    align-items: center;
}

.prenom {
    color: #FFCD1E;
}

.retour {
    font-size: 30px;
    color: black;
    margin-left: 300px;
}

::v-deep .tab-noteMatiere td:nth-child(7) {
    display: none;
    /* Masquer la colonne de l'ID */
}

::v-deep .tab-noteMatiere td:nth-child(6) {
    display: none;
    /* Masquer la colonne de l'ID */
}
.head h1{
    margin-left: 15%;
    
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
@media (max-width: 992px) {
   .main-content {
    overflow-x: hidden;
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
    margin-top: -48%;
}
.head {
    gap: 2% ;
}
.head h1{
    margin-left: 10%;
    
 }
 .head h1{
    font-size: 24px;
    margin-top: 25px;
    text-align: center;
}
.retour {
    
    margin-left: 0;
}
.tableau1 {
    margin: 0;
  }
}
@media (max-width: 576px) {
    .head{
        display: flex;
        align-items: center;
        justify-content: space-around;
       
    }
    .retour {
    
    margin-left: 0;
}


 .head h1{
    font-size: 18px;

    margin-top: 25px;
    margin-left: -50px;
    text-align: center;
}
.cahiers{
    margin-top: 20px;
}


    .main-content {
   overflow-x: hidden;
    width: 70%;
    margin-left: auto !important;
    margin-right: auto !important;
}
}
@media (max-width: 360px) {
    .main-content {
   overflow-x: hidden;
    width: 60%;
    margin-left: auto !important;
    margin-right: auto !important;
   margin-top: 0;
}

}
</style>
