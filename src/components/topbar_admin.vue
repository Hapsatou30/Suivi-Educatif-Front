<template>
    <div class="topbar">
      <div class="left-section">
        <Icon icon="mdi:calendar-outline" class="icon" />
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="right-section">
        <div class="notifications">
            <Icon icon="mdi:bell-outline" class=" notification" />
        </div>
        <div class="logout">
            <Icon icon="humbleicons:logout" width="30" height="30" class=" deconnexion" />
            Deconnexion
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Icon } from '@iconify/vue';
  import { ref, onMounted } from 'vue';

    const currentDate = ref('');

    const formatDate = () => {
    const date = new Date();
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
    };

    onMounted(() => {
    currentDate.value = formatDate();
    });
  </script>
  
  <style scoped>
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
  
  .left-section {
    display: flex;
    align-items: center;
    width: 262px;
    height: 58px;
    background-color: #F7AE00;
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .right-section {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon {
    font-size: 30px;
    margin-right: 20px;
  }
  
  .date {
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  }
  
  .notifications {
    font-size: 30px;
    margin-right: 10px;
    color: #F7AE00;
    margin-bottom: 5px;
  }
  
  .logout {
    cursor: pointer;
    font-family: "Poppins", sans-serif;
    color: #F7AE00;
  }
  </style>
  