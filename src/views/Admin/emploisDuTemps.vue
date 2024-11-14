<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Gestion des horaires pour la classe de : {{ nomClasse }}
        </h2>

        <!-- Bouton pour ouvrir le modal d'ajout -->
        <div style="text-align: right; margin-bottom: 20px;" class="btn">
            <button @click="openAddModal"
                style="background-color: #F7AE00; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; margin-right: 50px; font-size: 24px;">
                Ajouter un horaire
            </button>
        </div>


        <!-- Modal -->
        <div v-if="showModal" class="modal" :class="{
            'modal-enter': !isEditing,
            'modal-leave': isEditing
        }" style="position: fixed; top: 0; right: 0;  width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;overflow: auto; display: flex;  align-items: center;   justify-content: flex-end; "
            :style="{ transform: showModal ? 'translateX(0)' : 'translateX(100%)' }">
            <div
                style="width: 80%; height: 100%; max-width: 400px; background: white; border-radius: 8px; z-index: 1001; padding: 20px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  overflow-y: auto;">
                <h3 style="margin-bottom: 60px; color: #F7AE00;">{{ isEditing ? 'Modifier Horaire' : 'Ajouter Horaire' }}</h3>
                <span class="close" @click="closeModal"
                    style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer;">&times;</span>

                <form @submit.prevent="isEditing ? handleModifierHoraire() : handleAjouterHoraire()">
                    <div class="form-group" style="margin-bottom: 30px;">
                        <label for="classe_prof_id" style="display: block; margin-bottom: 5px;">Professeur et
                            Matière:</label>
                        <select id="classe_prof_id" v-model="horaire.classe_prof_id" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="" disabled>Choisissez un professeur et une matière</option>
                            <option v-for="prof in uniqueProfesseursMatieres" :key="prof.classe_prof_id"
                                :value="prof.classe_prof_id">
                                {{ prof.professeur }} -> {{ prof.matiere }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 30px;">
                        <label for="jour" style="display: block; margin-bottom: 5px;">Jour:</label>
                        <select id="jour" v-model="horaire.jour" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="" disabled>Choisissez un jour</option>
                            <option value="Lundi">Lundi</option>
                            <option value="Mardi">Mardi</option>
                            <option value="Mercredi">Mercredi</option>
                            <option value="Jeudi">Jeudi</option>
                            <option value="Vendredi">Vendredi</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 30px;">
                        <label for="heure_debut" style="display: block; margin-bottom: 5px;">Heure de début:</label>
                        <select id="heure_debut" v-model="horaire.heure_debut" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="">Sélectionnez l'heure de début</option>
                            <option value="08:00">08:00</option>
                            <option value="10:15">10:15</option>
                            <option value="12:15">12:15</option>
                            <option value="14:15">14:15</option>
                            <option value="16:15">16:15</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 30px;">
                        <label for="heure_fin" style="display: block; margin-bottom: 5px;">Heure de fin:</label>
                        <select id="heure_fin" v-model="horaire.heure_fin" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="">Sélectionnez l'heure de fin</option>
                            <option value="10:00">10:00</option>
                            <option value="12:00">12:00</option>
                            <option value="14:00">14:00</option>
                            <option value="16:00">16:00</option>
                            <option value="18:00">18:00</option>
                        </select>
                    </div>
                    <input type="hidden" v-model="horaire.classe_prof_id" />
                    <div class="form-group" style="text-align: right;">
                        <button type="submit"
                            style="background-color: #407CEE; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; width: 200px; font-size: 20px">
                            {{ isEditing ? 'Modifier' : 'Ajouter' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>



        <!-- Tableau des horaires -->
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
                            <!-- Bouton de modification -->
                            <button class="btn" @click="editHoraire(row)" style="color: #407CEE;"
                                title="Modifier l'horaire">
                                <Icon icon="mdi:pencil-outline" />
                            </button>

                            <!-- Bouton de suppression -->
                            <button class="btn" @click="supprimerHoraires(row.horaire_id)" style="color: red;"
                                title="Supprimer l'horaire">
                                <Icon icon="mdi:trash-can-outline" />
                            </button>
                        </div>
                    </template>
                </tabEvaluations>
                <p v-else class="no-evaluations-message">Aucune horaire trouvée.</p>
            </div>

            <!-- Pagination -->
            <pagination class="pagination1" v-if="tableData.length > pageSize" :totalItems="tableData.length"
                :pageSize="pageSize" :currentPage="currentPage" @pageChange="handlePageChange" />
        </div>

        <!-- Bouton de retour -->
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
import { geHoraireClasse, ajouterHoraire, modifierHoraire, supprimerHoraire } from '@/services/HoraireService';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2'; // Importer SweetAlert2

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();

// Variables réactives
const nomClasse = ref(''); // Nom de la classe
const anneClasseId = route.params.id; // ID de l'année de la classe récupéré à partir de la route
const tableData = ref([]); // Données des horaires
const currentPage = ref(1); // Page actuelle de la pagination
const pageSize = ref(5); // Nombre d'éléments par page
const showModal = ref(false); // État d'affichage du modal
const isEditing = ref(false); // État de l'édition
const horaire = ref({ jour: '', heure_debut: '', heure_fin: '', classe_prof_id: '' }); // Données de l'horaire

// Méthode pour ouvrir le modal d'édition ou d'ajout d'horaire
const editHoraire = (row) => {
    if (row.horaire_id) {
        // Si l'horaire existe, pré-remplir les champs
        const horaires = row.horaire.split(' - '); // Diviser la chaîne en heures
        const heureDebut = horaires[0]; // Heure de début
        const heureFin = horaires[1]; // Heure de fin

        // Assurez-vous que les heures sont au format correct si nécessaire
        horaire.value = {
            jour: row.jour,
            heure_debut: formatTime(heureDebut), // Formatage si nécessaire
            heure_fin: formatTime(heureFin),     // Formatage si nécessaire
            classe_prof_id: row.classe_prof_id,
            horaire_id: row.horaire_id
        };
        isEditing.value = true; // Mode édition
    } else {
        // Sinon, initialiser pour un nouvel horaire
        horaire.value = { jour: '', heure_debut: '', heure_fin: '', classe_prof_id: row.classe_prof_id };
        isEditing.value = false; // Mode ajout
    }
    showModal.value = true; // Ouvrir le modal
};

// Fonction de formatage de l'heure
const formatTime = (time) => {
    // Vérifiez si le format est déjà correct (H:i:ss), 
    const parts = time.split(':');
    if (parts.length === 3) {
        return `${parts[0]}:${parts[1]}`; // Retourne juste l'heure et les minutes
    }
    return time; // Retourne tel quel si le format est correct
};


// Ouvrir le modal pour l'ajout d'un horaire
const openAddModal = () => {
    horaire.value = { jour: '', heure_debut: '', heure_fin: '', classe_prof_id: '' };
    isEditing.value = false;
    showModal.value = true;
};


// Méthode pour fermer le modal
const closeModal = () => {
    showModal.value = false; // Masquer le modal
    horaire.value = { jour: '', heure_debut: '', heure_fin: '', classe_prof_id: '' }; // Réinitialiser les données de l'horaire
};
const uniqueProfesseursMatieres = computed(() => {
    //Un Set est une structure de données JavaScript qui ne permet de stocker que des valeurs uniques.
    const uniqueSet = new Set();
    return tableData.value.filter(prof => {
        const key = `${prof.professeur} -> ${prof.matiere}`;
        if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            return true; // Garde cette combinaison si elle est unique
        }
        return false; // Ignore cette combinaison si elle est déjà ajoutée
    });
});

const handleAjouterHoraire = async () => {
    try {
        const { jour, heure_debut, heure_fin } = horaire.value;

        if (jour && heure_debut && heure_fin) {
            const response = await ajouterHoraire(horaire.value);

            if (response && response.errors) {
                // Gérer les erreurs 422
                const detailedMessage = response.message + '\n' + Object.values(response.errors)
                    .flat()
                    .join('\n');

                Swal.fire({
                    title: 'Erreur!',
                    text: detailedMessage,
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else if (response && response.error) {
                // Gérer d'autres erreurs
                Swal.fire({
                    title: 'Erreur!',
                    text: response.error,
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                closeModal();
                getHorairesClasse(anneClasseId);
                Swal.fire({
                    title: 'Ajout réussi!',
                    text: 'L\'horaire a été ajouté avec succès.',
                    icon: 'success',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire({
                title: 'Erreur!',
                text: 'Veuillez remplir tous les champs avec des valeurs valides.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'horaire:', error);

        if (error.response && error.response.status === 422) {
            const errorMessage = error.response.data.message;
            const errorDetails = error.response.data.errors;

            let detailedMessage = errorMessage;

            if (errorDetails) {
                detailedMessage += '\n' + Object.values(errorDetails)
                    .flat()
                    .join('\n');
            }

            Swal.fire({
                title: 'Erreur!',
                text: detailedMessage,
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                title: 'Erreur!',
                text: 'Une erreur est survenue lors de l\'ajout de l\'horaire.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    }
};


// Méthode pour modifier un horaire
const handleModifierHoraire = async () => {
    try {
        const { jour, heure_debut, heure_fin, horaire_id } = horaire.value; // Déstructurer les valeurs de l'horaire

        // Vérifier que tous les champs sont remplis et que l'ID de l'horaire est défini
        if (jour && heure_debut && heure_fin && horaire_id) {
            const response = await modifierHoraire(horaire.value); // Appeler le service pour modifier l'horaire

            // Gérer les erreurs 422 (validation)
            if (response && response.errors) {
                const detailedMessage = response.message + '\n' + Object.values(response.errors)
                    .flat()
                    .join('\n');

                Swal.fire({
                    title: 'Erreur!',
                    text: detailedMessage, // Afficher le message détaillé des erreurs
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else if (response && response.error) {
                // Gérer d'autres erreurs
                Swal.fire({
                    title: 'Erreur!',
                    text: response.error, // Afficher le message d'erreur de l'API
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            } else {
                closeModal(); // Fermer le modal
                getHorairesClasse(anneClasseId); // Récupérer les horaires de la classe
                Swal.fire({
                    title: 'Modification réussie!',
                    text: 'L\'horaire a été modifié avec succès.',
                    icon: 'success',
                    timer: 3000, // Afficher pendant 3 secondes
                    showConfirmButton: false
                });
            }
        } else {
            Swal.fire({
                title: 'Erreur!',
                text: 'Veuillez remplir tous les champs avec des valeurs valides.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erreur lors de la modification de l\'horaire:', error);

        if (error.response && error.response.status === 422) {
            const errorMessage = error.response.data.message;
            const errorDetails = error.response.data.errors;

            let detailedMessage = errorMessage;

            if (errorDetails) {
                detailedMessage += '\n' + Object.values(errorDetails)
                    .flat()
                    .join('\n');
            }

            Swal.fire({
                title: 'Erreur!',
                text: detailedMessage, // Afficher le message détaillé des erreurs de validation
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                title: 'Erreur!',
                text: 'Une erreur est survenue lors de la modification de l\'horaire.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    }
};



// Méthode pour supprimer un horaire
const supprimerHoraires = async (horaireId) => {
    try {
        // Afficher une alerte de confirmation avant la suppression
        const confirmation = await Swal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous ne pourrez pas revenir en arrière!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        });

        if (confirmation.isConfirmed) {
            await supprimerHoraire(horaireId); // Appeler le service pour supprimer l'horaire
            getHorairesClasse(anneClasseId); // Récupérer les horaires de la classe
            // Afficher une alerte SweetAlert
            Swal.fire({
                title: 'Suppression réussie!',
                text: 'L\'horaire a été supprimé avec succès.',
                icon: 'success',
                timer: 3000, // Afficher pendant 3 secondes
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'horaire:', error); // Afficher l'erreur en cas de problème
    }
};

// Méthode pour récupérer les détails d'une année de classe
const detailsAnneeClasse = async (id) => {
    try {
        const response = await getAnneeClasseDetails(id); // Appeler le service pour récupérer les détails
        if (response && response.donnees_classe) {
            const classe = response.donnees_classe; // Récupérer les données de la classe
            nomClasse.value = `${classe.nom}`; // Assigner le nom de la classe à la variable réactive
        } else {
            console.error('Aucun détail de la classe trouvé ou structure inattendue.'); // Afficher une erreur si aucune donnée n'est trouvée
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la classe :', error); // Afficher l'erreur en cas de problème
    }
};

// Méthode pour récupérer les horaires de la classe
const getHorairesClasse = async (id) => {
    try {
        const response = await geHoraireClasse(id); // Appeler le service pour récupérer les horaires
        tableData.value = response.données; // Assigner les horaires récupérés à la variable réactive
    } catch (error) {
        console.error('Erreur lors de la récupération des horaires :', error); // Afficher l'erreur en cas de problème
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

// Appeler les méthodes au montage du composant
onMounted(() => {
    detailsAnneeClasse(anneClasseId); // Récupérer les détails de l'année de classe
    getHorairesClasse(anneClasseId); // Récupérer les horaires de la classe
});

// Méthode pour retourner à la page précédente
const retour = () => {
    router.back(); // Utiliser le routeur pour revenir en arrière
};
</script>



<style scoped>
.modal-enter {
    transform: translateX(100%);
}
.modal-leave {
    transform: translateX(100%);
}
.modal-enter-active, .modal-leave-active {
    transition: transform 0.3s ease;
}
/* Masquer la colonne ID dans le tableau */
::v-deep  .tableau1  .tab-evaluations td:nth-child(5),
::v-deep .horaires .tableau1 .tab-evaluations td:nth-child(6) {
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

label:hover {
    cursor: pointer;
    /* Change le curseur lors du survol */
    color: #407CEE;
    /* Couleur au survol */
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
@media (max-width: 992px) {
  .main-content {
width: 130%;
margin-left: -29%;
 margin-top: 15%;  
}
  .main-content h2 {
  margin-bottom: 50px;
  text-align: center;
}
.form-container {
  margin-left: 0px;
  margin-right: 50px;
}

.tableau1 {
  margin-left: 0px;
}
.pagination1 {
    margin-right: 0px;
    margin-left: 0;
}
}
@media (max-width: 768px) {
.main-content {
width: 120%;
margin-left: -25%; 
margin-top: 20%; 
}
}
@media (max-width: 576px) {
  .main-content {
width: 92%;
 margin-left: -10%;
 margin-top: 450px;
  
}
.main-content h2 {
  font-size: 18px;
  text-align: center;
  width: 50%;
}
.search-container input {
 display: flex;
 align-items: center;
 justify-content: center;
  width: 100%;
  margin-right: 50px;
  margin-left: 0;
}
.btn
{
   margin-left: 42%;
    display: flex;
    justify-content: center;
    align-items: center;
}
}
@media (max-width: 390px) {
    .main-content {
width: 88%;
 margin-left: -10%;
 margin-top: 550px;
  
}
}
@media (max-width: 360px) {
.main-content {
width: 85%;
 margin-left: -8%;
 margin-top: 550px;
  
}
}
</style>