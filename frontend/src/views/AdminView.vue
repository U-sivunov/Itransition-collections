<template>
    <div class="admin-page">
        <div class="admin-users">
            <h3>Users</h3>
            <b-table hover :items="users"></b-table>
        </div>
        <div class="admin-types">
            <h3>CollectionTypes</h3>
            <b-table hover :items="collectionTypes"></b-table>
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
      };
    },
    mounted() {
        console.log('moooo');
      axios
          .get("/api/collectionTypes",            )
          .then((res) => {
              this.collectionTypes = res.data;
              console.log(res);
          });
      axios.get("/api/users")
          .then((res) => {
              this.users = res.data;
              console.log(res);
          });
    },
    methods: {

    },
  };
</script>
