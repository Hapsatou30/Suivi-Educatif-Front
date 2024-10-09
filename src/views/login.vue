<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="container row my-2">
      <div class="col-lg-8 col-12">
        <div class="logo">
          <h1>BIENVENUE DANS</h1>
          <img src="/public/images/logo_bleu.png" alt="logo" />
        </div>
        <div class="formulaire">
          <h2>Connexion</h2>
          <form @submit.prevent="login">
            <!-- Champ Email -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                id="email"
                placeholder="Votre Email"
                required
              />
              <small v-if="emailError" class="text-danger">{{ emailError }}</small>
            </div>

            <!-- Champ Mot de passe -->
            <div class="mb-3">
              <label for="password" class="form-label">Mot de passe</label>
              <input
                type="password"
                v-model="password"
                class="form-control"
                id="password"
                placeholder="Votre Mot de passe"
                required
              />
              <small v-if="passwordError" class="text-danger">{{ passwordError }}</small>
            </div>

            <!-- Bouton de soumission -->
            <button type="submit" class="btn-block btn-custom">Connexion</button>
            <p v-if="error" class="text-danger">{{ error }}</p>
          </form>
        </div>
      </div>
      <div class="col-4 d-none d-lg-block">
        <img src="/public/images/login.png" alt="personne machine" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { login as loginService } from '@/services/AuthService';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const emailError = ref('');
const passwordError = ref('');

// Méthode pour valider les champs
const validateForm = () => {
  let isValid = true;

  // Validation de l'email
  if (!email.value) {
    emailError.value = 'L\'email est obligatoire.';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Veuillez entrer un email valide.';
    isValid = false;
  } else {
    emailError.value = ''; // Réinitialiser si valide
  }

  // Validation du mot de passe
  if (!password.value) {
    passwordError.value = 'Le mot de passe est obligatoire.';
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères.';
    isValid = false;
  } else {
    passwordError.value = ''; // Réinitialiser si valide
  }

  return isValid;
};

// Méthode pour gérer la connexion
const login = async () => {
  if (!validateForm()) return;

  try {
    const response = await loginService(email.value, password.value);

    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      const roles = response.roles;
      localStorage.setItem('userRole', JSON.stringify(roles));

      if (roles.includes('admin')) {
        router.push('/dashboard');
      } else if (roles.includes('professeur')) {
        router.push('/dashboard_prof');
      } else if (roles.includes('parent')) {
        router.push('/dashboardParent');
      } else {
        router.push('/login');
      }
    } else {
      error.value = 'Token non reçu.';
    }
  } catch (err) {
    error.value = 'Erreur lors de la connexion.';
    console.error('Erreur lors de la connexion', err);
  }
};
</script>



<style>
/* Styles généraux */
body,
html {
  height: 100%;
  margin: 0;
  background-color: #FAFAF7;
  font-family: "Poppins", sans-serif;
}

.container {
  min-height: 100vh; /* Assure une hauteur minimale égale à la fenêtre */
  height: 100%; /* Garde la hauteur à 100% */
  border-radius: 20px;
}


.container .col-lg-8 {
  background-color: white;
  /* Couleur de fond pour la colonne principale */
  color: #407CEE;
  /* Couleur du texte */
  border-top-left-radius: 30px;
  /* Arrondir les coins supérieurs gauche */
  border-bottom-left-radius: 30px;
  /* Arrondir les coins inférieurs gauche */
  height: 90%;
}

.logo {
  display: flex;
  /* Utilise le flexbox pour centrer le logo */
  justify-content: center;
  align-items: center;
}

.logo h1 {
  font-size: 36px;
  /* Taille du texte */
  margin-top: 110px;
  /* Marge supérieure */
  font-family: "Poppins", sans-serif;
  /* Police utilisée */
  font-weight: 600;
  /* Épaisseur de la police */
  color: #407CEE;
  /* Couleur du texte */
}

.logo img {
  width: 371px;
  /* Largeur de l'image du logo */
  height: 279px;
  /* Hauteur de l'image du logo */
}

