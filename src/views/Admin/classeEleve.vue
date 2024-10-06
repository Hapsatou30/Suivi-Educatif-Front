<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
        <h2>
            Ajouter des élèves dans la classe de : {{ nomClasse }}
        </h2>
        <div class="check">
            <!-- Vérifier si la liste des élèves non attribués est vide -->
            <template v-if="itemList.length > 0">
                <checkbox :items="itemList" :imageSrc="imageSource" @update:selectedItems="updateSelectedItems" />
            </template>
            <template v-else>
                <p class="alert alert-info" style="margin-left: 300px; margin-right: 50px;">
                    Tous les élèves ont déjà une classe attribuée.
                </p>
            </template>
        </div>
        <div class="button-container">
            <button @click="attribuerEleveClasse" class="btn btn-custom">Enregistrer</button>
            <button @click="retour" class="btn btn-secondary">Retour</button>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import checkbox from '@/components/checkbox.vue';
import { getAnneeClasseDetails } from '@/services/AnneeClasseService';
import { getEleves } from '@/services/EleveService';
import { ajouterEleveClasse, getElevesOntClasse } from '@/services/ClasseEleve';
import Swal from 'sweetalert2';

const router = useRouter();
const route = useRoute();

const itemList = ref([]); // Liste des élèves à afficher
const imageSource = ref('/public/images/classProf.png');
const nomClasse = ref('');
const anneClasseId = route.params.id;
const selectedEleve = ref([]); // Référence pour stocker les IDs des élèves sélectionnés
const eleveAttribue = ref([]); // Pour stocker les élèves déjà attribués

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

// Méthode pour récupérer la liste des élèves non attribués
const fetchEleveNonAttribue = async () => {
    try {
        // Récupérer tous les élèves
        const tousEleves = await getEleves(); // Cette méthode retourne un tableau d'élèves
        // console.log('Liste de tous les élèves:', tousEleves);
        
        // Récupérer les élèves qui ont déjà une classe
        const response = await getElevesOntClasse();
        // console.log('Élèves ayant déjà une classe:', response);

        // Vérifier que la réponse contient des données et qu'il s'agit d'un tableau
        if (response && response.données && Array.isArray(response.données)) {
            // Créer un ensemble contenant les IDs des élèves attribués à une classe
            const elevesAttribueIds = new Set();
            response.données.forEach(eleveClasse => {
                elevesAttribueIds.add(eleveClasse.eleve_id);
            });

            // Filtrer les élèves pour ne garder que ceux qui ne sont pas attribués
            itemList.value = tousEleves.filter(eleve => !elevesAttribueIds.has(eleve.id));
            console.log('Élèves non attribués:', itemList.value);
        } else {
            console.warn("Aucune donnée d'élèves attribués trouvée ou structure inattendue.");
            // Si aucune classe n'est trouvée, afficher tous les élèves
            itemList.value = tousEleves;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des élèves non attribués:", error);
    }
};

// Méthode pour mettre à jour les classes sélectionnées depuis le composant checkbox
const updateSelectedItems = (items) => {
    selectedEleve.value = items; // Items contient les ids des élèves sélectionnés
};

// Méthode pour attribuer les élèves à la classe
const attribuerEleveClasse = async () => {
    if (selectedEleve.value.length > 0) {
        try {
            const response = await ajouterEleveClasse({
                annee_classe_id: anneClasseId,
                eleve_id: selectedEleve.value,
            });

            // console.log("Réponse du serveur:", response);

            // Vérifiez si la réponse inclut un champ "success"
            if (response && response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Succès',
                    text: response.message || 'Les élèves ont été attribués avec succès !',
                    confirmButtonColor: '#407CEE',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                await fetchEleve(); // Appel à la fonction pour rafraîchir la liste des élèves
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: response.message || 'Une erreur inattendue s\'est produite.',
                    confirmButtonColor: '#d33',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.message || 'Une erreur inattendue s\'est produite.',
                confirmButtonColor: '#d33',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Aucune sélection',
            text: 'Veuillez sélectionner au moins un élève avant de soumettre.',
            confirmButtonColor: '#f0ad4e',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    }
};


// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};

// Appel des méthodes dans onMounted
onMounted(() => {
    detailsAnneeClasse(anneClasseId);
    fetchEleveNonAttribue(); // Appel de la méthode pour récupérer les élèves non attribués
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