<template>
  <sidebarProf />
  <topBarProf />
  <div class="main-content">
    <h2>
      Remplir le cahier de texte de la classe de : {{ nom_classe }}
    </h2>
    <div class="cahier-text container mt-4">
      <div class="image-container">
        <img :src="imageCahier" alt="" class="image-background" />
        <div class="overlay-text">
          <form @submit.prevent="handleFormSubmit">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="titre" class="form-label">Titre du Cours :</label>
                <input type="text" class="form-control" v-model="titre" placeholder="Entrez votre titre" required />
              </div>
              <div class="col-md-6" >
                <label for="date" class="form-label">Date :</label>
                <input type="date" class="form-control" v-model="date" required />
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="resume" class="form-label">Résume du cours:</label>
                <textarea name="" class="form-control" v-model="resume" placeholder="Entrez votre résume" required style="height: 200px;"></textarea>
              </div>
              <div class="col-md-6">
                <label for="ressource" class="form-label">Ressource :</label>
                <input type="text" class="form-control" v-model="ressource" placeholder="Entrez votre ressource" required />
              </div>
            </div>
            <div class="bouton">
              <button type="submit" class="btn btn-submit">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
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
import Swal from 'sweetalert2';

// Initialisation des routeurs
const router = useRouter();
const route = useRoute();
const imageCahier =ref('/public/images/image.png');

// Variables réactives
const classeProf_id = route.params.classeProf_id;
const annee_classe_id = route.params.annee_classe_id;
const nom_classe = route.params.nom_classe;




// Méthode pour retourner à la page précédente
const retour = () => {
    router.back();
};


</script>




<style scoped>
.cahier-text{
  margin-left: 270px;
  margin-right: 50px;
  width: 100%;
}
.image-container {
  position: relative;
}

.image-background {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.overlay-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  border-radius: 12px;
}
form{
  width: 900px;
  margin-left: 2%;
  margin-top: 2%;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
  margin-left: 40px;
  

  
}

input[type="text"],
input[type="date"],
textarea {
  width: 85%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #000000;
  background-color: transparent;
}
input[type="text"]::placeholder, textarea::placeholder{
  color: #F7AE00;
}
input[type="date"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  color: #F7AE00;
}

label{
  font-weight: bold;
}
.main-content {
  margin-top: 120px;
}

.main-content h2 {
  color: black;
  font-size: 24px;
  text-align: center;
  margin-left: 300px;
}

.bouton {
    display: flex;
    justify-content: end;
    margin-right: 60px;
  }
  .bouton .btn-submit {
    background-color: #F7AE00;
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
    background-color: #F7AE00; /* Change la couleur au survol */
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
  color: #F7AE00;
}
</style>