.formulaire {
  margin-left: 8%;
  padding: 30px;
  /* Espacement interne */
  background-color: #f9f9f9;
  /* Couleur de fond du formulaire */
  border-radius: 20px;
  /* Bordure arrondie */
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  /* Ombre portée */
  max-width: 450px;
  /* Largeur maximale du formulaire */
  margin-bottom: 30px;
  /* Marge inférieure */
}

.formulaire h2 {
  font-size: 30px;
  /* Taille du titre */
  margin-bottom: 20px;
  /* Marge inférieure */
  text-align: center;
  /* Centrer le texte */
  color: black;
  /* Couleur du texte */
  font-family: "Poppins", sans-serif;
  /* Police utilisée */
  font-weight: 500;
  /* Épaisseur de la police */
}

.form-label {
  font-size: 18px;
  /* Taille des labels */
  margin-bottom: 15px;
  /* Marge inférieure */
  font-family: "Poppins", sans-serif;
  /* Police utilisée */
  color: black;
  /* Couleur du texte */
}

.form-control {
  width: 100%;
  /* Largeur complète pour les champs de formulaire */
  height: 58px;
  /* Hauteur des champs */
}

input {
  border-radius: 12px;
  /* Bordure arrondie pour les champs de saisie */
}

.btn-custom {
  background-color: #407cee;
  /* Couleur de fond du bouton */
  color: white;
  /* Couleur du texte */
  border: none;
  /* Pas de bordure */
  width: 100%;
  /* Largeur complète */
  height: 58px;
  /* Hauteur du bouton */
  border-radius: 12px;
  /* Bordure arrondie */
  font-size: 24px;
  /* Taille de la police */
  cursor: pointer;
  /* Curseur en forme de main sur le bouton */
}

.container .col-4 {
  background-color: #407cee;
  /* Couleur de fond pour la colonne d'image */
  border-top-right-radius: 30px;
  /* Arrondir le coin supérieur droit */
  border-bottom-right-radius: 30px;
  /* Arrondir le coin inférieur droit */
  display: flex;
  /* Utilise le flexbox pour centrer l'image */
  justify-content: center;
  align-items: center;
  height: 90%;

}

.container .col-4 img {
  width: 500px;
  height: auto;
  object-fit: cover;
  margin-top: 70%;
  margin-left: -50%;
}

/* Styles pour mobile */
@media screen and (max-width: 576px) {
  body {
    margin-top: 0;
    /* Supprime la marge supérieure sur mobile */
    overflow: scroll;
    /* Permet le défilement */
  }

  .container {
    height: 100%;
    /* Conteneur prenant toute la hauteur */
    display: flex;
    /* Utilise le flexbox pour aligner le contenu */
    justify-content: center;
    align-items: center;
    border-radius: 0;
    /* Pas de bordure pour un alignement complet */
    padding: 0;
    /* Pas de padding */
    width: 100%;
    /* Prendre toute la largeur */
  }

  .container .col-8 {
    flex: 0 0 100%;
    /* Colonne principale prend toute la largeur */
    max-width: 100%;
    background-color: white;
    /* Couleur de fond pour mobile */
    color: #407CEE;
    /* Couleur du texte */
    border-radius: 0;
    /* Pas de bordure arrondie */
    padding: 15px;
    /* Espacement interne */
  }

  .logo {
    flex-direction: column;
    /* Aligner le logo verticalement */
    justify-content: center;
    align-items: center;
    text-align: center;
    /* Centrer le texte */
  }

  .logo h1 {
    font-size: 30px;
    /* Taille du titre sur mobile */
    margin-top: 50px;
    /* Marge supérieure */
  }

  .logo img {
    width: 250px;
    /* Largeur de l'image du logo sur mobile */
    height: auto;
    /* Hauteur automatique */
    margin-top: -50px;
    /* Marge pour superposer */
  }

  .formulaire {
    width: 100%;
    /* Largeur complète pour le formulaire */
    padding: 20px;
    /* Espacement interne */
  }

  .container .col-4 {
    display: none;
    /* Cacher l'image en mode mobile */
  }
}
</style>