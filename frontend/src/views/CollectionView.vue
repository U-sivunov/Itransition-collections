<template>
  <div class="admin-page">
    <div class="admin-types">
      <h3>Collection</h3>
      <b-table hover :items="collection"></b-table>
      <router-link to="{path:/new-item, params: { collectionId: 123 }}"  custom v-slot="{ navigate }">
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
                collectionTypes: []
            };
        },
        mounted() {
            console.log(7777)
            console.log(this.$router.params);
            axios
                .get("/api/collections/" + this.$route.params.id)
                .then((res) => {
                    this.collection = res.data;
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
</style>
