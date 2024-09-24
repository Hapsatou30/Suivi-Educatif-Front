<template>
    <div class="widget">
      <h3>{{ title }}</h3>
        <div class="widget-content">
      <span class="widget-number">{{ number }}</span>
      <span class="iconify" :data-icon="iconClass"></span>
    </div>
      </div>
  </template>
  
  <script setup>
  defineProps(['title', 'number', 'iconClass']);
  </script>
  
  <style scoped>
  .widget {
    background-color: white;
    padding: 15px;
    text-align: center;
    width: 250px;
    height: 100px;
    border-radius: 12px;
  }
  h3, .widget-number{
    font-size: 24px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    color: #F7AE00;
  }
  
  .widget-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  </style>
  