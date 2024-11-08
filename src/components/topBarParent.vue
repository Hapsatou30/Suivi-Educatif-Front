<template>
    <div class="topbar">
      <div class="left-section">
        <h4>Bonjour, {{ prenomUser }}</h4>
      </div>
      <div class="right-section">
        <div class="notifications" @click="handleNotificationClick">
        <Icon icon="mdi:bell-outline" class="notification" />
        <span class="badge">{{ unreadCount }}</span>
      </div>
        <div class="dropdown">
          <img :src="photoUser" alt="Photo de profil" class="dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" />
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" @click="openModal" style="cursor: pointer;">Modifier Profil</a></li>
            <li><a class="dropdown-item" @click="handleLogout">Déconnexion</a></li>
          </ul>
        </div>
      </div>
    </div>
     <!-- Modal de notifications -->
     <NotificationModal
      v-if="isModalVisible"
      :title="'Notifications'"
      :notifications="notifications"
      :confirmText="'Fermer'"
      :cancelText="null"
      @close="handleCloseModal"
    />
  
    <!-- Modal pour modifier le profil -->
    <div v-if="isModalOpen"
        style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
      <div
          style="position: relative; width: 90%; max-width: 500px; padding: 20px; background: white; border-radius: 8px; z-index: 1001; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
        <div class="modal-header">
          <h5 class="modal-title" id="modalProfileLabel">Modifier Profil</h5>
          <span class="close" @click="closeModal" style="cursor: pointer;">&times;</span>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="nom" class="form-label">Nom</label>
              <input type="text" class="form-control" v-model="formData.nom" required />
            </div>
            <div class="mb-3">
              <label for="prenom" class="form-label">Prénom</label>
              <input type="text" class="form-control" v-model="formData.prenom" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" v-model="formData.email" required />
            </div>
            <div class="mb-3">
              <label for="telephone" class="form-label">Téléphone</label>
              <input type="tel" class="form-control" v-model="formData.telephone" required />
            </div>
  
            <div class="mb-3">
              <label for="password" class="form-label">Mot de passe</label>
              <input type="password" class="form-control" v-model="formData.password" />
            </div>
            <div class="mb-3">
      <label for="photo" class="form-label">Photo</label>
      <input type="file" class="form-control" @change="handleFileUpload" />
  </div>
  
            <button type="submit" class="btn btn-primary">Sauvegarder</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Importation des dépendances
  import { ref, onMounted,computed } from 'vue';
  import { profile, logout } from '@/services/AuthService'; 
  import { Icon } from '@iconify/vue';
  import Swal from 'sweetalert2';
  import { getNotifications } from '@/services/NotificationService';
import NotificationModal from './NotificationModal.vue';

  
  // Variables réactives pour stocker les informations utilisateur
  const prenomUser = ref('');
  const photoUser = ref('');
  const parentId = ref('');
  const isModalOpen = ref(false); // Déclaration de la variable pour contrôler l'ouverture du modal
  const isModalVisible = ref(false); // Gérer la visibilité du modal
const notifications = ref([]); // Stocker les notifications récupérées

  const formData = ref({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    photo: null,
    parentId,
    telephone: '',
  });
  
  // Fonction pour récupérer les informations de profil de l'utilisateur
  const fetchProfile = async () => {
    try {
      const response = await profile(); 
      const user = response.user; 
      prenomUser.value = user.parent.prenom;
      formData.value.nom = user.parent.nom;
      formData.value.prenom = user.parent.prenom;
      formData.value.email = user.email;
      formData.value.telephone = user.parent.telephone;
      parentId.value = user.parent.id;
      photoUser.value = `SuiviEducatifFrontEnd.thiamhapstou.simplonfabriques.com/storage//` + user.parent.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s'; 
    }
  
    
     catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    }
    // console.log('jj', photoUser);
    // console.log('iddd', parentId) ;
  };
  
  const unreadCount = computed(() => {
  return notifications.value.filter(notification => notification.is_read === 0).length; // Compte les notifications non lues
});


// Méthode pour récupérer et afficher les notifications
const fetchNotifications = async () => {
  try {
    const response = await getNotifications(); // Appel à la méthode pour récupérer les notifications
    notifications.value = response.données; // Stocker les notifications récupérées dans la variable
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications', error);
  }
};

// Méthode pour gérer le clic sur l'icône des notifications
const handleNotificationClick = () => {
  isModalVisible.value = true; // Ouvrir le modal
};

// Fonction pour fermer le modal
const handleCloseModal = () => {
  isModalVisible.value = false;
};

  
  // Fonction pour ouvrir le modal
  const openModal = () => {
    isModalOpen.value = true; // Modifiez ici pour utiliser isModalOpen
  };
  
  // Fonction pour fermer le modal
  const closeModal = () => {
    isModalOpen.value = false; // Modifiez ici pour utiliser isModalOpen
  };
  
  // Gestion du formulaire de mise à jour du profil
