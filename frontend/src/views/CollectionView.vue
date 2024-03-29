<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>Collection</h3>
      <h2>{{collection.title}}</h2>
      <div class="description-wrap">
        <VMarkdownView :content="collection.description"></VMarkdownView>
      </div>
      <b-table hover :items="items"></b-table>
      <router-link :to="{
        path: '/new-item',
        query: {
          collectionId: collection.id
        }
      }" v-slot="{ navigate }">
        <b-button v-on:click="navigate">Add new item</b-button>
      </router-link>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router'
    const router = useRouter()

    export default {
        data() {
            return {
                collection: {},
                newCollectionName: '',
                newCollectionType: '',
                newCollectionDescription: '',
                stringFieldsNumber: 1,
                textFieldsNumber: 1,
                booleanFieldsNumber: 1,
                numberFieldsNumber: 1,
                dateFieldsNumber: 1,
                collectionTypes: [],
                items:[]
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
            goToItem() {
                router.push({ path: '/new-collection' })
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
