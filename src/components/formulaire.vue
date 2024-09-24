<template>
    <div class="form-container">
      <form @submit.prevent="submitForm">
        <!-- Génération dynamique des champs, deux par ligne -->
        <div v-for="(field, index) in groupedFields" :key="index" class="form-row">
          <div v-for="(field, fieldIndex) in field" :key="fieldIndex" class="form-group">
            <label :for="field.id">{{ field.label }}</label>
  
            <!-- Afficher un champ selon son type -->
            <div v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel'">
              <input
                :type="field.type"
                :id="field.id"
                v-model="formData[field.model]"
                :placeholder="field.placeholder"
                :required="field.required"
              />
            </div>
  
            <!-- Champ de type textarea -->
            <div v-else-if="field.type === 'textarea'">
              <textarea
                :id="field.id"
                v-model="formData[field.model]"
                :placeholder="field.placeholder"
                :required="field.required"
              ></textarea>
            </div>
  
            <!-- Champ de type select -->
            <div v-else-if="field.type === 'select'">
              <select
                :id="field.id"
                v-model="formData[field.model]"
                :required="field.required"
              >
                <option disabled value="">Choisissez une option</option>
                <option
                  v-for="(option, i) in field.options"
                  :key="i"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
  
        <!-- Bouton de soumission -->
        <button type="submit" class="btn-submit">{{ submitButtonLabel }}</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive, computed } from 'vue';
  
  // Déclaration des props pour les champs et le texte du bouton
  const props = defineProps({
    fields: {
      type: Array,
      required: true // Tableau d'objets représentant chaque champ du formulaire
    },
    submitButtonLabel: {
      type: String,
      default: 'Soumettre'
    }
  });
  
  // Initialiser les données réactives pour chaque champ du formulaire
  const formData = reactive({});
  
  // Remplir `formData` avec les modèles correspondants à chaque champ
  props.fields.forEach(field => {
    formData[field.model] = ''; // Initialiser chaque modèle avec une valeur vide
  });
  
  // Grouper les champs par deux
  const groupedFields = computed(() => {
    const result = [];
    for (let i = 0; i < props.fields.length; i += 2) {
      result.push(props.fields.slice(i, i + 2)); // Regrouper les champs par deux
    }
    return result;
  });
  
  // Fonction de soumission du formulaire
  const submitForm = () => {
    console.log('Formulaire soumis avec les données :', formData);
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 1090px;
    border: 1px solid #F7AE00;
    border-radius: 12px;
    background-color: white;
    margin-left: 300px;
    margin-right: 50px;
    margin-top: 30px;
    padding: 30px;
  }
  
  /* Mise en page avec deux colonnes */
  .form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .form-group {
    flex: 0 0 48%; 

  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 20px;

  }
  
  input,
  select {
    width: 395px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 58px;
  }
 
  textarea {
    width: 395px;
    height: 163px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 8px;
  }
  
  textarea {
    resize: vertical;
  }
  input::placeholder, textarea::placeholder{
    color: #ccc;
    font-size: 14px;
  }
  .btn-submit {
 
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    width: 200px;
    height: 58px;
  }
  
  .btn-submit:hover {
    background-color: #45a049;
  }
  </style>
  