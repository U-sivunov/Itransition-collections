<template>
    <b-form v-if="editMode" @submit.prevent="updateItem()" >
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
        <b-button type="submit" variant="primary">Update Item</b-button>
    </b-form>
    <div  v-if="!editMode">
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
  <b-button v-if="user.id === item.authorId && editMode" variant="primary" v-on:click="editModeOn()">Edit item</b-button>
  <b-button v-if="user.id === item.authorId" variant="danger" v-on:click="deleteItem()">Delete item</b-button>
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
              editMode: false,
              tagsLoaded: false,
              availableTags: []
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
            updateItem() {
                axios
                  .patch("/api/item",this.item)
                  .then((res) => {
                      this.$router.push({ path: '/my-collections'});
                  });
            },
            editModeOn() {
                axios
                    .get("/api/tags")
                    .then((res) => {
                        this.availableTags = res.data;
                        this.tagsLoaded = true;
                        this.editMode = true;
                    });
            },
            deleteItem() {
                axios
                    .delete("/api/item")
                    .then((res) => {

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
