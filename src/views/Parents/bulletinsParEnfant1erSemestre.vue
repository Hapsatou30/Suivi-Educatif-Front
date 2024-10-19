<template>
    <sidebar_parent />
    <topbar_parent />
    <div class="main-content">
        <div class="head">
      <router-link to="/gestion_bulletins">
        <Icon class="retour" icon="formkit:arrowleft" />
      </router-link>
      <h1 class="title">Les Notes de <span class="prenom">{{ prenom }}</span></h1>
    </div>
        <div class="boutons ">
            <boutons title1="1er Semestre" title2="2ème Semestre" page1="bulletins_par_enfant_1semestre"
                page2="bulletins_par_enfant_2semestre" />
        </div>
        <div class="bulletin">
            <TemplateBulletin />
        </div>
    </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { useRoute } from 'vue-router';
import { getDetailsEleve } from '@/services/ClasseEleve';
import TemplateBulletin from '@/components/TemplateBulletin.vue';
import { ref, onMounted, computed } from 'vue';
import boutons from '@/components/boutons.vue';
import { Icon } from '@iconify/vue';

const route = useRoute();
const classeEleve_id = ref(route.params.classeEleve_id);
const prenom = ref('');

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

onMounted(() => {
    fetchDetailsEleve();
});
</script>
<style scoped>
.main-content {
    overflow-x: hidden;
    padding: 20px;
    margin-left: 300px;
}

.boutons {
    display: block;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;

  /* Centre le contenu horizontalement */
}

.prenom {
  color: #FFCD1E;
}

.retour {
  font-size: 30px;
  color: black;
  margin-left: -300px;
  display: flex;
  align-items: start;
  justify-content: start;

}

</style>