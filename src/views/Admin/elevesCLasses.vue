<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Liste des eleves de la classe: {{ nomClasse }}
        </h2>
        <div class="eleves">
            <h3>Liste des eleves</h3>
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-eleves"
                    :headers="['Prénom & Nom', 'Matricule', 'Nom_Parent', 'Téléphone']" :data="paginatedData.map(({ prenom, nom, matricule, nom_parent, parent, parent_telephone,id
                     }) => ({
                        nom: `${prenom} ${nom}`,
                        matricule,
                        parent,
                        parent_telephone,
                        id
                    }))">
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucun élève trouvé.</p>
            </div>

            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>
        <div class="button-container" style="display: flex; justify-content: end;">
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { getEleveClasse} from '@/services/ClasseEleve';


const router = useRouter();
const route = useRoute();


const nomClasse = ref('');
const anneClasseId = route.params.id;
const tableData = ref([]); // Données des eleves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const currentStep = ref(1);

const fetchData = async () => {
    try {
        const response = await getEleveClasse(anneClasseId);

        // Trouver la classe qui correspond à l'ID
        const classeCible = response.données.find(classe => classe.id === parseInt(anneClasseId));
        

        const elevesClasse = [];

        if (classeCible && classeCible.eleves) {
            classeCible.eleves.forEach(eleve => {
                elevesClasse.push({
                    id: eleve.id,
                    prenom: eleve.prenom,
                    nom: eleve.nom,
                    matricule: eleve.matricule,
                    parent: eleve.parent,
                    parent_telephone: eleve.parent_telephone
                });
            });
        }

        tableData.value = elevesClasse;
        tableData.value.sort((a, b) => a.nom.localeCompare(b.nom));

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
};



// Méthode pour changer de page dans la pagination
const handlePageChange = (page) => {
    currentPage.value = page; // Mettre à jour la page actuelle
};

// Calculer les données paginées à afficher
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value; // Calculer l'index de début
    const end = start + pageSize.value; // Calculer l'index de fin
    return tableData.value.slice(start, end); // Retourner les données pour la page actuelle
});

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



// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};

// Appel des méthodes dans onMounted
onMounted(() => {
    console.log('ID de la classe:', anneClasseId);
    detailsAnneeClasse(anneClasseId);
    fetchData(); // Récupérer les données des élèves au chargement de la page
});
</script>

<style scoped>
.main-content {
    background-color: white;
    min-height: 100vh;
    /* S'assure que la section couvre au moins 100% de la hauteur de la fenêtre */
    padding-top: 150px;
    margin-top: 0;
    overflow-x: hidden;

}

.button-container {
    margin-left: 300px;
    margin-right: 50px;
    display: flex;
    justify-content: space-between;
    /* Centrer les boutons */
    margin-top: 20px;
    /* Espacement au-dessus des boutons */
}

.button-container .btn-custom {
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
    margin-bottom: 30px;
}

.button-container .btn-secondary,
.button-container .btn-secondary:hover {
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