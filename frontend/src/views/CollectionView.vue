<template>
  <b-form v-if="editMode" @submit="updateCollection()">
    <b-form-input v-model="collection.title" placeholder="Enter new collection name"></b-form-input>
    <b-form-select v-model="collection.type" :options="collectionTypes">
    </b-form-select>
    <VMarkdownEditor v-model="collection.description" placeholder="Enter new collection description"></VMarkdownEditor>
    <div class="parameters-wrapper">
      <div class="block-name" >String parameters</div>
      <b-form-input v-for="n in collection.stringFieldNames" class="string-field" v-model="n.name" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.stringFieldNames.push({id: 0, name: ''})">Add</b-button>
      <b-button variant="primary" v-on:click="collection.stringFieldNames.pop()">Remove</b-button>
    </div>
    <div class="parameters-wrapper">
      <div class="block-name" >Text parameters</div>
      <b-form-input v-for="n in collection.textFieldNames" class="text-field" v-model="n.name" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.textFieldNames.push({id: 0, name: ''})">Add</b-button>
      <b-button variant="primary" v-on:click="collection.textFieldNames.pop()">Remove</b-button>
    </div>
    <div class="parameters-wrapper">
      <div class="block-name" >Boolean parameters</div>
      <b-form-input v-for="n in collection.booleanFieldNames" class="boolean-field" v-model="n.name" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.booleanFieldNames.push({id: 0, name: ''})">Add</b-button>
      <b-button variant="primary" v-on:click="collection.booleanFieldNames.pop()">Remove</b-button>
    </div>
    <div class="parameters-wrapper">
      <div class="block-name" >Number parameters</div>
      <b-form-input v-for="n in collection.numberFieldNames" class="number-field" v-model="n.name" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.numberFieldNames.push({id: 0, name: ''})">Add</b-button>
      <b-button variant="primary" v-on:click="collection.numberFieldNames.pop()">Remove</b-button>
    </div>
    <div class="parameters-wrapper">
      <div class="block-name" >Date parameters</div>
      <b-form-input v-for="n in collection.dateFieldNames" class="date-field" v-model="n.name" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.dateFieldNames.push({id: 0, name: ''})">Add</b-button>
      <b-button variant="primary" v-on:click="collection.dateFieldNames.pop()">Remove</b-button>
    </div>

    <b-button type="submit" variant="primary">Update collection</b-button>
  </b-form>
  <div v-if="!editMode" class="collection-page">
    <h3>Collection</h3>
    <h2>{{collection.title}}</h2>
    <h2>{{collection.collectionType}}</h2>
    <div class="description-wrap">
      <VMarkdownView :content="collection.description"></VMarkdownView>
    </div>
<!--    <b-table hover :items="items" @row-clicked="goToItem"></b-table>-->
    <item-component v-for="item in items" :collection="collection" :item="item"></item-component>
    <router-link v-if="user.id === collection.authorId  || user.role === 'ADMIN'" :to="{ path: '/new-item', query: { collectionId: collection.id }}" v-slot="{ navigate }">
      <b-button v-on:click="navigate">Add new item</b-button>
    </router-link>
    <b-button v-if="(user.id === collection.authorId || user.role === 'ADMIN') && !editMode" variant="primary" v-on:click="editModeOn()">Edit collection</b-button>
    <b-button v-if="(user.id === collection.authorId || user.role === 'ADMIN') && !editMode" variant="danger" v-on:click="deleteCollection()">Delete Collection</b-button>
  </div>
</template>

<script>
  import axios from "axios";
  import ItemComponent from "@/components/ItemComponent";
  import {ref} from "vue";

  export default {
    components: {ItemComponent},
      computed: {
        user () {
            return this.$store.state.user
        }
      },
    data() {
      return {
        collection: {},
        items: [],
        editMode: false,
        collectionTypes: []
      };
    },
    beforeCreate() {
      axios
        .get("/api/collections/" + this.$route.params.id)
        .then((res) => {
            this.collection = res.data;
        });
      axios
        .get("/api/items-by-collection/" + this.$route.params.id)
        .then((res) => {
            this.items = res.data;
        });
    },
    methods: {
      goToItem(row) {
          this.$router.push({ path: '/items/' + row.id })
      },
      editModeOn() {
        axios
          .get("/api/collectionTypes")
          .then((res) => {
              this.collectionTypes = res.data;
              this.editMode = true;
          });
      },
      deleteCollection() {

      },
      updateCollection() {
        let collection = ref(this.collection)._rawValue;
        collection = {where: {id: collection.id}, data: collection }
        delete collection.data.id;
        delete collection.data.createdAt;
        delete collection.data.updatedAt;
        delete collection.data._count;

        const fieldsNames = ['stringFieldNames','textFieldNames','booleanFieldNames','numberFieldNames','dateFieldNames'];
        fieldsNames.forEach(n => {
          const existingFields = [];
          const newFields = [];
          this.collection[n].forEach(obj => {
            if (obj.id === 0) {
                newFields.push({name: obj.name});
            } else {
                existingFields.push({where: {id: obj.id}, data: {name: obj.name}})
            }
          })
          collection.data[n] = {updateMany: existingFields, createMany: { data: newFields }};
        })

        axios
          .post("/api/update-collection", collection)
          .then((res) => {
              this.$router.go(0);
          })
          .catch(e => console.log(e));
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
