<template>
    <h3>Search result for: {{this.$route.params.str}}</h3>
    <b-table hover :items="items" @row-clicked="goToItem"></b-table>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router';

    export default {
                computed: {
            user () {
                return this.$store.state.user
            }
        },
        data() {
            return {
                items:[]
            };
        },
        mounted() {
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
