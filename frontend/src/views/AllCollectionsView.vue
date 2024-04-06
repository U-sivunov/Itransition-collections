<template>
  <h3>All collections</h3>
  <b-table hover :items="collections"></b-table>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router'
    const router = useRouter()

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
                .get("/api/all-collections")
                .then((res) => {
                    this.collections = res.data;
                });
        },
        methods: {
            goToNew() {
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
