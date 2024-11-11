<template>
  <div class="d-flex justify-content-center align-items-center vh-100 contenu" >
    <div class="container row my-2">
      <div class="col-lg-8 col-12">
        <div class="logo">
          <h1>BIENVENUE DANS</h1>
          <img src="@/assets/logo_bleu.png" alt="logo" />
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
        <img src="@/assets/login.png" alt="personne machine" width="300" height="auto">
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
      }  else if (roles.includes('eleve')) {
        router.push('/dashboardEleve');
      }
      else {
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
/* Styles généraux - Inchangés */
body,
html {
  height: 100%;
  margin: 0;
  background-color: #FAFAF7;
  font-family: "Poppins", sans-serif;
}

/* Styles desktop - Inchangés */
.container {
  height: auto;
  border-radius: 20px;
}
.container {
  display: flex;
  align-items: stretch; /* Assure la même hauteur pour les colonnes */
}

.container .col-lg-8 {
  background-color: white;
  color: #407CEE;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  padding: 1px 0;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo h1 {
  font-size: 30px;
  margin-top: 12.1%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #407CEE;
}

.logo img {
  width: 30%;
  height: auto;
}

.formulaire {
  margin-left: 8%;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  max-width: 70%;
  margin-bottom: 30px;
}

.formulaire h2 {
  font-size: 30px;
  margin-bottom: 20px;
  text-align: center;
  color: black;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.form-label {
  font-size: 18px;
  margin-bottom: 15px;
  font-family: "Poppins", sans-serif;
  color: black;
}

.form-control {
  width: 100%;
  height: 58px;
}

input {
  border-radius: 12px;
}

.btn-custom {
  background-color: #407cee;
  color: white;
  border: none;
  width: 100%;
  height: 58px;
  border-radius: 12px;
  font-size: 24px;
  cursor: pointer;
}

.container .col-4 {
  background-color: #407cee;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto; 
}

.container .col-4 img {
  width: 115%;
  height: auto;
  object-fit: cover;
  margin-top: 65%;
  margin-left: -50%;
  transition: transform 0.3s ease;
}

.container .col-4 img:hover {
  transform: scale(1.1);
}
@media (min-width: 992px) and (max-width: 1399px) {
 
  .container .col-4 {
 padding: 1% 0;
}


}
/* Styles pour tablette et petit écran */
@media screen and (max-width: 991px) {
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .container {
    width: 90%;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .container .col-lg-8 {
    width: 100%;
    height: auto;
    padding: 20px;
    border-radius: 20px;
  }

  .logo {
    margin-top: 0;
    padding: 20px 0;
  }

  .logo h1 {
  font-size: 25px;
  margin-top: 18%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #407CEE;
}

.logo img {
  width: 45%;
  height: auto;
}

  .formulaire {
    margin: 20px auto;
    padding: 20px;
    max-width: 85%;
  }

  .container .col-4 {
    display: none;
  }
}

/* Styles pour mobile */
@media screen and (max-width: 576px) {
  .container {
    width: 95%;
    margin: 10px auto;
  }

 

  .logo h1 {
  font-size: 25px;
  margin-top: 18%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #407CEE;
}

.logo img {
  width: 45%;
  height: auto;
}
  .formulaire {
    padding: 15px;
    max-width: 90%;
    margin: 15px auto;
  }

  .formulaire h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .form-label {
    font-size: 16px;
  }

  .form-control {
    height: 50px;
  }

  .btn-custom {
    height: 50px;
    font-size: 20px;
  }
}

/* Très petits écrans */
@media screen and (max-width: 450px) {
  .container {
    width: 98%;
  }

  .logo h1 {
  font-size: 120%;
  margin-top: 19.4%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #407CEE;
}

.logo img {
  width: 47%;
  height: auto;
}
  .formulaire {
    padding: 12px;
    max-width: 95%;
  }

  .formulaire h2 {
    font-size: 20px;
  }

  .btn-custom {
    font-size: 18px;
  }
}
@media screen and (max-width: 360px) {


  .logo h1 {
  font-size: 100%;
  margin-top: 19.4%;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #407CEE;
}

.logo img {
  width: 45%;
  height: auto;
}
  
}
</style>