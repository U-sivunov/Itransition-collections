<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input id="username" v-model="username" type="text" name="username" required />
      <br />
      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" name="password" required />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
  <button v-on:click="test()">test</button>
</template>

<script>
import axios from "axios";
export default {
  inject: ['user'],
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .post(
          "/api/login",
          { username: this.username, password: this.password, email: this.email },
          { withCredentials: true }
        )
        .then((res) => {
        if (res.data.status === 'success') {
            this.user.username = res.data.user.username;
            this.user.isAdmin = res.data.user.isAdmin;
        }
        console.log(res);
        });
    },
    test() {
      axios.get("/api/users", { withCredentials: true }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы авторизации */
</style>
