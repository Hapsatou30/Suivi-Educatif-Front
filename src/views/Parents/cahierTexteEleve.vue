<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <div class="head">
            <router-link to="/gestion_cahier_texte_parent">
                <Icon class="retour" icon="formkit:arrowleft" />
            </router-link>
            <h1 style="text-align: center; margin-left: 100px;">Le cahier de texte de la classe de <span
                    class="prenom">{{ prenom }}</span></h1>
        </div>
        <div class="cahiers">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-noteMatiere"
                    :headers="['Matière', 'Professeur', 'Date', 'Titre', 'Résumé', 'Ressource']" :data="paginatedData.map(({ matiere, professeur, date, titre, resume, ressources, id }) => ({
                        matiere,
                        professeur,
                        date,
                        titre,
                        resume,
                        ressources,
                        id,
                    }))">
                    <template #resources="{ ressources }">
                        <a v-if="ressources" :href="ressources" target="_blank">Voir les ressources</a>
                    </template>
                </tabEvaluations>


                <p v-else class="alert alert-info">Pas de cahier de texte.</p>
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
            date: item.date,
            titre: item.titre,
            resume: item.resume,
            ressources: item.ressources,
            id: item.id,
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

onMounted(async () => {
    await fetchDetailsEleve();
    await fetchData();
});

</script>

<style scoped>
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
    font-size: 24px;
    margin-top: 25px;
    text-align: justify;
    
}
.cahiers{
    margin-top: 20px;
}

    .tableau1 {
    margin: 0;
  }
    .main-content {
        margin: 0;
    width: 90%;
    margin-left: auto !important;
    margin-right: auto !important;
}}
</style>
