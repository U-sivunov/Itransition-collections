<template>
    <h2>{{item}}</h2>
</template>

<script>
    import axios from "axios";
    import { useRouter } from 'vue-router';
    import ItemComponent from "@/components/ItemComponent";

    export default {
        components: {ItemComponent},
        inject: ['user'],
        data() {
            return {
              item
            };
        },
        beforeCreate() {
            axios
                .get("/api/item/" + this.$route.params.id)
                .then((res) => {
                    this.collection = res.data;
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
