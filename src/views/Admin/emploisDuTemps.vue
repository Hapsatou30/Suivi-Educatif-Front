<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Gestion des horaires pour la classe de : {{ nomClasse }}
        </h2>

        <!-- Modal -->
        <div v-if="showModal"
            style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div
                style="position: relative; width: 90%; max-width: 500px; padding: 20px; background: white; border-radius: 8px; z-index: 1001; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <h3>{{ isEditing ? 'Modifier Horaire' : 'Ajouter Horaire' }}</h3>
                <span class="close" @click="closeModal"
                    style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>

                <!-- Formulaire -->
                <form @submit.prevent="isEditing ? handleModifierHoraire() : handleAjouterHoraire()">
                    <!-- Champ Jour -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="jour" style="display: block; margin-bottom: 5px;">Jour:</label>
                        <select id="jour" v-model="horaire.jour" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <option value="" disabled>Choisissez un jour</option>
                            <option value="Lundi">Lundi</option>
                            <option value="Mardi">Mardi</option>
                            <option value="Mercredi">Mercredi</option>
                            <option value="Jeudi">Jeudi</option>
                            <option value="Vendredi">Vendredi</option>
                        </select>
                    </div>


                    <!-- Champ Heure de début -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="heure_debut" style="display: block; margin-bottom: 5px;">Heure de début:</label>
                        <input type="time" id="heure_debut" v-model="horaire.heure_debut" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
                    </div>

                    <!-- Champ Heure de fin -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="heure_fin" style="display: block; margin-bottom: 5px;">Heure de fin:</label>
                        <input type="time" id="heure_fin" v-model="horaire.heure_fin" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
                    </div>

                    <!-- Champ classe_prof_id (caché) -->
                    <input type="hidden" v-model="horaire.classe_prof_id" />

                    <!-- Bouton de soumission -->
                    <div class="form-group" style="text-align: right;">
                        <button type="submit"
                            style="background-color: #4862C4; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
                            {{ isEditing ? 'Modifier' : 'Ajouter' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>



        <div class="horaires">
            <div class="tableau1">
                <tabEvaluations v-if="paginatedData.length > 0" class="tab-evaluations"
                    :headers="['Matière', 'Professeur', 'Horaire', 'Jour', 'Action']" :data="paginatedData.map(({ matiere, professeur, horaire, jour, horaire_id, classe_prof_id }) => ({
                        matiere,
                        professeur,
                        horaire,
                        jour,
                        horaire_id,
                        classe_prof_id
                    }))">
                    <template #actions="{ row }">
                        <div class="boutons">
                            <button class="btn" @click="editAnnee(row)" style="color: #4862C4;"
                                title="Ajouter / Modifier une horaire">
                                <Icon icon="mdi:pencil-outline" />
                            </button>

                            <button class="btn" @click="deleteAnnee(row.horaire_id)" style="color: red;"
                                title="Supprimer l'horaire">
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
import { geHoraireClasse, ajouterHoraire, modifierHoraire } from '@/services/HoraireService';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const nomClasse = ref('');
const anneClasseId = route.params.id;
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(5);
const showModal = ref(false);
const isEditing = ref(false);
const horaire = ref({ jour: '', heure_debut: '', heure_fin: '', classe_prof_id: '' });

// Méthode pour ouvrir le modal
const editAnnee = (row) => {
    // Si un horaire est déjà défini, pré-remplir les champs pour la modification
    if (row.horaire_id) {
        horaire.value = {
            jour: row.jour,
            heure_debut: row.horaire.split(' - ')[0], // extraction de l'heure de début
            heure_fin: row.horaire.split(' - ')[1],   // extraction de l'heure de fin
            classe_prof_id: row.classe_prof_id,
            horaire_id: row.horaire_id 
        };
        isEditing.value = true; // Activer le mode édition
    } else {
        // Sinon, c'est un nouvel ajout
        horaire.value = {
            jour: '',
            heure_debut: '',
            heure_fin: '',
            classe_prof_id: row.classe_prof_id
        };
        isEditing.value = false; // Désactiver le mode édition
    }
    showModal.value = true; // Afficher le modal
};


// Méthode pour fermer le modal
const closeModal = () => {
    showModal.value = false; // Cacher le modal
    // Réinitialiser le formulaire
    horaire.value = { jour: '', heure_debut: '', heure_fin: '', classe_prof_id: '' };
};

const handleAjouterHoraire = async () => {
    try {
        // Vérifiez que tous les champs sont remplis
        if (horaire.value.jour && horaire.value.heure_debut && horaire.value.heure_fin) {
            await ajouterHoraire(horaire.value);
            closeModal(); // Fermez le modal après l'ajout
            getHorairesClasse(anneClasseId); // Rechargez les horaires
        } else {
            console.error('Veuillez remplir tous les champs.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'horaire:', error);
    }
};
const handleModifierHoraire = async () => {
    try {
        const { jour, heure_debut, heure_fin, horaire_id } = horaire.value;
        console.log('horaire.value:', horaire.value);

        // Vérifiez que tous les champs sont remplis et que l'ID n'est pas undefined
        if (jour && heure_debut && heure_fin && horaire_id) {
            await modifierHoraire(horaire.value);
            closeModal(); // Fermez le modal après la modification
            getHorairesClasse(anneClasseId); // Rechargez les horaires
        } else {
            console.error('Veuillez remplir tous les champs avec des valeurs valides et vérifier que l\'ID de l\'horaire est défini.');
        }
    } catch (error) {
        console.error('Erreur lors de la modification de l\'horaire:', error);
    }
};



// Méthode pour récupérer les détails d'une année
const detailsAnneeClasse = async (id) => {
    try {
        const response = await getAnneeClasseDetails(id);
        if (response && response.donnees_classe) {
            const classe = response.donnees_classe;
            nomClasse.value = `${classe.nom}`;
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