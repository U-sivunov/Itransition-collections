<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>Collection</h3>
      <b-table hover :items="collection"></b-table>
      <b-button v-on:click="goToItem">Create new collection</b-button>
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
                collectionTypes: []
            };
        },
        mounted() {
            axios
                .get("/api/collection/" + this.$router.params.id)
                .then((res) => {
                    this.collections = res.data;
                });
        },
        methods: {
            goToItem() {
                console.log(7777)
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
</style>
