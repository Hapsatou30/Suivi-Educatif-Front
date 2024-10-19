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
        <boutons title1="1er Semestre" title2="2ème Semestre" page1="bulletins_par_enfant_1semestre" page2="bulletins_par_enfant_2semestre" />
      </div>
      <div class="bulletin">
        <TemplateBulletin
         :anneeScolaire="anneeScolaire"
          :effectif="effectifClasse"
          :niveau="detailsEleve.niveau"
          :matricule="detailsEleve.matricule"
          :sexe="detailsEleve.sexe"
          :classe="detailsEleve.classe"
          :prenom="detailsEleve.prenom"
          :nom="detailsEleve.nom"
          :dateNaissance="formatDateFrancaise(detailsEleve.dateNaissance)"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import sidebar_parent from '@/components/sideBarParent.vue';
  import topbar_parent from '@/components/topBarParent.vue';
  import { useRoute } from 'vue-router';
  import { getDetailsEleve, getEleveClasse } from '@/services/ClasseEleve';
  import TemplateBulletin from '@/components/TemplateBulletin.vue';
  import { ref, onMounted } from 'vue';
  import boutons from '@/components/boutons.vue';
  import { Icon } from '@iconify/vue';
  
  const route = useRoute();
  const classeEleve_id = ref(route.params.classeEleve_id);
  const prenom = ref('');
  const anneClasseId = ref('');
  const effectifClasse = ref(0); 
  const anneeScolaire = ref(0);
  const detailsEleve = ref({
    niveau: '',
    matricule: '',
    sexe: '',
    classe: '',
    prenom: '',
    nom: '',
    dateNaissance: ''
  });
  
  // Fonction de formatage de la date en jj/MM/aaaa
  const formatDateFrancaise = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const jour = date.getDate().toString().padStart(2, '0');
    const mois = (date.getMonth() + 1).toString().padStart(2, '0');
    const année = date.getFullYear();
    return `${jour}/${mois}/${année}`;
  };
  
  // Récupération des détails de l'élève et de l'effectif de la classe
  const fetchDetailsEleve = async () => {
    try {
      const response = await getDetailsEleve(classeEleve_id.value);
    //   console.log('response', response);
      
      if (response.status === 200) {
        detailsEleve.value = response.données;
        
        // Récupérer l'anneClasseId après avoir récupéré les détails de l'élève
        anneClasseId.value = detailsEleve.value.anneeClasse_id;
        // console.log('anneClasseId.value', anneClasseId.value);
        anneeScolaire.value = detailsEleve.value.anneeScolaire;
        
        prenom.value = detailsEleve.value.prenom;
  
         // Appeler la méthode pour obtenir la liste des élèves de la classe
      const responseEleves = await getEleveClasse(anneClasseId.value);
    //   console.log('responseEleves', responseEleves);
      
      if (responseEleves.status === 200) {
        // Stocker l'effectif de la classe (nombre d'élèves)
        const eleves = responseEleves.données[0].eleves; // Accéder au sous-tableau eleves
        effectifClasse.value = eleves.length;
        // console.log('Effectif de la classe:', effectifClasse.value);
      } else {
        console.error('Erreur lors de la récupération des élèves de la classe:', responseEleves.message);
      }
      
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