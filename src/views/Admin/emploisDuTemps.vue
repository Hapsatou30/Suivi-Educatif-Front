<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Gestion des horaires pour la classe de :  {{ nomClasse }}
        </h2>
        <div class="horaires">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-evaluations"
                    :headers="['Matière', 'Professeur', 'Horaire', 'Jour', 'Action']" 
                    :data="paginatedData.map(({ matiere, professeur, horaire, jour, horaire_id }) => ({
                        matiere,
                        professeur,
                        horaire,
                        jour,
                        horaire_id 
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn " @click="editAnnee(row.horaire_id)" style=" color: #4862C4;" title="Modifier l'horaire">
                                <Icon icon="mdi:pencil-outline" />
                            </button>
                            <button class="btn " @click="deleteAnnee(row.horaire_id)" style="color: red;" title="Supprimer l'horaire">
                                <Icon icon="mdi:trash-can-outline" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune horaire trouvée.</p>
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
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { geHoraireClasse } from '@/services/HoraireService';
import {  getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const nomClasse = ref('');
const anneClasseId = route.params.id;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);

// Méthode pour récupérer les détails d'une année
const detailsAnneeClasse = async (id) => {
  try {
    const response = await getAnneeClasseDetails(id);
    console.log('Réponse API brute:', response); 

    // Vérification si response contient un objet valide
    if (response && response.donnees_classe) { // Corrigé ici pour accéder à 'donnees_classe'
      const classe = response.donnees_classe; // Corrigé ici pour accéder à 'donnees_classe'
      console.log('Détails de la classe:', classe);
      nomClasse.value = `${classe.nom}`; // Mise à jour de la variable ici
    } else {
      console.error('Aucun détail de la classe trouvé ou structure inattendue.');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la classe :', error);
  }
};
// Méthode pour récupérer les horaires
const getHorairesClasse = async (id) => {
  try {
    const response = await geHoraireClasse(id);
    console.log('Horaires reçus :', response); 

    // Mise à jour des données du tableau avec les horaires reçus
    tableData.value = response.données;
  } catch (error) {
    console.error('Erreur lors de la récupération des horaires :', error);
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

// Appel des méthodes dans onMounted
onMounted(() => {
  console.log('ID de la classe:', anneClasseId);
  detailsAnneeClasse(anneClasseId);
  getHorairesClasse(anneClasseId); // Récupération des horaires
});
  // Méthode pour retourner à la page précédente
  const retour = () => {
    router.back();
  };
</script>


<style>
/* Masquer la colonne ID dans le tableau */
.tab-evaluations td:nth-child(5) {
    display: none;
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
    width: 395px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 58px;
}

input::placeholder {
    color: #ccc;
    font-size: 12px;
}

.bouton {
    display: flex;
    justify-content: end;
}

.bouton .btn-submit {
    background-color: #407CEE;
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
    background-color: #365F9B;
    /* Change la couleur au survol */
}

.horaires {
    margin-top: 50px;
    margin-left: 300px;
    margin-right: 50px;


}

.horaires h3 {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: start;
}

.horaires .tableau1 {
    margin-right: 50px;
    width: 100%;

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
.retour{
  display: flex;
  justify-content: end;
  margin-right: 50px;
  margin-bottom: 20px;
  margin-top: 50px;
}
.retour .btn-secondary, .retour .btn-secondary:hover {
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
</style>