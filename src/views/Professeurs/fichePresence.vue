<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content">
        <h2>
            Liste des élèves de la classe de : {{ nom_classe }}
        </h2>
        <div class="eleves">
            <div class="tableau">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-eleves"
                    :headers="['Photo', 'Prénom & Nom', 'Matricule', 'Absence']" 
                    :data="paginatedData.map(({ photo, prenom, nom, matricule, date_naissance , id}) => ({
                        photo,
                        eleve: `${prenom} ${nom}`,
                        matricule,
                        date_naissance,
                        id
                    }))">
                    <template #photo="{ photo }">
                        <img :src="photo" alt="Photo de l'élève" width="50" height="50" style="border-radius: 50%;" />
                    </template>

                    <template #actions="{ row }">
                        <input type="checkbox" :id="`select-classe-${row.id}`" :checked="row.absent"
                        @change="handleCheckboxChange(row.id, $event.target.checked)" 
                        title="Marquer comme absence" style="width: 30px;" />

                </template>

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
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getEleveClasse } from '@/services/ClasseEleve';
import { postAbsences,supprimerAbsence } from '@/services/AbsenceService';
import Swal from 'sweetalert2';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const tableData = ref([]); // Données des eleves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;

const fetchData = async () => {
    try {
        const response = await getEleveClasse(annee_classe_id);
        const classeCible = response.données.find(classe => classe.id === parseInt(annee_classe_id));
        const elevesClasse = [];

        if (classeCible && classeCible.eleves) {
            classeCible.eleves.forEach(eleve => {
                elevesClasse.push({
                    id: eleve.id,
                    prenom: eleve.prenom,
                    nom: eleve.nom,
                    matricule: eleve.matricule,
                    date_naissance: eleve.date_naissance,
                    photo: eleve.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s',
                    absent: false, 
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


// Méthode pour retourner à la page précédente
const retour = () => {
    router.back(); // Utiliser le routeur pour revenir en arrière
};
// Appel des méthodes dans onMounted
onMounted(() => {
    fetchData(); // Récupérer les données des élèves au chargement de la page
});

const handleCheckboxChange = (eleveId, isAbsent) => {
    const eleve = tableData.value.find(eleve => eleve.id === eleveId);
    
    if (eleve) {
        console.log(`Checkbox clicked for eleveId: ${eleveId}, isAbsent: ${isAbsent}, current absent state: ${eleve.absent}`);

        if (isAbsent && !eleve.absent) {  // Ajouter l'absence
            postAbsences({
                date_absence: new Date().toISOString().split('T')[0],
                status: "absent",
                classe_eleve_id: eleveId,
                classe_prof_id: classeProf_id,
            }).then(response => {
                eleve.absenceId = response.data.id;
                eleve.absent = true;
                Swal.fire({
                    icon: 'success',
                    title: `L'absence de l'élève ${eleve.prenom} ${eleve.nom} a été enregistrée.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }).catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: `Une erreur est survenue lors de l'enregistrement.`,
                });
            });
        } else if (!isAbsent && eleve.absent) {  // Supprimer l'absence
            if (eleve.absenceId) {
                console.log('supprimer : ', eleve.absenceId);  // Vérifiez que cette ligne est affichée
                supprimerAbsence(eleve.absenceId).then(() => {
                    delete eleve.absenceId;
                    eleve.absent = false;
                    Swal.fire({
                        icon: 'success',
                        title: `L'absence de l'élève ${eleve.prenom} ${eleve.nom} a été annulée.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erreur',
                        text: `Une erreur est survenue lors de la suppression de l'absence.`,
                    });
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Aucune absence à annuler',
                    text: `L'élève ${eleve.prenom} ${eleve.nom} n'a pas d'absence enregistrée.`,
                });
            }
        }
    }
};






</script>



<style>
/* Masquer la colonne ID dans le tableau */
.eleves .tableau .tab-eleves td:nth-child(2) {
    display: none;
}
.eleves .tableau .tab-eleves td:nth-child(6) {
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
</style>