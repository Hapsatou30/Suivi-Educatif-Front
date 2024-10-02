<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Gestion des horaires pour la classe de : {{ nomClasse }}
        </h2>

        <!-- Bouton pour ouvrir le modal d'ajout -->
        <div style="text-align: right; margin-bottom: 20px;">
            <button @click="openAddModal" style="background-color: #F7AE00; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; margin-right: 50px; font-size: 24px;" >
                Ajouter un horaire
            </button>
        </div>

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
                    <!-- Champ Professeur et Matière -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="classe_prof_id" style="display: block; margin-bottom: 5px;">Professeur et Matière:</label>
                        <select id="classe_prof_id" v-model="horaire.classe_prof_id" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="" disabled>Choisissez un professeur et une matière</option>
                            <!-- Parcourir la liste des professeurs avec leur matière -->
                            <option v-for="prof in uniqueProfesseursMatieres" :key="prof.classe_prof_id" :value="prof.classe_prof_id">
                                {{ prof.professeur }}  -> {{ prof.matiere }}
                            </option>
                        </select>
                    </div>
                    <!-- Champ Jour -->
                    <div class="form-group" style="margin-bottom: 15px;">
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
                    <!-- Champ Heure de début -->
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="heure_debut" style="display: block; margin-bottom: 5px;">Heure de début:</label>
                        <select id="heure_debut"  v-model="horaire.heure_debut" required
                            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 12px;">
                            <option value="">Sélectionnez l'heure de début</option>
                            <option value="08:00">08:00</option>
                            <option value="10:15">10:15</option>
                            <option value="12:15">12:15</option>
                            <option value="14:15">14:15</option>
                            <option value="16:15">16:15</option>
                        </select>
                    </div>

                    <!-- Champ Heure de fin -->
                    <div class="form-group" style="margin-bottom: 15px;">
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


                    <!-- Champ classe_prof_id (caché) -->
                    <input type="hidden" v-model="horaire.classe_prof_id" />

                    <!-- Bouton de soumission -->
                    <div class="form-group" style="text-align: right;">
                        <button type="submit"
                            style="background-color: #4862C4; color: white; padding: 10px 20px; border: none; border-radius: 12px; cursor: pointer; width: 200px; font-size: 20px">
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
                    :headers="['Matière', 'Professeur', 'Horaire', 'Jour', 'Action']" 
                    :data="paginatedData.map(({ matiere, professeur, horaire, jour, horaire_id, classe_prof_id }) => ({
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
                            <button class="btn" @click="editHoraire(row)" style="color: #4862C4;" title="Modifier l'horaire">
                                <Icon icon="mdi:pencil-outline" />
                            </button>

                            <!-- Bouton de suppression -->
                            <button class="btn" @click="supprimerHoraires(row.horaire_id)" style="color: red;" title="Supprimer l'horaire">
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

// Méthode pour ajouter un horaire
const handleAjouterHoraire = async () => {
    try {
        const { jour, heure_debut, heure_fin } = horaire.value; // Déstructurer les valeurs de l'horaire

        // Vérifier que tous les champs sont remplis
        if (jour && heure_debut && heure_fin) {
            const response = await ajouterHoraire(horaire.value); // Appeler le service pour ajouter l'horaire
            
            // Vérifier si la réponse contient une erreur
            if (response && response.error) {
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
                // Afficher une alerte SweetAlert pour la réussite
                Swal.fire({
                    title: 'Ajout réussi!',
                    text: 'L\'horaire a été ajouté avec succès.',
                    icon: 'success',
                    timer: 3000, // Afficher pendant 3 secondes
                    showConfirmButton: false
                });
            }
        } else {
            console.error('Veuillez remplir tous les champs avec des valeurs valides.'); // Afficher une erreur si les champs sont vides ou invalides
            Swal.fire({
                title: 'Erreur!',
                text: 'Veuillez remplir tous les champs avec des valeurs valides.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'horaire:', error); // Afficher l'erreur en cas de problème
        Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de l\'ajout de l\'horaire.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        });
    }
};


// Méthode pour modifier un horaire
const handleModifierHoraire = async () => {
    try {
        const { jour, heure_debut, heure_fin, horaire_id } = horaire.value; // Déstructurer les valeurs de l'horaire

        // Vérifier que tous les champs sont remplis et que l'ID de l'horaire est défini
        if (jour && heure_debut && heure_fin && horaire_id) {
            const response = await modifierHoraire(horaire.value); // Appeler le service pour modifier l'horaire
            
            // Vérifier si la réponse contient une erreur
            if (response && response.error) {
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
                // Afficher une alerte SweetAlert pour la réussite
                Swal.fire({
                    title: 'Modification réussie!',
                    text: 'L\'horaire a été modifié avec succès.',
                    icon: 'success',
                    timer: 3000, // Afficher pendant 3 secondes
                    showConfirmButton: false
                });
            }
        } else {
            console.error('Veuillez remplir tous les champs avec des valeurs valides et vérifier que l\'ID de l\'horaire est défini.'); // Afficher une erreur si les champs sont vides ou invalides
            Swal.fire({
                title: 'Erreur!',
                text: 'Veuillez remplir tous les champs avec des valeurs valides.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Erreur lors de la modification de l\'horaire:', error); // Afficher l'erreur en cas de problème
        Swal.fire({
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de la modification de l\'horaire.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
        });
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