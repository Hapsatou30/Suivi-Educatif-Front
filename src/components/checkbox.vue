<template>
    <div class="row container">
        <div class="col-6">
            <ul>
                <li v-for="item in items" :key="item.id" class="list-item">
                    <input type="checkbox" v-model="item.checked" class="checkbox" />
                    <span class="item-name">{{ item.nom }}</span>
                </li>
            </ul>

        </div>
        <div class="col-6">
            <img :src="imageSrc" alt="Image Description" class="img-fluid" />
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

// Définir les props que ce composant peut recevoir
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
});
</script>

<style scoped>
.img-fluid {
    max-width: 600px;
    height: auto;
}
.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-left: 225px;
    margin-top: 50px;
    margin-right: 50px;
    width: 800px;
}
.list-item {
    display: flex;            
    align-items: center; 
    gap: 20px;
    margin: 20px;
    
}

.item-name {
    font-size: 20px;
    color: #000000;  
    font-family: "Poppins", sans-serif;
    font-weight: 500;   
}
input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;   
    appearance: none;         
    width: 20px;             
    height: 20px;             
    border: 2px solid #CFD3D4; 
    border-radius: 8px;      
    outline: none;           
    cursor: pointer;        
}

input[type="checkbox"]:checked {
    background-color: #4862C4; 
    border-color: #4862C4;    
}

input[type="checkbox"]:checked::after {
    content: "✔";
    color: white;
    font-size: 16px; 
    position: relative;
  left: -5px;
  top: -10px;
}

</style>
