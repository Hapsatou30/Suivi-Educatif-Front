<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <div class="head">
            <router-link to="/gestion_notes_parent"> <Icon class="retour" icon="formkit:arrowleft" /></router-link>
            <h1 class="title">Les Notes de <span class="prenom">{{ prenom }}</span></h1>
        </div>
        <div class="legendes">
            <h4>Légendes</h4>
            <div class="legende sous-moyenne">
                <div class="case"></div>
                <span>Sous moyenne</span>
            </div>
            <div class="legende passable">
                <div class="case"></div>
                <span>Passable</span>
            </div>
            <div class="legende bien">
                <div class="case"></div>
                <span>Bien</span>
            </div>
            <div class="legende tres-bien">
                <div class="case"></div>
                <span>Très bien</span>
            </div>
        </div>

        <div class="notes">
            <div class="row">
                <div class="col-6 title-container">
                    <h1>Matière : {{ notes[0]?.matiere || 'Aucune matière' }}</h1>
                </div>
                <div class="col-6">
                    <div v-for="note in notes" :key="note.nom_evaluation" :class="['card', getCardClass(note.note)]">
                        <div class="card-title">{{ note.evaluation }} : {{ note.nom_evaluation }}</div>
                        <div class="card-content">
                            <h1>{{ note.note }}</h1>
                        </div>
                        <div class="card-footer">
                            <p class="coef">Coef: {{ note.coefficient }}</p>
                            <p class="comment">{{ note.commentaire }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { getDetailsEleve } from '@/services/ClasseEleve';
import { getNoteEleve } from '@/services/NotesService';
import { useRoute } from 'vue-router'; 

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id); 
const prenom = ref(''); 
const notes = ref([]); // Variable pour stocker les notes

// Récupération des détails de l'élève
const fetchDetailsEleve = async () => {
    try {
        const response = await getDetailsEleve(classeEleve_id.value);
        if (response.status === 200) {
            prenom.value = response.données.prenom; 
        } else {
            console.error('Erreur lors de la récupération des détails de l\'élève:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de l\'élève:', error);
    }
};

// Récupération des notes de l'élève
const fetchNotesEleve = async () => {
    try {
        const response = await getNoteEleve(classeEleve_id.value);
        if (response) {
            notes.value = response.eleve.notes;  
        } else {
            console.error('Erreur lors de la récupération des notes');
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des notes:', error);
    }
};

// Fonction pour déterminer la classe CSS en fonction de la note
const getCardClass = (note) => {
    if (note < 10) {
        return 'card-rouge';
    } else if (note >= 10 && note <= 12) {
        return 'card-orange';
    } else if (note > 12 && note <= 15) {
        return 'card-jaune';
    } else {
        return 'card-verte';
    }
};

onMounted(() => {
    fetchDetailsEleve();  
    fetchNotesEleve();     
});
</script>

<style scoped>
.main-content {
    overflow-x: hidden;
    padding: 20px; 
    margin-left: 300px
}

.head {
    display: flex;
    align-items: center;
    justify-content: center; /* Centre le contenu horizontalement */
}

.prenom {
    color: #FFCD1E;
}

.retour {
    font-size: 30px;
    color: black;
    margin-right: 20px; /* Ajustement de la marge */
}

/* Styles pour les légendes */
.legendes {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.legende {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.case {
    width: 20px;  
    height: 20px; 
    margin-right: 10px; 
}

.sous-moyenne .case {
    background-color: #FF0000;
}

.passable .case {
    background-color: #FF6600;
}

.bien .case {
    background-color: #FFCD1E;
}

.tres-bien .case {
    background-color: #3E782A;
}

.card-rouge {
    background-color: #FF0000; /* Rouge */
}

.card-orange {
    background-color: #FF6600; /* Orange */
}

.card-jaune {
    background-color: #FFCD1E; /* Jaune */
}

.card-verte {
    background-color: #3E782A; /* Vert */
}

.notes .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    width: 100%; /* Utiliser 100% de la largeur */
}

.title-container {
    display: flex;
    justify-content: flex-start; /* Aligne à gauche */
}

.title {
    text-align: center; /* Centre le titre */
    flex-grow: 1; /* Permet au titre de prendre de l'espace disponible */
}

.notes .row h1 {
    font-weight: bold;
}

.card {
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 10px;
    width: 100%; /* Utiliser 100% de la largeur */
    max-width: 480px; /* Largeur maximale */
    height: 210px;
    color: white;
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
}

.card-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 0.9rem;
    color: white;
}

.coef, .comment {
    color: white;
}
@media (max-width: 768px) {
    .main-content {
   
    margin-left: 0;
    margin-top: 50px;
}

.head h1{
    font-size: 24px;
    margin-top: 25px
}
.card{
    margin-left: -30%;
    width: 250px;
} 
.card-title{
    font-size: 16px;
}

}

</style>
