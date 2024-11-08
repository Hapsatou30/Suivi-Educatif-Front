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
                    :headers="['Photo', 'Prénom & Nom', 'Matricule', 'Absence']" :data="paginatedData.map(({ photo, prenom, nom, matricule, id, absent }) => ({
                        photo,
                        eleve: `${prenom} ${nom}`,
                        matricule,
                        id,
                        absent
                    }))">

                    <!-- Affichage des photos -->
                    <template #photo="{ photo }">
                        <img :src="photo" alt="Photo de l'élève" width="50" height="50" style="border-radius: 50%;" />
                    </template>

                    <!-- Affichage des cases à cocher pour l'absence -->
                    <template #actions="{ row }">
                        <input type="checkbox" :id="`select-classe-${row.id}`" :checked="row.absent"
                            @change="handleCheckboxChange(row.id, $event.target.checked)" title="Marquer comme absent"
                            style="width: 30px;" />
                    </template>

                </tabEvaluations>

                <p v-else class="alert alert-info">Aucun élève trouvé.</p>
            </div>

            <!-- Pagination -->
            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>

        <!-- Section pour afficher l'historique des absences -->
        <div class="absences">
            <h2 style=" margin-bottom: 50px;">Historique des Absences</h2>
            <div class="tableau-absences">
                <tabEvaluations v-if="paginatedAbsencesData.length > 0" class="tab-absences"
                    :headers="['Prénom & Nom', 'Date d\'absence', 'Motif','Justification']" :data="paginatedAbsencesData.map(({ classe_eleve: { eleve }, date_absence, justification, motif,id }) => ({
                        eleve: `${eleve.prenom} ${eleve.nom}`,
                        date_absence,
                        justification: justification ? `http://127.0.0.1:8000/storage//` + justification : 'vide',
                        motif: motif || 'vide', 
                        id
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
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';
import tabEvaluations from '@/components/tabEvaluations.vue';
import pagination from '@/components/paginations.vue';
import { getEleveClasse } from '@/services/ClasseEleve';
import { postAbsences, supprimerAbsence, getAbsenceClasseProf } from '@/services/AbsenceService';
import Swal from 'sweetalert2';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const tableData = ref([]); // Données des élèves
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;
const Data = ref([]); // Historique des absences
const currentAbsencesPage = ref(1); // Page actuelle pour l'historique des absences
const absencesPageSize = ref(5); // Nombre d'éléments par page pour l'historique


// Récupération des données des élèves
const fetchData = async () => {
    try {
        // Récupérer les élèves de la classe
        const response = await getEleveClasse(annee_classe_id);
        // console.log('Réponse de getEleveClasse:', response); // Log de la réponse

        // Assurez-vous que annee_classe_id est bien un entier
        // console.log('annee_classe_id:', annee_classe_id);

        // Filtrer les données en fonction de id_classe
        const classeCible = response.données.find(classe => classe.id_classe === parseInt(annee_classe_id));
        // console.log('Classe cible:', classeCible); // Log de la classe cible

        const elevesClasse = [];
        const today = new Date().toISOString().split('T')[0]; // Date d'aujourd'hui au format yyyy-mm-dd

        if (classeCible && classeCible.eleves) {
            // console.log('Élèves dans la classe cible:', classeCible.eleves); // Log des élèves

            // Récupérer l'historique des absences d'aujourd'hui
            const absencesToday = Data.value.filter(absence => absence.date_absence === today);
            // console.log('Absences Today:', absencesToday); // Log des absences

            classeCible.eleves.forEach(eleve => {
                // Vérifier si cet élève est absent aujourd'hui et récupérer son absenceId
                const absence = absencesToday.find(abs => abs.classe_eleve.id === eleve.id_classeEleve);
                const isAbsentToday = !!absence; // Vérifie si une absence existe pour aujourd'hui

                elevesClasse.push({
                    id: eleve.id_classeEleve,
                    prenom: eleve.prenom,
                    nom: eleve.nom,
                    matricule: eleve.matricule,
                    date_naissance: eleve.date_naissance,
                    photo: eleve.photo ? `http://127.0.0.1:8000/storage/${eleve.photo}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s',
                    absent: isAbsentToday, // Si l'élève est absent aujourd'hui, cocher la case
                    absenceId: isAbsentToday ? absence.id : null, // Stocker l'ID de l'absence pour la suppression
                });
            });
        } else {
            console.warn('Aucun élève trouvé pour la classe cible.'); // Avertir si aucun élève n'est trouvé
        }

        tableData.value = elevesClasse;
        
        tableData.value.sort((a, b) => a.nom.localeCompare(b.nom));
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
};



// Fonction de gestion des cases à cocher
const handleCheckboxChange = (eleveId, isAbsent) => {
    const eleve = tableData.value.find(eleve => eleve.id === eleveId);
console.log('eleve: ', eleve);


    if (eleve) {
        if (isAbsent && !eleve.absent) {
            postAbsences({
                status: "absent",
                classe_eleve_id: eleveId,
                classe_prof_id: classeProf_id,
            }).then(response => {
                eleve.absenceId = response.data.id;
                eleve.absent = true;
                console.log({
    status: "absent",
    classe_eleve_id: eleveId, // Vérifiez si cet ID est correct
    classe_prof_id: classeProf_id,
});

                Swal.fire({
                    icon: 'success',
                    title: `L'absence de l'élève ${eleve.prenom} ${eleve.nom} a été enregistrée.`,
                    showConfirmButton: false,
                    timer: 1500
                });
                // Mettre à jour l'historique après ajout de l'absence
                fetchAbsences().then(() => fetchData());
            }).catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: `Une erreur est survenue lors de l'enregistrement.`,
                });
            });
        } else if (!isAbsent && eleve.absent) {  // Supprimer une absence
            if (eleve.absenceId) {
                supprimerAbsence(eleve.absenceId).then(() => {
                    delete eleve.absenceId;
                    eleve.absent = false;
                    Swal.fire({
                        icon: 'success',
                        title: `L'absence de l'élève ${eleve.prenom} ${eleve.nom} a été annulée.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // Mettre à jour l'historique après ajout de l'absence
                    fetchAbsences().then(() => fetchData());
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

// Récupérer les absences d'une classe
const fetchAbsences = async () => {
    try {
        const response = await getAbsenceClasseProf(classeProf_id);
        Data.value = response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des absences :", error);
    }
};

// Méthode pour changer de page dans la pagination
const handlePageChange = (page) => {
    currentPage.value = page;
};


// Calculer les données paginées
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.value.slice(start, end);
});

// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};
const handleAbsencesPageChange = (page) => {
    currentAbsencesPage.value = page;
};

const paginatedAbsencesData = computed(() => {
    const start = (currentAbsencesPage.value - 1) * absencesPageSize.value;
    const end = start + absencesPageSize.value;
    return Data.value.slice(start, end);
});

// Appel des méthodes au montage du composant
onMounted(() => {
    fetchAbsences().then(() => {
        fetchData();
    });
});

</script>



<style>
/* Masquer la colonne ID dans le tableau */
.eleves .tableau .tab-eleves td:nth-child(2) {
    display: none;
}

.eleves .tableau .tab-eleves td:nth-child(6) {
    display: none;
}

.absences .tableau-absences .tab-absences td:nth-child(3) {
    display: none;
}
.absences .tableau-absences .tab-absences td:nth-child(5) {
    display: none;
}


.tableau-absences {
    margin-left: 300px;
    margin-right: 50px;
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

.absences {
    margin-top: 100px;
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