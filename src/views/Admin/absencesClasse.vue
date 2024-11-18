<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Les absences du jour pour la classe de: {{ nomClasse }}
        </h2>

        <!-- Tableau pour les absences du jour -->
        <div class="tableau-absences">
            <tabEvaluations v-if="absencesDuJour.length > 0" class="tab-absences_jour"
                :headers="['Prénom & Nom', 'Date d\'absence', 'Matière', 'Motif','Justification']" 
                :data="absencesDuJour.map(({ classe_eleve: { eleve }, date_presence, classe_prof: { prof_matiere: { matiere } }, justification ,motif}) => ({
                    eleve: `${eleve.prenom} ${eleve.nom}`,
                    date_presence,
                    matiere: matiere ? matiere.nom : 'Non spécifié',
                    justification: justification ? `https://suivieducatifapi.thiamhapstou.simplonfabriques.com//storage//` + justification : 'vide',
                    motif: motif || 'vide',  
                }))">
                <template #justification="{ justification }">
                    <span v-if="justification !== 'vide'">
                        <a :href="justification" target="_blank">Voir les justifications</a>
                    </span>
                    <span v-else>vide</span>
                </template>
            </tabEvaluations>
            <p v-else class="alert alert-info">Aucune absence du jour trouvée.</p>
        </div>

        <div class="absences">
            <h2 style=" margin-bottom: 50px;">Historique des Absences</h2>
            <div class="tableau-absences">
                <tabEvaluations v-if="paginatedAbsencesData.length > 0" class="tab-absences_admin"
                    :headers="['Prénom & Nom', 'Date d\'absence', 'Matière','Motif', 'Justification']" 
                    :data="paginatedAbsencesData.map(({ classe_eleve: { eleve }, date_absence, classe_prof: { prof_matiere: { matiere } }, justification ,motif}) => ({
                        eleve: `${eleve.prenom} ${eleve.nom}`,
                        date_absence,
                        matiere: matiere ? matiere.nom : 'Non spécifié',
                        justification: justification ? `https://suivieducatifapi.thiamhapstou.simplonfabriques.com//storage//` + justification : 'vide',
                        motif: motif || 'vide',  // Affiche 'vide' si motif est vide
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
import { getAbsenceAnneeClasse } from '@/services/AbsenceService';
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
const Data = ref([]); // Historique des absences
const currentAbsencesPage = ref(1); // Page actuelle pour l'historique des absences
const absencesPageSize = ref(5); // Nombre d'éléments par page pour l'historique

// Méthode pour filtrer les absences du jour
const absencesDuJour = computed(() => {
    const today = dayjs().format('YYYY-MM-DD'); 
    return Data.value.filter(absence => absence.date_absence === today);
});


// Récupérer les absences d'une classe
const fetchAbsences = async () => {
    try {
        const response = await getAbsenceAnneeClasse(anneClasseId);
        Data.value = response.data;
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
    fetchAbsences();
});
</script>


<style scoped>
::v-deep .tab-noteMatiere td:nth-child(7) {
    display: none;
    /* Masquer la colonne de l'ID */
}
::v-deep .tab-absences_admin td:nth-child(4) {
    display: none;
    /* Masquer la colonne de l'ID */
}
.main-content {
    margin-top: 120px;
    background-color: #FAFAF7;
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
@media (max-width: 992px) {
  .main-content {
 width: 125%;
 margin-left: -12%;
 margin-top: -22%;
  
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
.tableau-absences {
  margin-left: 50px;
}
.classes {
  margin-top: 0px;
}

}
@media (max-width: 768px) {
  .main-content {
    width: 95%;
 margin-top: -12%;
 margin-left: auto;
 margin-right: auto;
  
}
.lien_boutons{
    margin-left: -50px;
  
}
}
@media (max-width: 576px) {
  .main-content {
width: 83%;
 margin-left: 12%;
 margin-top: 100px;
  
}
.main-content h2 {
  font-size: 18px;
  text-align: center;
  width: 82%;
}
.search-container input {
 display: flex;
 align-items: center;
 justify-content: center;
  width: 100%;
}
.absences {
  width: 100%;
  margin-left: -5%;
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
 margin-top: 180px;
  
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