//   const submitForm = async () => {
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('nom', formData.value.nom);
//       formDataToSend.append('prenom', formData.value.prenom);
//       formDataToSend.append('email', formData.value.email);
//       formDataToSend.append('telephone', formData.value.telephone);
//       if (formData.value.password) {
//         formDataToSend.append('password', formData.value.password);
//       }
//       if (formData.value.photoUser) {
//         formDataToSend.append('photo', formData.value.photoUser);
//       }
     
      
// //   console.log('ggggg', formDataToSend);
  
//       // Passer formDataToSend ici
//       await modifierProfileProfesseur(parentId.value,formDataToSend);
      
//       closeModal(); // Fermer le modal après la soumission
//       Swal.fire({
//         title: 'Succès',
//         text: 'Profil modifié avec succès!',
//         icon: 'success',
//         timer: 2000, 
//         timerProgressBar: true,
//         showConfirmButton: false 
//       });
//       fetchProfile();
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du profil:', error);
//       Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du profil.', 'error');
//     }
//   };
  const handleFileUpload = (event) => {
      const file = event.target.files[0]; // Récupère le premier fichier sélectionné
      if (file) {
          formData.value.photoUser = file; // Stocke le fichier dans formData
      }
  };
  
  
  
  
  // Méthode pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout(); // Appel de la méthode de déconnexion
      window.location.href = '/login'; // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };
  
  // Appel de la fonction fetchProfile lorsque le composant est monté
  onMounted(fetchProfile);
  onMounted(fetchNotifications);
  </script>
  
  
    
  
    
    <style scoped>
    .close {
      font-size: 35px; 
      color: #dc3545;
      transition: color 0.3s ease; 
      cursor: pointer; 
      margin-left: 300px;
  }
  
  .close:hover {
      color: #c82333; /* Couleur plus foncée au survol */
  }
  
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding: 0 20px;
      margin-left: 250px; 
      background-color: #FAFAF7;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 10;
      border-bottom: 1px dashed #F7AE00;
    }
    .topbar  .left-section h4{
      font-size: 18px; 
      color: #F7AE00; 
      font-family: "Poppins", sans-serif;
      font-weight: 500; 
    }
    
    .left-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 30px;
      
    }
    
    .right-section {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 35px;
    }
    
    .icon {
      font-size: 30px;
      margin-right: 10px;
    }
    
   
    
    .notifications {
      font-size: 30px;
      margin-right: 10px;
      color: #F7AE00;
      margin-bottom: 5px;
    }
    
   .dropdown img{
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
   
   }
   .topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 90px;
  padding: 0 20px;
  background-color: #FAFAF7;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  border-bottom: 1px dashed #F7AE00;
  margin-left: 250px;
}

.topbar .left-section h4 {
  font-size: 18px;
  color: #F7AE00;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
}

.left-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
}

.right-section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 35px;
}

.icon {
  font-size: 30px;
  margin-right: 10px;
}

.notifications {
  font-size: 30px;
  margin-right: 10px;
  color: #F7AE00;
  margin-bottom: 5px;
}

.dropdown img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}
.badge {
  position: relative; /* Positionner le badge sur l'icône */
  top: -15px; /* Ajuster la position verticale */
  right: 4px; /* Ajuster la position horizontale */
  background-color: red; /* Couleur de fond du badge */
  color: white; /* Couleur du texte */
  border-radius: 50%; /* Rendre le badge circulaire */
  padding: 5px 8px; /* Espacement interne */
  font-size: 14px; /* Taille de police */
}

/* Optionnel: rendre le badge moins visible quand il affiche 0 */
.badge {
  opacity: 1; /* Assure que l'élément est visible */
}


/* Media query pour les petits écrans */
@media (max-width: 992px) {
  .topbar {
    flex-direction: column;
    height: auto;
    padding: 10px;
    margin-left: 0; /* Supprime le décalage à gauche */
  }

  .left-section {
    margin-left: 0;
    margin-bottom: 10px;
  }

  .topbar .left-section h4 {
    font-size: 16px;
    text-align: center;
  }


  .icon, .notifications {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .dropdown img {
    width: 40px;
    height: 40px;
  }
}

/* Media query pour les très petits écrans */
/* Pour les très petits écrans */
@media (max-width: 480px) {
  .topbar {
    padding: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    height: 70px;
  }

  .left-section {
    display: none; 
  }

  .right-section {
    display: flex;
    align-items: center; 
  }

  .icon, .notifications {
    font-size: 20px;
  }

  .dropdown img {
    width: 35px;
    height: 35px;
  }
}

    </style>
    