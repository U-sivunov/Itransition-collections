<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>Create new collection</h3>
      <b-form @submit="addNewCollection()">
        <b-form-input v-model="newCollectionName" placeholder="Enter new collection name"></b-form-input>
        <b-form-select v-model="newCollectionType" :options="collectionTypes">
          <template #first>
            <b-form-select-option value="" disabled>Please select collection type</b-form-select-option>
          </template>
        </b-form-select>
        <VMarkdownEditor v-model="newCollectionDescription" placeholder="Enter new collection description"></VMarkdownEditor>
        <div class="parameters-wrapper">
          <div class="block-name" >String parameters</div>
          <b-form-input v-for="n in stringFieldsNumber" class="string-field" placeholder="Parameter name"></b-form-input>
          <b-button variant="primary" v-on:click="stringFieldsNumber++">Add</b-button>
        </div>
        <div class="parameters-wrapper">
          <div class="block-name" >Text parameters</div>
          <b-form-input v-for="n in textFieldsNumber" class="text-field" placeholder="Parameter name"></b-form-input>
          <b-button variant="primary" v-on:click="textFieldsNumber++">Add</b-button>
        </div>

        <div class="parameters-wrapper">
          <div class="block-name" >Boolean parameters</div>
          <b-form-input v-for="n in booleanFieldsNumber" class="boolean-field" placeholder="Parameter name"></b-form-input>
          <b-button variant="primary" v-on:click="booleanFieldsNumber++">Add</b-button>
        </div>
        <div class="parameters-wrapper">
          <div class="block-name" >Number parameters</div>
          <b-form-input v-for="n in numberFieldsNumber" class="number-field" placeholder="Parameter name"></b-form-input>
          <b-button variant="primary" v-on:click="numberFieldsNumber++">Add</b-button>
        </div>
        <div class="parameters-wrapper">
          <div class="block-name" >Date parameters</div>
          <b-form-input v-for="n in dateFieldsNumber" class="date-field" placeholder="Parameter name"></b-form-input>
          <b-button variant="primary" v-on:click="dateFieldsNumber++">Add</b-button>
        </div>

        <b-button type="submit" variant="primary">Create collection</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
    import { VMarkdownEditor } from 'vue3-markdown'
    import axios from "axios";
    export default {
        data() {
            return {
                newCollectionName: '',
                newCollectionType: '',
                newCollectionDescription: '',
                stringFieldsNumber: 0,
                textFieldsNumber: 0,
                booleanFieldsNumber: 0,
                numberFieldsNumber: 0,
                dateFieldsNumber: 0,
                collectionTypes: []
            };
        },
        mounted() {
            axios
                .get("/api/collectionTypes")
                .then((res) => {
                    this.collectionTypes = res.data;
                });
        },
        methods: {
            addNewCollection() {
                const stringFields = event.target.getElementsByClassName('string-field');
                const stringFieldsArray = [...stringFields].map(f => f.value);

                const textFields = event.target.getElementsByClassName('text-field');
                const textFieldsArray = [...textFields].map(f => f.value);

                const booleanFields = event.target.getElementsByClassName('boolean-field');
                const booleanFieldsArray = [...booleanFields].map(f => f.value);

                const numberFields = event.target.getElementsByClassName('number-field');
                const numberFieldsArray = [...numberFields].map(f => f.value);

                const dateFields = event.target.getElementsByClassName('string-field');
                const dateFieldsArray = [...dateFields].map(f => f.value);
                const newCollection = {
                    title: this.newCollectionName,
                    description: this.newCollectionDescription,
                    collectionType: this.newCollectionType,
                    stringFieldNames: stringFieldsArray,
                    textFieldNames: textFieldsArray,
                    booleanFieldNames: booleanFieldsArray,
                    numberFieldNames: numberFieldsArray,
                    dateFieldNames: dateFieldsArray
                }
                axios
                    .post("/api/collection",newCollection)
                    .then((res) => {
                      console.log(res);
                    });
            }
        },
    };
</script>

<style>
  b-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .parameters-wrapper {
    border: solid 1px black;
    padding: 20px;
    margin: 20px;
  }
</style>
