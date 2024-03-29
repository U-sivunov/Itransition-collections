<template>
    <div class="admin-page">
        <div class="admin-users">
            <h3>Users</h3>
            <b-table hover :items="users" :fields="fields">
                <template v-slot:cell(actions)="{ item }">
                    <span><b-button @click="deleteUser(item)">Delete</b-button></span>
                    <span><b-button @click="adminUser(item)">Admin</b-button></span>
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
  import axios from "axios";
  export default {
    data() {
      return {
        collectionTypes: [],
        users: [],
        fields: ['id', 'username', 'email', 'role', 'actions'],
        newType: '',
      };
    },
    mounted() {
      axios
        .get("/api/collectionTypes",            )
        .then((res) => {
            this.collectionTypes = res.data;
        });
      axios.get("/api/users")
        .then((res) => {
            this.users = res.data;
        });
    },
    methods: {
        deleteUser(u) {
            console.log(u);
        },
        adminUser(u) {
            console.log(u);
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
