<template>
    <div class="row fluid">
        <div class="col-6">
            <ul>
                <li v-for="item in items" :key="item.id" class="list-item">
                    <input 
                        type="checkbox" 
                        v-model="item.checked" 
                        class="checkbox" 
                        @change="updateSelection" 
                    />
                    <span class="item-name">
                        {{ item.prenom }}
                    </span>
                    <span class="item-name">{{ item.nom }}</span>
                    <span class="item-name">{{ item.professeur }} -> {{ item.matiere }}</span>
                    
                </li>
            </ul>
        </div>
        <div class="col-6">
            <img :src="imageSrc" alt="Image Description" class="img-fluid" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

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

// Émettre un événement au parent
const emit = defineEmits(['update:selectedItems']);

// Fonction pour émettre les items sélectionnés
const updateSelection = () => {
    const selectedItems = props.items.filter(item => item.checked).map(item => item.id);
    emit('update:selectedItems', selectedItems);
};
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
    margin-left: 240px;
    margin-top: 50px;
    margin-right: 50px;
    width: 80%;
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
