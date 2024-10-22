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
    <div class="bulletin" v-if="matieres.length">
      <TemplateBulletin :anneeScolaire="anneeScolaire" :effectif="effectifClasse" :niveau="detailsEleve.niveau"
        :matricule="detailsEleve.matricule" :sexe="detailsEleve.sexe" :classe="detailsEleve.classe"
        :prenom="detailsEleve.prenom" :nom="detailsEleve.nom"
        :dateNaissance="formatDateFrancaise(detailsEleve.dateNaissance)" :matieres="matieres" :absences="absences" />
    </div>
  </div>
</template>

<script setup>
import sidebar_parent from '@/components/sideBarParent.vue';
import topbar_parent from '@/components/topBarParent.vue';
import { useRoute } from 'vue-router';
import { getDetailsEleve, getEleveClasse } from '@/services/ClasseEleve';
import { getProfClasse } from '@/services/ClasseProfs';
import { getAbsencesEleve } from '@/services/AbsenceService';
import { getNoteEleve, getNotesParAnneeClasse } from '@/services/NotesService';
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
const matieres = ref([]);
const notes = ref([]);
const detailsEleve = ref({
  niveau: '',
  matricule: '',
  sexe: '',
  classe: '',
  prenom: '',
  nom: '',
  dateNaissance: ''
});
const absences = ref({
  total: 0,
  justifiees: 0,
  nonJustifiees: 0,
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

    if (response.status === 200) {
      detailsEleve.value = response.données;

      anneClasseId.value = detailsEleve.value.anneeClasse_id;
      anneeScolaire.value = detailsEleve.value.anneeScolaire;
      prenom.value = detailsEleve.value.prenom;

      const responseEleves = await getEleveClasse(anneClasseId.value);
      if (responseEleves.status === 200) {
        const eleves = responseEleves.données[0].eleves;
        effectifClasse.value = eleves.length;

        // Appel pour obtenir les matières
        const responseMatieres = await getProfClasse(anneClasseId.value);
        // console.log('responseMat', responseMatieres);

        // Vérification si classes_matieres existe et est un tableau
        if (responseMatieres.classes_matieres && Array.isArray(responseMatieres.classes_matieres)) {
          // Mappage des matières
          matieres.value = responseMatieres.classes_matieres.map(matiere => ({
            nomMatiere: matiere.matiere,
            coefficient: matiere.coefficient
          }));

          // console.log('matieres', matieres.value);  // Vérification des matières mappées
        } else {
          console.error('Aucune matière trouvée dans la réponse.');
        }
        // Appel pour obtenir les absences
        const responseAbsences = await getAbsencesEleve(classeEleve_id.value);
        // console.log('responseAbsences', responseAbsences);

        if (responseAbsences.status === 200) {
          absences.value.total = responseAbsences.données.length; // Total des absences
          absences.value.justifiees = responseAbsences.données.filter(abs => abs.justification !== null).length; // Justifiées
          absences.value.nonJustifiees = absences.value.total - absences.value.justifiees; // Non justifiées
          // console.log('absences', absences.value);
        }

        // Récupération des notes de l'élève
        const responseNotes = await getNoteEleve(classeEleve_id.value);
        // console.log('responseNotes', responseNotes);

        if (responseNotes.status === 200) {
          const notes = responseNotes.eleve.notes;

          // Mappage des matières avec leurs devoirs et examens
          matieres.value = matieres.value.map(matiere => {
            // Filtrer les devoirs pour chaque matière
            const devoirs = notes.filter(note =>
              note.matiere === matiere.nomMatiere && note.evaluation === 'Devoir'
            );

            // Filtrer la note de l'examen pour chaque matière 
            const examen = notes.find(note =>
              note.matiere === matiere.nomMatiere && note.evaluation === 'Examen'
            );

            // Calcul de la moyenne des devoirs
            const moyenneDevoirs = devoirs.length > 0 ?
              (devoirs.reduce((a, b) => a + b.note, 0) / devoirs.length).toFixed(2)
              : 0;

            // Note d'examen (ou 0 si pas d'examen)
            const noteExamen = examen ? examen.note : 0;

            // Calcul de la moyenne de la matière : (moyenneDevoirs + noteExamen) / 2
            const moyenneMatiere = ((parseFloat(moyenneDevoirs) + parseFloat(noteExamen)) / 2).toFixed(2);

            return {
              nomMatiere: matiere.nomMatiere,
              coeff: matiere.coefficient,
              moyenneDevoirs: moyenneDevoirs,
              noteExamen: noteExamen,
              moyenneMatiere: moyenneMatiere,
            };
          });
        }
        // Récupération des Moyennes des élèves par matières
        const responseMoyenneMAtiere = await getNotesParAnneeClasse(anneClasseId.value);
        // console.log('responseMoyenneMAtiere', responseMoyenneMAtiere);

        if (responseMoyenneMAtiere.status === 200) {
          //déstructuration permet d'extraire des valeurs d'objets
          const { données } = responseMoyenneMAtiere;
          const moyennesParMatiere = {};

          // Parcourir les matières et les élèves pour récupérer les moyennes
          for (const matiere in données) {
            //Extrait la liste des élèves pour la matière en cours.
            const eleves = données[matiere].eleves;
            moyennesParMatiere[matiere] = []; // Initialiser le tableau pour chaque matière

            eleves.forEach(eleve => {
              const { matricule, nom, prenom, notes } = eleve;
              const moyenne_globale = notes?.moyenne_globale; // Vérification de l'existence de notes

              // Ajouter l'élève et sa moyenne à la liste de la matière
              moyennesParMatiere[matiere].push({
                matricule,
                nom,
                prenom,
                moyenne: moyenne_globale,
              });
            });

            // Trier les élèves par moyenne décroissante pour cette matière
            moyennesParMatiere[matiere].sort((a, b) => b.moyenne - a.moyenne);

            // Calculer le rang de chaque élève pour cette matière
            moyennesParMatiere[matiere].forEach((eleve, index) => {
              eleve.rang = index + 1; // Le rang commence à 1
            });
          }

          // Mappage des matières avec leurs rangs
          matieres.value = matieres.value.map(matiere => {
            const rangMatiere = moyennesParMatiere[matiere.nomMatiere].find(eleve => eleve.matricule === detailsEleve.value.matricule)?.rang || '-';
            return {
              ...matiere,
              rang: rangMatiere // Ajouter le rang de la matière
            };
          });

          // console.log('Moyennes avec rangs par matière:', moyennesParMatiere);
        } else {
          console.error('Erreur lors de la récupération des moyennes:', responseMoyenneMAtiere.message);
        }

      }
    }

  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'élève:", error);
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
  margin-left: -300px;
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