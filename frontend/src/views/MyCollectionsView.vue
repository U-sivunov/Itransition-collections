<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>My collections</h3>
      <b-table hover :items="collections"></b-table>
      <b-form @submit="addNewCollection()">
        <b-form-input v-model="newCollectionName" placeholder="Enter new collection name"></b-form-input>
        <b-form-select v-model="newCollectionType" :options="collectionTypes"></b-form-select>
        <VMarkdownEditor v-model="newCollectionDescription" placeholder="Enter new collection description"></VMarkdownEditor>
        <div class="block-name" >String parameters</div>
        <div v-for="n in stringFieldsNumber">
          <b-form-input class="string-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === stringFieldsNumber || stringFieldsNumber === 0" variant="primary" v-on:click="stringFieldsNumber++">Add</b-button>
        </div>
        <div class="block-name" >Text parameters</div>
        <div v-for="n in textFieldsNumber">
          <b-form-input class="text-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === textFieldsNumber || textFieldsNumber === 0" variant="primary" v-on:click="textFieldsNumber++">Add</b-button>
        </div>
        <div class="block-name" >Boolean parameters</div>
        <div v-for="n in booleanFieldsNumber">
          <b-form-input class="boolean-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === booleanFieldsNumber || booleanFieldsNumber === 0" variant="primary" v-on:click="booleanFieldsNumber++">Add</b-button>
        </div>
        <div class="block-name" >Number parameters</div>
        <div v-for="n in numberFieldsNumber">
          <b-form-input class="number-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === numberFieldsNumber || numberFieldsNumber === 0" variant="primary" v-on:click="numberFieldsNumber++">Add</b-button>
        </div>
        <div class="block-name" >Date parameters</div>
        <div v-for="n in dateFieldsNumber">
          <b-form-input class="date-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === dateFieldsNumber || dateFieldsNumber === 0" variant="primary" v-on:click="dateFieldsNumber++">Add</b-button>
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
                collections: [],
                newCollectionName: '',
                newCollectionType: '',
                newCollectionDescription: '',
                stringFieldsNumber: 1,
                textFieldsNumber: 1,
                booleanFieldsNumber: 1,
                numberFieldsNumber: 1,
                dateFieldsNumber: 1,
                collectionTypes: []
            };
        },
        mounted() {
            axios
                .get("/api/collectionTypes")
                .then((res) => {
                    this.collectionTypes = res.data;
                });
            axios
                .get("/api/my-collections")
                .then((res) => {
                    this.collections = res.data;
                });
        },
        methods: {
            addNewCollection() {
                const stringFields = event.target.getElementsByClassName('string-field');
                const stringFieldsArray = [...stringFields].map(f => f.value);

                const textFields = event.target.getElementsByClassName('text-field');
                const textFieldsArray = [...stringFields].map(f => f.value);

                const booleanFields = event.target.getElementsByClassName('boolean-field');
                const booleanFieldsArray = [...stringFields].map(f => f.value);

                const numberFields = event.target.getElementsByClassName('number-field');
                const numberFieldsArray = [...stringFields].map(f => f.value);

                const dateFields = event.target.getElementsByClassName('string-field');
                const dateFieldsArray = [...stringFields].map(f => f.value);
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
</style>
