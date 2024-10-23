<template>
    <sideBarEleve />
    <topBarEleve />
    <div class="main-content">
        <div class="head">
            <h1 style="text-align: center" >Historiques des absences </h1>
        </div>
        <div class="absences">
            <div class="tableau-absences">
                <tabEvaluations v-if="paginatedAbsencesData.length > 0" class="tab-absences_admin"
                    :headers="['Date d\'absence', 'Matière', 'Motif', 'Justification']" :data="paginatedAbsencesData.map(({ formattedDate, classe_prof: { prof_matiere: { matiere } }, justification, id, motif }) => ({
                        formattedDate,
                        matiere: matiere ? matiere.nom : 'Non spécifié',
                        justification: justification ? `http://127.0.0.1:8000/storage//` + justification : 'vide',
                        motif: motif || 'vide',  // Affiche 'vide' si motif est vide
                        id,
                    }))">

                    <template #justification="{ justification }">
                        <span v-if="justification !== 'vide'">
                            <a :href="justification" target="_blank">Voir les justifications</a>
                        </span>
                        <span v-else>vide</span>
                    </template>

                </tabEvaluations>
                <p v-else class="alert alert-info">Aucun historique d'absence trouvé.</p>
            </div>

            <pagination class="pagination1" v-if="Data.length > absencesPageSize" :totalItems="Data.length"
                :pageSize="absencesPageSize" :currentPage="currentAbsencesPage"
                @pageChange="handleAbsencesPageChange" />
        </div>
    </div>

  
</template>

<script setup>
 import sideBarEleve from '@/components/sideBarEleve.vue';
 import topBarEleve from '@/components/topBarEleve.vue';
import { ref, onMounted, computed } from 'vue';
import { getDetailsEleve } from '@/services/EleveService';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getAbsencesEleve } from '@/services/AbsenceService';




const classeEleve_id = ref ([]);
const Data = ref([]); // Historique des absences
const currentAbsencesPage = ref(1); // Page actuelle pour l'historique des absences
const absencesPageSize = ref(5); // Nombre d'éléments par page pour l'historique





 // Récupération des détails de l'élève
 const fetchDetailsEleve = async () => {
    try {
      const response = await getDetailsEleve();
      
      if (response.status === 200) {
        classeEleve_id.value = response.données.classeEleve_id;
        //  console.log('classeEleve_id', classeEleve_id.value);
        await fetchAbsences();
      } else {
        console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    }
  };

const fetchAbsences = async () => {
    try {
        const response = await getAbsencesEleve(classeEleve_id.value);
        if (response.données) {  // Vérifiez si response.données est défini
            // Trier les données du plus récent au plus ancien
            Data.value = response.données
                .map(item => ({
                    ...item,
                    date_absence: new Date(item.date_absence), // Convertir en objet Date pour le tri
                    formattedDate: new Date(item.date_absence).toLocaleDateString('fr-FR') // Format français (dd/MM/yyyy)
                }))
                .sort((a, b) => b.date_absence - a.date_absence); // Trier du plus récent au plus ancien
        } else {
            console.error("Les données d'absence sont vides ou non définies.");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des absences :", error);
    }
};







const handleAbsencesPageChange = (page) => {
    currentAbsencesPage.value = page;
};

const paginatedAbsencesData = computed(() => {
    const start = (currentAbsencesPage.value - 1) * absencesPageSize.value;
    const end = start + absencesPageSize.value;
    return Data.value.slice(start, end);
});

onMounted(() => {
    fetchDetailsEleve();
    fetchAbsences();
});
</script>


<style scoped>
::v-deep .tab-absences_admin td:nth-child(3) {
    display: none;
    /* Masquer la colonne de l'ID */
}

::v-deep .tab-absences_admin td:nth-child(5) {
    display: none;
    /* Masquer la colonne de l'ID */
}

.main-content {
    overflow-x: hidden;
}



.prenom {
    color: #FFCD1E;
}

.retour {
    font-size: 30px;
    color: black;
    margin-left: 300px;
}
.head h1{
    text-align: center; 
    margin-left: 150px;
}
@media (max-width: 1000px) {
   .main-content {
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}
.head {
    gap: 15% ;
}
.head h1{
    margin-left: 0;
    
 }
 .head h1{
    font-size: 24px;
    margin-top: 25px;
    margin-left: -48px;
    text-align: center;
}
.retour {
    
    margin-left: 0;
}
.tableau-absences {
    margin: 0;
  }
}
@media (max-width: 480px) {
    .head{
        margin-top: 20%;
        display: flex;
        align-items: center;
        justify-content: space-around;
       
    }
    .retour {
    
    margin-left: 0;
}
 .head h1{
    margin-left: -150px;
    
 }
 .head h1{
    font-size: 24px;
    margin-top: 25px;
    margin-left: -48px;
    text-align: center;
}
.absences{
    margin-top: 20px;
}

    .tableau-absences {
    margin: 0;
  }
    .main-content {
        margin: 0;
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}}
</style>
