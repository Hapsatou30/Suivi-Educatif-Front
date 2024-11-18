<template>
  <div class="widget">
    <div class="widget-content">
      <h3>{{ title }}</h3>
      <span class="widget-number">{{ number }}</span>
    </div>
    <div class="icon">
      <img v-if="iconSrc" :src="iconSrc" alt="icon" class="widget-image" />
      <span v-else class="iconify" :data-icon="iconClass"></span>
    </div>
  </div>
</template>

<script setup>
//defineProps est une fonction qui permet de déclarer les propriétés qu'un composant peut recevoir.
defineProps(['title', 'number', 'iconClass', 'iconSrc']);
</script>

<style scoped>
.widget {
  background-color: white;
  padding: 10px;
  width: 250px;
  height: 100px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.widget:hover {
  transform: scale(1.05); /* Zoom à 105% au survol */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Ombre supplémentaire au survol */
}
.widget-content h3,
.widget-number {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: #F7AE00;
}

.widget-content {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
}

.iconify {
  font-size: 60px;
}

img {
  width: 90px !important;
  /* Assurez-vous que la largeur est appliquée */
  height: 90px !important;
}
@media (max-width: 992px) {
  .widget {
    width: 100%; /* S'assurer que chaque widget prend toute la largeur disponible */
  max-width: 95%; 
  margin-left: auto;
  margin-right: auto; 
  height: 200px;
  }
  .iconify {
  font-size: 120px;
}

img {
  width: 180px !important;
  /* Assurez-vous que la largeur est appliquée */
  height: 180px !important;
}
.widget-content h3,
.widget-number {
  font-size: 30px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: #F7AE00;
  text-align: center;
}
}
@media (max-width: 576px) {
  .widget {
    width: 100%; /* S'assurer que chaque widget prend toute la largeur disponible */
  max-width: 100%; 
  margin-left: auto;
  margin-right: auto; 
  height: 200px;
  }
  .iconify {
  font-size: 90px;
}

img {
  width: 150px !important;
  /* Assurez-vous que la largeur est appliquée */
  height: 150px !important;
}
.widget-content h3,
.widget-number {
  font-size: 30px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  color: #F7AE00;
  text-align: center;
}
}
</style>