<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>My collections</h3>
      <b-table hover :items="collections" selectable  @row-clicked="goToCollection"></b-table>
      <CollectionComponent v-for="collection in collections" :collection="collection" v-on:click="goToCollection(collection.id)"></CollectionComponent>
      <router-link to="/new-collection" custom v-slot="{ navigate }">
        <b-button v-on:click="navigate">Create new collection</b-button>
      </router-link>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    import CollectionComponent from "@/components/CollectionComponent";
    export default {
        components: {CollectionComponent},
        data() {
            return {
                collections: [],
            };
        },
        mounted() {
            axios
                .get("/api/my-collections")
                .then((res) => {
                    this.collections = res.data;
                });
        },
        methods: {
            goToCollection(id) {
                this.$router.push({ path: '/collections/' + id })
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
