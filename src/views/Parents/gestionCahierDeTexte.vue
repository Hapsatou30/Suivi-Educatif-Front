<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content container">
        <h1>Voir les notes de mes enfants</h1>
        <div class="row">
            <div class="col-md-4" v-for="card in cards" :key="card.id">
                <!-- Envelopper la carte dans un lien -->
                <router-link :to="{ name: 'cahier_texte_enfant', params: { classeEleve_id: card.classeEleve_id } }" class="text-decoration-none">
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
    margin-top: 120px;
    margin-left: 270px;
}

h1 {
    text-align: center;
    margin-top: 50px;
    margin-bottom: 50px;
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
    transform: translateY(-10px); /* Légère élévation de la carte */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* Ombre plus prononcée */
}

.custom-card:hover .hexagon-image {
    transform: scale(1.1); /* Zoom de l'image */
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
}

.custom-card:hover .card-body h3 {
    color: #F7AE00; /* Changement de couleur au hover */
}
</style>

