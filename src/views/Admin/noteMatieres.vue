<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Les notes par matières pour la classe de : {{ nomClasse }}
        </h2>
        <div class="classes">

            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-noteMatiere"
                    :headers="['Professeur', 'Matière ', 'Note',]" :data="paginatedData.map(({ nom_professeur, prenom_professeur, matiere ,id_classeProf}) => ({
                        professeur: `${prenom_professeur} ${nom_professeur}`,
                        matiere,
                        id_classeProf
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn " @click="redirectToNotes(row.id_classeProf, row.matiere)"
                                style="color: #407CEE; font-size: 40px;" title="Voir les notes par matières">
                                <Icon icon="marketeq:eye" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>

                <p v-else class="alert alert-info">
                    Aucun professeur trouvé.
                </p>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { getProfClasse } from '@/services/ClasseProfs';
import { Icon } from '@iconify/vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';

const router = useRouter();
const route = useRoute();

const nomClasse = ref('');
const anneClasseId = route.params.anneeClasse_id;

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);


const fetchData = async () => {
    try {
        const response = await getProfClasse(anneClasseId);

        // Vérifiez si la réponse contient des données et que c'est un tableau non vide
        if (response && Array.isArray(response.data) && response.data.length > 0) {
            // Extraire les informations et les assigner à tableData
            tableData.value = response.data.map(({ nom_prof, prenom_prof, matiere, id_classeProf }) => ({
                nom_professeur: nom_prof,
                prenom_professeur: prenom_prof,
                matiere,
                id_classeProf,
            }));
        } else {
            // Si pas de données, affichez un message approprié
            console.log('Aucun professeur ou matière trouvé pour cette classe.');
            tableData.value = []; // Réinitialiser si pas de données
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
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
const redirectToNotes = (id_classeProf, matiere) => {
    // console.log('id et matiere', id_classeProf, matie 
    
    // Redirige vers la page notes avec l'id et le nom de la matière dans les paramètres de l'URL
    router.push({ name: 'notes', params: { id_classeProf, matiere } });
};


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
    fetchData();
});
</script>


<style scoped>
  ::v-deep .tab-noteMatiere td:nth-child(3)  { 
    display: none; /* Masquer la colonne de l'ID */
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
width: 135%;
margin-left: -13%;
 margin-top: 70px;  
}
  .main-content h2 {
  margin-left: 0px;
  margin-bottom: 50px;
  text-align: center;
  margin-left: -8%;
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
 width: 130%;
 margin-left: -10%;
 margin-top: 150px;
  
}
}
@media (max-width: 576px) {
  .main-content {
width: 85%;
 margin-left: 12%;
 margin-top: 200px;
  
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
}
@media (max-width: 390px) {
  .main-content {
width: 80%;
 margin-left: 15%;
 margin-top: 270px;
  
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