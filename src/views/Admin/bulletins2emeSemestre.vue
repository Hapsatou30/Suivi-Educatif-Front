<template>
  <sidebar_admin />
  <topbar_admin />
  <div class="main-content">
    <div class="head">
      <div class="retour">
        <button @click="retour" class="btn btn-secondary">
          <Icon icon="formkit:arrowleft" />
        </button>
      </div>
      <h1 class="title">Les Notes de <span class="prenom">{{ prenom }}</span></h1>
    </div>
    <div class="lien_boutons">
      <boutons title1="1er Semestre" title2="2ème Semestre" page1="bulletins_1er_Semestre_par_eleve"
        page2="bulletins_2eme_Semestre_par_eleve" />
    </div>
    <div class="bulletin" v-if="matieres.length">
      <TemplateBulletin :anneeScolaire="anneeScolaire" :effectif="effectifClasse" :niveau="detailsEleve.niveau"
        :matricule="detailsEleve.matricule" :sexe="detailsEleve.sexe" :classe="detailsEleve.classe"
        :prenom="detailsEleve.prenom" :nom="detailsEleve.nom"
        :dateNaissance="formatDateFrancaise(detailsEleve.dateNaissance)" :matieres="matieres" :absences="absences"
        :moyenneClasse="moyenneClasse" :RangSemestre="RangSemestre" />
    </div>
    <div class="telecharger-container">
      <button @click="telechargerBulletin" class="btn-telecharger">
        <Icon class="icon" icon="ic:baseline-download" />
        Télécharger le bulletin
      </button>
    </div>
  </div>
</template>

<script setup>
import sidebar_admin from '@/components/sidebarAdmin.vue';
import topbar_admin from '@/components/topbarAdmin.vue';
import { useRoute, useRouter } from 'vue-router';
import { getDetailsEleve, getEleveClasse } from '@/services/ClasseEleve';
import { getProfClasse } from '@/services/ClasseProfs';
import { getAbsencesEleve } from '@/services/AbsenceService';
import { getNoteEleve, getNotesParAnneeClasse } from '@/services/NotesService';
import TemplateBulletin from '@/components/TemplateBulletin2.vue';
import { ref, onMounted } from 'vue';
import boutons from '@/components/boutons.vue';
import { Icon } from '@iconify/vue';
import html2pdf from 'html2pdf.js';

const router = useRouter();
const route = useRoute();
const classeEleve_id = ref(route.params.id_classeEleve);
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

//methode pour télécharger le bulletins 
const telechargerBulletin = () => {
  // Sélectionner l'élément HTML du bulletin que l'on souhaite convertir en PDF
  const element = document.querySelector('.bulletin');

  // Options pour la génération du PDF
  const options = {
    filename: `Bulletin_${detailsEleve.value.prenom}_${detailsEleve.value.nom}.pdf`,
    margin: 10,
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  // Générer et télécharger le PDF
  html2pdf().set(options).from(element).save();
};

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

        if (responseMatieres.success && Array.isArray(responseMatieres.data) && responseMatieres.data.length > 0) {
          matieres.value = responseMatieres.data.map(matiere => ({
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
          const notes = responseNotes.eleve.notes.filter(note => note.periode === "2_semestre");

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

          // Filtrer les données pour ne récupérer que celles du 2eme semestre
          const semestre2Data = données["2_semestre"];

          const moyennesParMatiere = {}; // Initialiser un objet pour stocker les moyennes par matière
          const elevesGlobalData = {};
          let sommeMoyennesPonderees = 0;
          let nombreEleves = 0;

          // Boucle à travers chaque matière pour traiter les notes du 2eme semestre
          for (const matiere in semestre2Data) {
            const coefficient = semestre2Data[matiere].coefficient;
            const eleves = semestre2Data[matiere].eleves;
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

// Méthode pour retourner à la page précédente
const retour = () => {
  router.back();
};

</script>




<style scoped>
.main-content {
  overflow-x: hidden;
  padding: 20px;
  margin-left: 300px;
  background-color: #FAFAF7;


}



.head {
  display: flex;
  align-items: center;
  justify-content: start;

  /* Centre le contenu horizontalement */
}

.title {
  text-align: center;
  margin-left: 150px
}

.prenom {
  color: #FFCD1E;

}

.retour {
  font-size: 30px;
  color: black;
  background: transparent;


}

.btn-group[data-v-958842ab] {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0;
  margin-right: 50px;
}

.telecharger-container {
  margin-top: 20px;
  /* Ajoute un espacement au-dessus du bouton */
}

.btn-telecharger {
  display: flex;
  align-items: center;
  background-color: #F7AE00;
  /* Couleur de fond du bouton */
  color: white;
  /* Couleur du texte */
  border: none;
  /* Enlève la bordure */
  border-radius: 5px;
  /* Coins arrondis */
  padding: 10px 15px;
  /* Espacement interne */
  cursor: pointer;
  /* Curseur en main */
  transition: background-color 0.3s;
  /* Transition pour l'effet de survol */
}

.btn-telecharger:hover {
  background-color: #F7AE00;
  /* Couleur de fond au survol */
}

.icon {
  margin-right: 8px;
  /* Espace entre l'icône et le texte */
  font-size: 18px;
  /* Taille de l'icône */
}
@media (max-width: 992px) {
 .main-content{
  margin-top: 90%;
 
  margin-left: 0;
 }
 .title {
    font-size: 24px;
    text-align: center;
    margin-left: 0px;
    margin-top: 40px;
}
}
@media (max-width: 576px) {
  .main-content{
  margin-top: 60%;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
 }
 .title {
    font-size: 18px;
    text-align: center;
    margin-left: 0px;
    margin-top: 40px;
}
.boutons {
  display: flex;
  margin-left: -10%;
}
.retour {
  margin-left: 0%;

}
.boutons {
  display: flex;
  margin-left: 0;
}
.telecharger-container{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
}
@media (max-width: 390px) {
  .main-content{
  margin-top: 80%;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
 }
}

</style>