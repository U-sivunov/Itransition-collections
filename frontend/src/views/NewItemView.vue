<template>
  <div class="page-wrapper">
    <h3>Create new {{collection.title}} item</h3>
    <b-form @submit.prevent="addNewItem()" >
      <b-form-input require @keypress.enter.prevent v-model="newItemTitle" placeholder="Enter new Item name"></b-form-input>
      <div>
        <smart-tagz
          v-if="tagsLoaded"
          @keypress.enter.prevent
          autosuggest
          inputPlaceholder="Select Tags ..."
          :sources="availableTags"
          :allowPaste="{delimiter: ','}"
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
          <Datepicker v-model="dates[i-1]"></Datepicker>
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
    props: {
        createNew: false
    },
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
            this.availableTags = res.data.map(t => t.name);
            this.tagsLoaded = true;
        });
    },
    methods: {
      addNewItem() {
        const tagElements = event.target.getElementsByClassName('tag-name');
        const tags = [...tagElements].map(f =>{
            return { name: f.innerText }
        });

        const newItem = {
            title: this.newItemTitle,
            collectionId: this.collection.id,
            tags: tags,
        }

        const types = [
              {tName: 'string', val: 'value'},
              {tName: 'text', val: 'value'},
              {tName: 'boolean', val: 'checked'},
              {tName: 'number', val: 'valueAsNumber'},
              {tName: 'date', val: 'value'},
            ];
        types.forEach((t) => {
            const fields = event.target.getElementsByClassName(t.tName + '-field');
            const fieldsArray = t.tName === 'date' ?
                [...this.dates].map((f, i) => { return {value: ref(f)._value, name: this.collection[t.tName+'FieldNames'][i]}}) :
                [...fields].map((f, i) => { return {value: f[t.val], name: this.collection[t.tName+'FieldNames'][i]}});
            const fieldsArrayCreate = { create: [...fieldsArray] }
            newItem[t.tName + 'FieldValues'] = fieldsArrayCreate
        })
        axios
            .post("/api/item",newItem)
            .then((res) => {
                this.$router.push({ path: '/collections/' + this.collection.id })
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
