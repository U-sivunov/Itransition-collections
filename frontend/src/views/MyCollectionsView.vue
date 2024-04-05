<template>
    <h3>My collections</h3>
<!--      <b-table hover :items="collections" selectable"></b-table>-->
    <CollectionComponent v-for="collection in collections" :collection="collection"></CollectionComponent>
    <router-link to="/new-collection" custom v-slot="{ navigate }">
      <b-button v-on:click="navigate">Create new collection</b-button>
    </router-link>
</template>

<script>
  import axios from "axios";
  import CollectionComponent from "@/components/CollectionComponent";
  export default {
    components: {CollectionComponent},
            computed: {
            user () {
                return this.$store.state.user
            }
        },
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
