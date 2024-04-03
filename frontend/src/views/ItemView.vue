<template>
    <b-form v-if="editmMde" @submit.prevent="addNewItem()" >
      <b-form-input @keypress.enter.prevent placeholder="Enter new Item name" v-model="item.title"></b-form-input>
      <div>
        <smart-tagz
          v-if="tagsLoaded"
          @keypress.enter.prevent
          autosuggest
          inputPlaceholder="Select Tags ..."
          :sources="availableTags"
          :allowPaste="{delimiter: ','}"
          :allowDuplicates="false"
          :defaultTags=item.tags
        />
      </div>
        <div class="additional-fields">
          <div v-for="f in item.stringFieldValues">
              <label>{{f.name}}</label>
              <b-form-input class="string-field" v-model="f.value"></b-form-input>
          </div>
          <div v-for="f in item.textFieldValues">
            <label>{{f.name}}</label>
            <b-form-input class="text-field" v-model="f.value"></b-form-input>
          </div>
          <div v-for="f in item.numberFieldValues">
            <label>{{f.name}}</label>
            <b-form-input type="number" class="number-field" v-model="f.value"></b-form-input>
          </div>
          <div v-for="f in item.booleanFieldValues">
            <label>{{f.name}}</label>
            <b-form-checkbox class="boolean-field" v-model="f.value"></b-form-checkbox>
          </div>
          <div v-for="f in item.dateFieldValues">
            <label>{{f.name}}</label>
            <Datepicker v-model="f.value"></Datepicker>
          </div>
        </div>
        <b-button type="submit" variant="primary">Create Item</b-button>
    </b-form>
    <div  v-if="!editmMde" @submit.prevent="addNewItem()" >
      <div>{{item.title}}</div>
      <div class="item-tags">
        <div v-for="tag in item.tags">
          {{tag}}
        </div>
      </div>
      <div class="additional-fields">
        <div v-for="f in item.stringFieldValues">
          <div>{{f.name}}:</div>
          <div>{{f.value}}</div>
        </div>
        <div v-for="f in item.textFieldValues">
          <div>{{f.name}}:</div>
          <div>{{f.value}}</div>
        </div>
        <div v-for="f in item.numberFieldValues">
          <div>{{f.name}}:</div>
          <div>{{f.value}}</div>
        </div>
        <div v-for="f in item.booleanFieldValues">
          <label>{{f.name}}</label>
          <b-form-checkbox class="boolean-field" v-model="f.value" disabled></b-form-checkbox>
        </div>
        <div v-for="f in item.dateFieldValues">
          <div>{{f.name}}</div>
          <div>{{f.value}}</div>
        </div>
      </div>
  </div>
  <b-button v-if="user.id === item.authorId" variant="primary" v-on:click="editMode()">Edit item</b-button>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router';
    import ItemComponent from "@/components/ItemComponent";
    import {ref} from "vue";

    export default {
        components: {ItemComponent},
        inject: ['user'],
        data() {
            return {
              item: {},
              collection: {},
              editMode: false
            };
        },
        beforeCreate() {
            axios
                .get("/api/item/" + this.$route.params.id)
                .then((res) => {
                    this.item = res.data;
                    this.collection = res.data.collection;
                });
        },
        methods: {
            addNewItem() {
                const tagElements = event.target.getElementsByClassName('tag-name');
                const tagArray = [...tagElements].map(f => f.innerText);
                // const uniqTagArray = tagArray.filter((t) => !this.availableTags.includes(t));

                // const dateArray = this.dates.map((f, i) => { return {value: ref(f)._value, name: this.collection[t+'FieldNames'][i]}});


                const newItem = {
                    title: this.newItemTitle,
                    collectionId: this.collection.id,
                    tags: tagArray,
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
                      console.log(res);
                  });
            },
            editMode() {
                axios
                    .get("/api/tags")
                    .then((res) => {
                        this.availableTags = res.data;
                        this.tagsLoaded = true;
                        this.editMode = true;
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
  .description-wrap {
    border: solid 1px blue;
    padding: 10px;
  }
</style>
