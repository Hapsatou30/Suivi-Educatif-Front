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
</style>