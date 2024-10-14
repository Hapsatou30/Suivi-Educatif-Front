<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <div class="head">
            <router-link to="/gestion_absences_parent">
                <Icon class="retour" icon="formkit:arrowleft" />
            </router-link>
            <h1 >Historiques des absences de <span class="prenom">{{
                    prenom }}</span></h1>
        </div>
        <div class="absences">
            <div class="tableau-absences">
                <tabEvaluations v-if="paginatedAbsencesData.length > 0" class="tab-absences_admin"
                    :headers="['Date d\'absence', 'Matière', 'Motif', 'Justification', 'Action']" :data="paginatedAbsencesData.map(({ formattedDate, classe_prof: { prof_matiere: { matiere } }, justification, id, motif }) => ({
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

                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="openAddModal(row)" style="color: #407CEE;" title="Modifier / Ajouter une justification">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                        </div>
                    </template>

                </tabEvaluations>
                <p v-else class="alert alert-info">Aucun historique d'absence trouvé.</p>
            </div>

            <pagination class="pagination1" v-if="Data.length > absencesPageSize" :totalItems="Data.length"
                :pageSize="absencesPageSize" :currentPage="currentAbsencesPage"
                @pageChange="handleAbsencesPageChange" />
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal"
    style="position: fixed; top: 0; right: 0;  width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;overflow: auto; display: flex;  align-items: center;   justify-content: flex-end; ">
        <div
        style="width: 80%; height: 100%; max-width: 400px; background: white; border-radius: 8px; z-index: 1001; padding: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  overflow-y: auto; display: flex; flex-direction: column; align-items: center;  ">
            <h3 style="margin-bottom: 60px; color: #F7AE00;">{{ isEditing ? 'Modifier Justification' : 'Ajouter Justification' }}</h3>
            <span class="close" @click="closeModal"
                style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>

            <!-- Formulaire -->
            <form @submit.prevent="isEditing ? handleModifierJustification() : handleAjouterJustification()" style=" padding-left: 50px; padding-right: 50px;">
                <!-- Champ de téléchargement de fichier -->
                <div class="form-group" style="margin-top: 20px; margin-bottom: 20px;">
                    <input type="file" id="fileUpload"   @change="handleFileUpload" />
                </div>
                <!-- Champ pour le motif -->
                <div class="form-group" style="margin-top: 20px; margin-bottom: 20px;">
                    <label for="motif">Motif</label>
                    <input type="text" id="motif" v-model="motif" placeholder="Saisir le motif de l'absence"
                        class="form-control" />
                </div>

                <!-- Bouton de soumission -->
                <div class="form-group" style="text-align: right;">
                    <button type="submit"
                        style="background-color: #407CEE; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; width: 200px; font-size: 20px">
                        {{ isEditing ? 'Modifier' : 'Ajouter' }}
                    </button>
                </div>
            </form>
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
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getAbsencesEleve, modifierAbsence } from '@/services/AbsenceService';



const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id);
const prenom = ref('');
const Data = ref([]); // Historique des absences
const currentAbsencesPage = ref(1); // Page actuelle pour l'historique des absences
const absencesPageSize = ref(5); // Nombre d'éléments par page pour l'historique
const showModal = ref(false); // État d'affichage du modal
const isEditing = ref(false); // État de l'édition
const uploadedFile = ref(null); // Référence pour stocker le fichier uploadé
const motif = ref('');
const currentAbsenceId = ref(null); // Référence pour stocker l'ID de l'absence actuelle


const openAddModal = (row) => {
    isEditing.value = true;
    motif.value = row.motif || ''; 
    if (typeof row.justification === 'string') {
        // C'est un fichier déjà stocké, peut-être un lien
        uploadedFile.value = row.justification;
    } else {
        uploadedFile.value = null;
    }
    showModal.value = true;
    currentAbsenceId.value = row.id;
};


// Méthode pour fermer le modal
const closeModal = () => {
    showModal.value = false; // Masquer le modal
};

// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
    try {
        const response = await getDetailsEleve(classeEleve_id.value);
        if (response.status === 200) {
            prenom.value = response.données.prenom;
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

const handleModifierJustification = async () => {
    console.log('Démarrage de la modification de justification');

    console.log('ID d\'absence actuel:', currentAbsenceId.value);
    try {
        const formData = new FormData();
        formData.append('motif', motif.value);
        if (uploadedFile.value) {
            formData.append('justification', uploadedFile.value);
        }

        console.log('Données à envoyer:', formData);

        const response = await modifierAbsence(currentAbsenceId.value, formData); // Passer l'ID ici
        console.log('Réponse de l\'API:', response);

        if (response.status === 200) {
            console.log('Absence modifiée avec succès');
            closeModal();
            fetchAbsences();
        } else {
            console.error('Erreur lors de la modification de l\'absence:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la modification de l\'absence:', error);
    }
};



// Gérer le changement de fichier uploadé
const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Récupère le premier fichier sélectionné
    if (file) {
        uploadedFile.value = file; // Stocke le fichier dans la référence
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
.head h1{
    text-align: center; 
    margin-left: 150px;
}
@media (max-width: 810px) {
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
