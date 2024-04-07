<template>
  <b-form v-if="editMode" @submit="updateCollection()">
    <b-form-input v-model="collection.title" placeholder="Enter new collection name"></b-form-input>
    <b-form-select v-model="collection.type" :options="collectionTypes">
      <template #first>
        <b-form-select-option value="" disabled>Please select collection type</b-form-select-option>
      </template>
    </b-form-select>
    <VMarkdownEditor v-model="collection.description" placeholder="Enter new collection description"></VMarkdownEditor>
    <div class="parameters-wrapper">
      <div class="block-name" >String parameters</div>
      <b-form-input v-for="n in collection.stringFieldNames.length" class="string-field" v-model="collection.stringFieldNames[n-1]" placeholder="Parameter name"></b-form-input>
      <b-button variant="primary" v-on:click="collection.stringFieldNames.push('')"></b-button>
      <b-button variant="primary" v-on:click="collection.stringFieldNames.pull()"></b-button>
    </div>
<!--    <div class="parameters-wrapper">-->
<!--      <div class="block-name" >Text parameters</div>-->
<!--      <b-form-input v-for="n in textFieldsNumber" class="text-field" placeholder="Parameter name"></b-form-input>-->
<!--      <b-button variant="primary" v-on:click="textFieldsNumber++">Add</b-button>-->
<!--      <b-button variant="primary" v-on:click="textFieldsNumber&#45;&#45;">Remove</b-button>-->
<!--    </div>-->

<!--    <div class="parameters-wrapper">-->
<!--      <div class="block-name" >Boolean parameters</div>-->
<!--      <b-form-input v-for="n in booleanFieldsNumber" class="boolean-field" placeholder="Parameter name"></b-form-input>-->
<!--      <b-button variant="primary" v-on:click="booleanFieldsNumber++">Add</b-button>-->
<!--      <b-button variant="primary" v-on:click="booleanFieldsNumber&#45;&#45;">Remove</b-button>-->
<!--    </div>-->
<!--    <div class="parameters-wrapper">-->
<!--      <div class="block-name" >Number parameters</div>-->
<!--      <b-form-input v-for="n in numberFieldsNumber" class="number-field" placeholder="Parameter name"></b-form-input>-->
<!--      <b-button variant="primary" v-on:click="numberFieldsNumber++">Add</b-button>-->
<!--      <b-button variant="primary" v-on:click="numberFieldsNumber&#45;&#45;">Remove</b-button>-->
<!--    </div>-->
<!--    <div class="parameters-wrapper">-->
<!--      <div class="block-name" >Date parameters</div>-->
<!--      <b-form-input v-for="n in dateFieldsNumber" class="date-field" placeholder="Parameter name"></b-form-input>-->
<!--      <b-button variant="primary" v-on:click="dateFieldsNumber++">Add</b-button>-->
<!--      <b-button variant="primary" v-on:click="dateFieldsNumber&#45;&#45;">Remove</b-button>-->
<!--    </div>-->

    <b-button type="submit" variant="primary">Create collection</b-button>
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
        items:[],
        editMode: false
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
