<template>
  <h3>All collections</h3>
  <CollectionComponent v-for="collection in collections" :collection="collection"></CollectionComponent>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router'
    import CollectionComponent from "@/components/CollectionComponent";
    const router = useRouter()

    export default {
        components: {CollectionComponent},
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
