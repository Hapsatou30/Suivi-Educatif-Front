<template>
    <sidebar_admin />
    <topbar_admin />
    <div class="main-content">
      <boutons
        title1="Matières" 
        title2="Professeurs"
        page1="matiere"
        page2="professeur"
      />

      <h2>Formulaire pour ajouter des Professeurs</h2>

      <div class="form">
        <Formulaire
            :fields="[
            { id: 'name', label: 'Nom', type: 'text', placeholder: 'Entrez votre nom', model: 'name', required: true },
            { id: 'name', label: 'Prénom', type: 'text', placeholder: 'Entrez votre prénom', model: 'name', required: true },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'Entrez votre email', model: 'email', required: true },
            { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: 'Entrez votre numéro de téléphone', required: true },
            ]"
            submitButtonLabel="Enregistrer"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import sidebar_admin from '@/components/sidebarAdmin.vue';
  import topbar_admin from '@/components/topbarAdmin.vue';
  import boutons from '@/components/boutons.vue';
  import Formulaire from '@/components/formulaire.vue';
  </script>
  
 <style>
.main-content { 
  margin-top: 120px;
}
h2{
    color: black;
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    text-align: center;
    margin-left: 300px;
   
}
</style>