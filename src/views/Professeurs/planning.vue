<template>
    <sidebarProf />
    <topBarProf />
    <div class="main-content planning">
        <h1>Planifier un Devoir ou un Examen</h1>
        <div class="row">
            <div class="col-4">
                <!-- Ajoutez ici votre calendrier interactif -->
                <div id="calendar">
                    <!-- Exemple de calendrier, remplacez ceci par votre calendrier interactif -->
                    <h3>Calendrier</h3>
                    <p>Calendrier interactif ici</p>
                </div>
            </div>
            <div class="col-8  forms" style="background-color: white;">
                <!-- Formulaire à droite -->
                <form @submit.prevent="submitForm">
                    <div class="form-group">
                        <div class="mb-3">
                            <label for="nomEvaluation" class="form-label">Nom de l'Évaluation</label>
                            <input type="text" id="nomEvaluation" v-model="formData.nomEvaluation" class="form-control"
                                placeholder="Nom évaluation" required>
                        </div>
                        <div class="mb-3">
                            <label for="heure" class="form-label">Heure</label>
                            <input type="time" id="heure" v-model="formData.heure" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="mb-3">
                            <label for="classe" class="form-label">Classe</label>
                            <select id="classe" v-model="formData.classe" class="form-select" required>
                                <option value="" disabled selected>Choisissez une classe</option>
                                <option v-for="classe in classes" :key="classe.id" :value="classe.id">{{ classe.nom }}
                                </option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="matiere" class="form-label">Matiere</label>
                            <select id="matiere" v-model="formData.matiere" class="form-select" required>
                                <option value="" disabled selected>Choisissez une matiere</option>
                                <option v-for="matiere in matieres" :key="matiere.id" :value="matiere.id">{{ matiere.nom
                                    }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="mb-3">
                            <label>Type d'Évaluation</label><br>
                            <div class="radio-group">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions"
                                        id="inlineRadio1" value="option1">
                                    <label class="form-check-label" for="inlineRadio1">Devoir</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions"
                                        id="inlineRadio2" value="option2">
                                    <label class="form-check-label" for="inlineRadio2">Examen</label>
                                </div>

                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="duree" class="form-label">Durée (en minutes)</label>
                            <input type="number" id="duree" v-model="formData.duree" class="form-control" required>
                        </div>
                    </div>

                    <div class="mt-4" style="display: flex; justify-content: end;">
                        <button type="submit" class="btn btn-submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import sidebarProf from '@/components/sidebarProf.vue';
import topBarProf from '@/components/topBarProf.vue';

// Données du formulaire
const formData = ref({
    nomEvaluation: '',
    heure: '',
    classe: '',
    type: '',
    duree: ''
});

// Liste des classes (à récupérer via une API ou une méthode)
const classes = ref([
    { id: 1, nom: 'Classe 1' },
    { id: 2, nom: 'Classe 2' },
    // Ajoutez d'autres classes ici
]);

const matieres = ref([
    { id: 1, nom: 'Anglais' },
    { id: 2, nom: 'Math' },
]);


const submitForm = () => {
    console.log('Formulaire soumis :', formData.value);
    // Logique pour traiter le formulaire
};

</script>

<style scoped>
.main-content {
    padding: 20px;
}

.planning h1 {
    margin-left: 300px;
    text-align: center;
}

.planning .row {
    margin-left: 300px;
    margin-right: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 50px;
}

.planning .row .forms {
    background-color: white;
    padding: 30px;
    border-radius: 12px
}

.planning .row .col-8 .form-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}

.planning .row .col-8 .form-group .form-control,
.planning .row .col-8 .form-group .form-select {
    width: 320px;
}

/* Styles pour les boutons radio */
.radio-group {
    display: flex;
    /* Aligne les éléments horizontalement */
    gap: 20px;
    /* Espace entre les éléments */
    margin-top: 10px;
    /* Espace au-dessus du groupe de boutons */
}

.form-control,
.form-select {
    border-radius: 8px;
    border: 1px solid #000000;
    background-color: transparent;
}

input[type="text"]::placeholder,
select {
    color: #F7AE00;
}

input[type="time"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    color: #F7AE00;
}

input[type="radio"]:checked+label {
    color: #407CEE;
    /* Couleur du texte lorsque sélectionné */
    font-weight: bold;
    /* Met en gras le label sélectionné */
}

label:hover {
    cursor: pointer;
    /* Change le curseur lors du survol */
    color: #407CEE;
    /* Couleur au survol */
}

.btn-submit {
    background-color: #F7AE00;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    padding: 8px;
    width: 200px;
    height: 58px;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    margin-top: 10px;
}

.btn-submit:hover {
    background-color: #F7AE00;
    color: white
}
</style>