<template>
  <div class="page-wrapper">
    <h3>Create new {{collection.title}} item</h3>
    <b-form @submit.prevent="addNewItem()" >
      <b-form-input @keypress.enter.prevent v-model="newItemTitle" placeholder="Enter new Item name"></b-form-input>
      <div>
        <smart-tagz
          v-if="tagsLoaded"
          @keypress.enter.prevent
          autosuggest
          inputPlaceholder="Select Tags ..."
          :sources="availableTags"
          :allowPaste="{delimiter: ';'}"
          :allowDuplicates="false"
        />
      </div>
      <div v-if="collectionLoaded" class="additional-fields">
        <div v-for="i in collection.stringFieldNames.length">
          <label>{{collection.stringFieldNames[i-1]}}</label>
          <b-form-input class="string-field"></b-form-input>
        </div>
        <div v-for="i in collection.textFieldNames.length">
          <label>{{collection.textFieldNames[i-1]}}</label>
          <b-form-textarea class="text-field"></b-form-textarea>
        </div>
        <div v-for="i in collection.numberFieldNames.length">
          <label>{{collection.numberFieldNames[i-1]}}</label>
          <b-form-input type="number" class="number-field"></b-form-input>
        </div>
        <div v-for="i in collection.booleanFieldNames.length">
          <label>{{collection.booleanFieldNames[i-1]}}</label>
          <b-form-checkbox class="boolean-field"></b-form-checkbox>
        </div>
        <div v-for="i in collection.dateFieldNames.length">
          <label>{{collection.dateFieldNames[i-1]}}</label>
          <Datepicker class="date-field" v-model="dates[i-1]"></Datepicker>
        </div>
      </div>
      <b-button type="submit" variant="primary">Create Item</b-button>
    </b-form>
  </div>
</template>

<script>
    import axios from "axios";
    import { ref } from 'vue';
    export default {
        data() {
            return {
                collection: {},
                newItemTitle: '',
                newItemTags: [],
                availableTags: [],
                tagsLoaded: false,
                collectionLoaded: false,
                dates: []
            };
        },
        beforeCreate() {
            axios
                .get("/api/collections/" + this.$route.query.collectionId)
                .then((res) => {
                    this.collection = res.data;
                    this.collectionLoaded = true;
                });
            axios
                .get("/api/tags")
                .then((res) => {
                    this.availableTags = res.data;
                    this.tagsLoaded = true;
                });
        },
        methods: {
            addNewItem() {
                const tagElements = event.target.getElementsByClassName('tag-name');
                const tagArray = [...tagElements].map(f => f.innerText);
                const filteredTagArray = tagArray.filter((t) => !this.availableTags.includes(t));

                const stringFields = event.target.getElementsByClassName('string-field');
                const stringFieldsArray = [...stringFields].map(f => f.value);

                const textFields = event.target.getElementsByClassName('text-field');
                const textFieldsArray = [...textFields].map(f => f.value);

                const booleanFields = event.target.getElementsByClassName('boolean-field');
                const booleanFieldsArray = [...booleanFields].map(f => f._value);

                const numberFields = event.target.getElementsByClassName('number-field');
                const numberFieldsArray = [...numberFields].map(f => f.valueAsNumber);

                const dateArray = this.dates.map(f => ref(f)._value);
                console.log(dateArray)

                const newItem = {
                    title: this.newItemTitle,
                    collectionId: this.collection.id,
                    stringFieldValues: stringFieldsArray,
                    textFieldValues: textFieldsArray,
                    booleanFieldValues: booleanFieldsArray,
                    numberFieldValues: numberFieldsArray,
                    tags: filteredTagArray,
                    dateFieldValues: dateArray
                }
                axios
                    .post("/api/item",newItem)
                    .then((res) => {
                      console.log(res);
                    });
            }
        },
    };
</script>

<style>
  .additional-fields > div {
    max-width: 50%;
  }
</style>
