<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content container">
        <h1>Voir les emplois du temps de mes enfants</h1>
        <div class="row">
            <div class="col-lg-4 col-md-6 col-12" v-for="card in cards" :key="card.id">
                <router-link :to="{ name: 'emplois_du_temps_enfant', params: { classeEleve_id: card.classeEleve_id } }" class="text-decoration-none">
                    <div class="card mb-4 shadow-sm custom-card">
                        <div class="card-header">
                            <div class="image-wrapper">
                                <img :src="card.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZv5fMEw3s3nvP0sxLIG8bO6RzCLmqgzW5ww&s'" alt="image" class="hexagon-image">
                            </div>
                        </div>
                        <div class="card-body text-center">
                            <h3 class="card-title">{{ card.prenomNom }}</h3>
                            <p class="card-text">{{ card.classe }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { profile } from '@/services/AuthService';
import { getElevesParParent } from '@/services/ClasseEleve';
import { ref, onMounted } from 'vue';

const parentId = ref('');
const cards = ref([]);  

// Fonction pour récupérer les informations de profil de l'utilisateur connecté
const fetchProfile = async () => {
    try {
        const response = await profile();
        const user = response.user;

        if (user && user.parent) {
            parentId.value = user.parent.id;
            fetchElevesParParent();
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
    }
};

const fetchElevesParParent = async () => {
    try {
        const response = await getElevesParParent(parentId.value);
        if (response.status === 200 && response.données) {
            cards.value = response.données.map((eleve, index) => ({
                id: index + 1,  // Générer un id pour chaque carte
                prenomNom: `${eleve.prenom} ${eleve.nom}`,
                classe: eleve.annee_classe[0]?.classe || 'Classe non définie',
                photo: eleve.photo,
                classeEleve_id: eleve.annee_classe[0]?.classeEleve_id
            }));
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des élèves:', error);
    }
};

onMounted(async () => {
    await fetchProfile();
});
</script>

<style scoped>
.main-content {
    margin-top: 100px;
    margin-left: 270px; 
    margin-right: 50px;
    width: 81%;
    overflow-x: hidden;
   
}


h1 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
    margin-left: 0;
}
.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    gap: 2%;
    overflow-x: hidden;
}
.row>* {
    flex: 1 1 calc(33.33% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; 
  overflow-x: hidden;
}
.custom-card {
  flex: 1 1 calc(33.33% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
}

.card {
    height: 360px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hexagon-image {
    width: 200px;  
    height: 200px; 
    clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
    object-fit: cover;
    margin-top: 30px;
    transition: transform 0.3s ease;
}

.image-wrapper {
    position: absolute;
    bottom: -80px;  
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;  
}

.custom-card {
    position: relative;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.custom-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.custom-card:hover .hexagon-image {
    transform: scale(1.1);
}

.card-header {
    background: linear-gradient(90deg, #FF008E 0%, #FFCD1E 100%);
    position: relative;
    height: 150px;
    padding-bottom: 20px;
}

.card-header::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px; 
    background-color: white; 
    clip-path: polygon(0 100%, 100% 100%, 50% 0); 
}

.card-body {
    margin-top: 100px;
    transition: transform 0.3s ease;
    text-align: center;
}

.card-body h3 {
    font-size: 1.25rem;
    font-weight: bold;
    transition: color 0.3s ease;
    color: black;
}

.custom-card:hover .card-body h3 {
    color: #F7AE00;
}

/* Styles pour les appareils mobiles et tablettes */
@media (max-width: 992px) {
    .main-content {
        overflow-x: hidden;
        width: 90%;
        margin-left: auto !important;
        margin-right: auto !important;
        
    }

    .custom-card {
        margin: 0; /* Ajustez l'espacement autour des cartes */
    }


}

@media (max-width: 810px) {
    .main-content {
        width: 90%;
        margin-left: auto !important;
        margin-right: auto !important;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .main-content h1 {
        font-size: 1.5rem; 
        margin-top: 30px; 
        margin-bottom: 30px;
    }

    .row>* {
    flex: 1 1 calc(50% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; 
  overflow-x: hidden;
}
.custom-card {
  flex: 1 1 calc(50% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
}

    .card {
        height: auto; 
        margin-bottom: 20px; 
    }

    .hexagon-image {
        width: 150px;  
        height: 150px; 
        margin-top: 20px; 
    }

    .image-wrapper {
        bottom: -60px; 
    }

    .card-header {
        height: 120px; 
    }

    .card-body h3 {
        font-size: 1rem; 
    }
}
@media (max-width: 576px) {
    .row>* {
    flex: 1 1 calc(100% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; 
  overflow-x: hidden;
}
.custom-card {
  flex: 1 1 calc(50% - 16px); /* Chaque carte prend 33.33% de la largeur disponible moins l'espace du gap */
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Inclut les marges et les bordures dans la largeur */
}
}
</style>