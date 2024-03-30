<template>
    <div class="admin-page">
        <div class="admin-users">
            <h3>Users</h3>
            <b-table hover :items="users" :fields="fields">
                <template v-slot:cell(actions)="{ item }">
                    <span><b-button @click="deleteUser(item)">Delete</b-button></span>
                    <span v-if="item.role !== 'ADMIN'"><b-button @click="adminUser(item)">Admin</b-button></span>
                    <span v-if="item.role === 'ADMIN'"><b-button @click="unAdminUser(item)">Unadmin</b-button></span>
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
      this.loadUsers();
    },
    methods: {
      adminUser(u) {
        axios.post("/api/admin", {id: u.id})
          .then((res) => {
              this.$router.go(0);
          });
      },
      unAdminUser(u) {
          axios.post("/api/unadmin", {id: u.id})
              .then((res) => {
                  this.$router.go(0);
              });
      },
      deleteUser(u) {
        axios.post("/api/delete-user", {id: u.id})
          .then((res) => {
              this.loadUsers();
          });
      },
      loadUsers() {
        axios.get("/api/users")
          .then((res) => {
              this.users = res.data;
          });
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
