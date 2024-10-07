<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <affiche />
        <div class="header">
            <div class="widgets-container">
                <widget title="Enfants" :number="enfantsCount" iconClass="openmoji:child" />
            </div>
            <div class="absence_jour">
                <h4>Absents du jour</h4>
                <div v-if="absencesDuJour.length === 0">
                    <p class="alert alert-info">Aucun enfant absent aujourd'hui.</p>
                </div>
                <div v-else class="cards-container">
    <div v-for="absence in absencesDuJour" :key="absence.id" class="card">
        <h3 class="card-title">{{ absence.classe_eleve.eleve.prenom }}</h3>
        <div class="card-content">
            <p class="left-paragraph">{{ absence.classe_prof.prof_matiere.matiere.nom }}</p>
            <p class="right-paragraph">{{ absence.status }}</p>
        </div>
    </div>
</div>

            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import affiche from '@/components/affiche.vue';
import widget from '@/components/widget.vue';
import { getNombreEnfant } from '@/services/ParentService';
import { profile } from '@/services/AuthService';
import { getAbsenceParents } from '@/services/AbsenceService';
import dayjs from 'dayjs';

const enfantsCount = ref(0);
const parentId = ref('');
const absencesDuJour = ref([]);

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;

        // Récupérer l'ID du parent connecté
        if (user && user.parent) {
            parentId.value = user.parent.id;
            // console.log('Parent', parentId.value);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};

// Récupérer le nombre d'enfants
const fetchData = async () => {
    if (parentId.value) {
        enfantsCount.value = await getNombreEnfant(parentId.value);
        //   console.log('Enfants', enfantsCount.value);
    }
};
// Récupérer les absences du jour
const fetchAbsencesDuJour = async () => {
    try {
        if (parentId.value) {
            const response = await getAbsenceParents(parentId.value);
            const today = dayjs().format('YYYY-MM-DD'); // Récupérer la date d'aujourd'hui

            // Filtrer les absences pour celles qui correspondent à aujourd'hui
            absencesDuJour.value = response.data.filter(absence => absence.date_presence === today && absence.status === 'absent');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des absences:', error);
    }
};
onMounted(async () => {
    await fetchProfile();
    fetchData();
    fetchAbsencesDuJour(); 
});
</script>


<style scoped>
.main-content {
    margin-top: 120px;
}

.widgets-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    margin-left: 300px;
    margin-right: 50px;
}
.absence_jour{
    margin-right: 50px;
}
.header{
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-top: 50px;
}
.cards-container {
    display: flex;
    flex-wrap: wrap; /* Pour autoriser le retour à la ligne si l'espace est insuffisant */
    gap: 20px; /* Espace entre les cartes */
    justify-content: flex-start; /* Aligner les cartes à gauche */
    margin-top: 20px;
}

.card {
    flex: 1 1 300px; /* Chaque carte occupera au moins 300px et pourra s'agrandir si de la place est disponible */
    max-width: 300px;
}


.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
    width: 300px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #F7AE00;
}

.card-title {
    margin: 0 0 12px;
    font-size: 24px;
    color: white;
    text-align: center;
}

.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
}

.left-paragraph {
    margin: 0;
    font-size: 18px;
    color: white;
}

.right-paragraph {
    margin: 0;
    font-size: 18px;
    color: red;
}
</style>