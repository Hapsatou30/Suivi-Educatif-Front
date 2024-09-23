

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index' // Importation du routeur

// Import du styles Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// Import du scripts JS Bootstrap 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Créer l'application Vue et y intégrer Vue Router
createApp(App)
  .use(router) // Utilisation du routeur dans l'application
  .mount('#app');