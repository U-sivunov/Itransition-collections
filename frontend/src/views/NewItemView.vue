<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>Create new Item</h3>
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
                    this.collectionTypes.push({ value: null, text: 'Please select type' });
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
