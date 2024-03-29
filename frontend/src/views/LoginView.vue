<template>
  <div class="login-dialog">
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
            this.$localStorage.start();
            this.$localStorage.set('username', res.data.user.username);
            this.$localStorage.set('role', res.data.user.role);
            this.$localStorage.set('id', res.data.user.id);
            this.$router.push('/');
        }
        });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы авторизации */
</style>
