<template>
  <div class="collection-page">
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
      goToItem(row) {
          this.$router.push({ path: '/items/' + row.id })
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
