<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>My collections</h3>
      <b-table hover :items="collections"></b-table>
      <b-form @submit="addNewCollection()">
        <b-form-input v-model="newCollectionName" placeholder="Enter new collection name"></b-form-input>
        <b-form-select v-model="newCollectionType" :options="newCollectionTypes"></b-form-select>
        <VMarkdownEditor v-model="newCollectionDescription" placeholder="Enter new collection description"></VMarkdownEditor>
        <div v-for="n in stringFieldsNumber">
          <b-form-input class="string-field" placeholder="Parameter name"></b-form-input>
          <b-button v-if="n === stringFieldsNumber" variant="primary" v-on:click="stringFieldsNumber++">Add</b-button>
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
                newCollectionTypes: [],
                newCollectionName: '',
                newCollectionType: '',
                newCollectionDescription: '',
                stringFieldsNumber: 2,
                collectionTypes: []
            };
        },
        mounted() {
            axios
                .get("/api/collectionTypes",            )
                .then((res) => {
                    this.collectionTypes = res;
                    console.log(res);
                });
        },
        methods: {
            addNewCollection() {
                const stringFields = event.target.getElementsByClassName('string-field');
                const stringFieldsArray = [...stringFields].map(f => f.value);
                console.log(stringFieldsArray);
                const newCollecton = {
                    title: this.newCollectionName,
                    description: this.newCollectionDescription,
                    stringFieldNames: stringFieldsArray,
                }
                axios
                    .post("/api/collection",newCollecton)
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
