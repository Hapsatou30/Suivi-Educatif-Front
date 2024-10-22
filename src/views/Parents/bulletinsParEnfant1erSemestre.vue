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
        :dateNaissance="formatDateFrancaise(detailsEleve.dateNaissance)" :matieres="matieres" :absences="absences"
        :moyenneClasse="moyenneClasse" :RangSemestre="RangSemestre" />
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
const moyenneClasse = ref(0);
const RangSemestre = ref(0); // Variable pour stocker le rang de l'élève dans la classe
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

      //récupéré l'effectif de la classe
      const responseEleves = await getEleveClasse(anneClasseId.value);
      if (responseEleves.status === 200) {
        const eleves = responseEleves.données[0].eleves;
        effectifClasse.value = eleves.length;

        // Appel pour obtenir les matières et leur coefficients
        const responseMatieres = await getProfClasse(anneClasseId.value);
        if (responseMatieres.classes_matieres && Array.isArray(responseMatieres.classes_matieres)) {
          matieres.value = responseMatieres.classes_matieres.map(matiere => ({
            nomMatiere: matiere.matiere,
            coefficient: matiere.coefficient
          }));
        } else {
          console.error('Aucune matière trouvée dans la réponse.');
        }

        // Récupérer les absences
        const responseAbsences = await getAbsencesEleve(classeEleve_id.value);
        if (responseAbsences.status === 200) {
          absences.value.total = responseAbsences.données.length;
          absences.value.justifiees = responseAbsences.données.filter(abs => abs.justification !== null).length;
          absences.value.nonJustifiees = absences.value.total - absences.value.justifiees;
        }

       // Récupérer les notes de l'élève
const responseNotes = await getNoteEleve(classeEleve_id.value);
if (responseNotes.status === 200) {
  const notes = responseNotes.eleve.notes.filter(note => note.periode === "1_semestre");

  // Mappage des matières avec leurs devoirs et examens
  matieres.value = matieres.value.map(matiere => {
    const devoirs = notes.filter(note =>
      note.matiere === matiere.nomMatiere && note.evaluation === 'Devoir'
    );

    const examen = notes.find(note =>
      note.matiere === matiere.nomMatiere && note.evaluation === 'Examen'
    );

    const moyenneDevoirs = devoirs.length > 0 ?
      (devoirs.reduce((a, b) => a + b.note, 0) / devoirs.length).toFixed(2)
      : 0;

    const noteExamen = examen ? examen.note : 0;

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

// Récupérer les notes par année et classe
const responseMoyenneMAtiere = await getNotesParAnneeClasse(anneClasseId.value);

// Vérifier si la réponse est réussie (status 200)
if (responseMoyenneMAtiere.status === 200) {
  const { données } = responseMoyenneMAtiere;

  // Filtrer les données pour ne récupérer que celles du 1er semestre
  const semestre1Data = données["1_semestre"];

  const moyennesParMatiere = {}; // Initialiser un objet pour stocker les moyennes par matière
  const elevesGlobalData = {};
  let sommeMoyennesPonderees = 0;
  let nombreEleves = 0;

  // Boucle à travers chaque matière pour traiter les notes du 1er semestre
  for (const matiere in semestre1Data) {
    const coefficient = semestre1Data[matiere].coefficient;
    const eleves = semestre1Data[matiere].eleves;
    moyennesParMatiere[matiere] = []; // Initialiser un tableau pour les moyennes de cette matière

    // Boucle à travers chaque élève pour calculer les moyennes
    eleves.forEach(eleve => {
      const { matricule, nom, prenom, notes } = eleve; // Extraire les informations de l'élève
      const moyenne_globale = notes?.moyenne_globale; // Obtenir la moyenne globale

      if (moyenne_globale !== undefined) {
        const produitCoefficientMoyenne = coefficient * moyenne_globale;

        // Ajouter les données de l'élève à la matière
        moyennesParMatiere[matiere].push({
          matricule,
          nom,
          prenom,
          moyenne: moyenne_globale,
          produitCoefficientMoyenne,
        });

        if (!elevesGlobalData[matricule]) {
          elevesGlobalData[matricule] = {
            nom,
            prenom,
            sommeCoefficients: 0,
            sommeResultats: 0,
            moyennePonderee: 0,
          };
        }

        elevesGlobalData[matricule].sommeCoefficients += coefficient;
        elevesGlobalData[matricule].sommeResultats += produitCoefficientMoyenne;
      }
    });

    // Trier les élèves par moyenne décroissante pour cette matière
    moyennesParMatiere[matiere].sort((a, b) => b.moyenne - a.moyenne);

    // Calculer le rang de chaque élève pour cette matière
    moyennesParMatiere[matiere].forEach((eleve, index) => {
      eleve.rang = index + 1;
    });
  }

  // Calculer la moyenne pondérée pour chaque élève
  Object.keys(elevesGlobalData).forEach(matricule => {
    const eleveData = elevesGlobalData[matricule];
    if (eleveData.sommeCoefficients !== 0) {
      eleveData.moyennePonderee = eleveData.sommeResultats / eleveData.sommeCoefficients;
    } else {
      eleveData.moyennePonderee = 0;
    }
    sommeMoyennesPonderees += eleveData.moyennePonderee;
    nombreEleves++;
  });

  // Calculer la moyenne de la classe
  moyenneClasse.value = parseFloat((sommeMoyennesPonderees / nombreEleves).toFixed(2));

  // Mappage des matières avec leurs rangs
  matieres.value = matieres.value.map(matiere => {
    const rangMatiere = moyennesParMatiere[matiere.nomMatiere].find(eleve => eleve.matricule === detailsEleve.value.matricule)?.rang || '-';
    return {
      ...matiere,
      rang: rangMatiere,
    };
  });

  // Trier les élèves selon leur moyenne pondérée de manière décroissante
  const elevesTries = Object.values(elevesGlobalData).sort((a, b) => b.moyennePonderee - a.moyennePonderee);

  // Affecter un rang à chaque élève trié
  elevesTries.forEach((eleve, index) => {
    eleve.rang = index + 1;
  });

  // Affecter le rang de l'élève connecté
  const rangActuel = elevesTries.find(eleve => eleve.nom === detailsEleve.value.nom && eleve.prenom === detailsEleve.value.prenom)?.rang;
  RangSemestre.value = rangActuel || 0; // Attribuer le rang ou 0 si non trouvé

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