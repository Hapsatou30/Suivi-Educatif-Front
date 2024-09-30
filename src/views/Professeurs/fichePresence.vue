<template>
     <sidebarProf />
     <topBarProf />
    <div class="main-content">
        <h2>
            Liste des élèves de la classe de  : {{ nomClasse }}
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
        <div class="retour">
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted , computed} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getEleveClasse} from '@/services/ClasseEleve';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const nomClasse = ref(''); // Nom de la classe
const anneClasseId = route.params.id;
const tableData = ref([]); // Données des eleves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page

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

// Récupération du nom de la classe à partir des paramètres de la route
onMounted(() => {
    if (route.params.nomClasse) {
        nomClasse.value = route.params.nomClasse; // Assignez le nom de la classe
        console.log('Paramètres de la route:', route.params);
    } else {
        console.error('Nom de la classe non trouvé dans les paramètres de la route.');
    }
});

// Méthode pour retourner à la page précédente
const retour = () => {
    router.back(); // Utiliser le routeur pour revenir en arrière
};
// Appel des méthodes dans onMounted
onMounted(() => {
    fetchData(); // Récupérer les données des élèves au chargement de la page
});
</script>



<style>
/* Masquer la colonne ID dans le tableau */
.horaires .tab-evaluations td:nth-child(5),
.horaires .tab-evaluations td:nth-child(6) {
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

.modal {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    /* Arrière-plan semi-transparent */
    z-index: 1000;
    /* Assurez-vous que le modal est bien au-dessus des autres éléments */
}

.modal-content {
    background-color: white;
    margin: 15% auto;
    /* Espacement vertical */
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    /* Largeur du modal */
    z-index: 1001;
}
</style>