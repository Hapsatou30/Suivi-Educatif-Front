<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Cahier de texte de la : {{ nomClasse }}
        </h2>
        <div class="cahiers">
      <div class="tableau1">
        <tabEvaluations 
          v-if="paginatedData.length > 0"
          class="tab-noteMatiere" 
          :headers="['Matière', 'Professeur', 'Date', 'Titre', 'Résumé']"
          :data="paginatedData.map(({ matiere, professeur, date, titre, resume,id, }) => ({
            matiere,
            professeur,
            date,
            titre,
            resume,
            id,
          }))"
        >
        </tabEvaluations>

        <p v-else class="alert alert-info">Pas de cahier de texte.</p>
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
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { getCahierTexte } from '@/services/CahierDeTexte';
// import { Icon } from '@iconify/vue';
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
    const response = await getCahierTexte(anneClasseId);
    console.log('response', response);
    
    tableData.value = response.données.map(item => ({
      matiere: item.matiere,
      professeur: item.professeur,
      date: item.date,
      titre: item.titre,
      resume: item.resume,
      id: item.id ,
    }));
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
    fetchData(); // Récupération des données au démarrage de l'application
       
});
</script>


<style scoped>
  ::v-deep .tab-noteMatiere td:nth-child(6)  { 
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
</style>