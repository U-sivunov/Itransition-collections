<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>My collections</h3>
      <b-table hover :items="collections" selectable  @row-clicked="goToCollection"></b-table>
      <router-link to="/new-collection" custom v-slot="{ navigate }">
        <b-button v-on:click="navigate">Create new collection</b-button>
      </router-link>
    </div>
  </div>
</template>

<script>
    import axios from "axios";
    export default {
        data() {
            return {
                collections: [],
                newCollectionName: '',
                newCollectionType: '',
                newCollectionDescription: '',
                stringFieldsNumber: 1,
                textFieldsNumber: 1,
                booleanFieldsNumber: 1,
                numberFieldsNumber: 1,
                dateFieldsNumber: 1,
                collectionTypes: []
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
            goToCollection(row) {
                this.$router.push({ path: '/collections/' + row.id })
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
