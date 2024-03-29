<template>
    <h3>Search result for: {{this.$route.params.str}}</h3>
    <b-table hover :items="items" @row-clicked="goToItem"></b-table>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router';

    export default {
        inject: ['user'],
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
                .get("/api/search/" + this.$route.params.str)
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
