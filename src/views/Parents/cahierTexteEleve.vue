<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <Icon class="retour" icon="formkit:arrowleft" />
        <h2>Les Notes de <span class="prenom">{{ prenom }}</span></h2>
        
    </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { getDetailsEleve } from '@/services/ClasseEleve';
import { useRoute } from 'vue-router'; 

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id); 
const prenom = ref(''); 

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

onMounted(() => {
    fetchDetailsEleve();
});
</script>

<style scoped>
.main-content {
    margin-top: 120px;
}

.prenom {
    color: #FFCD1E;
}

.retour {
    font-size: 30px;
    color: black;
}

</style>
