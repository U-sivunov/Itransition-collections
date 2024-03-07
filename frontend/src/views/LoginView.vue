<!-- frontend/src/views/Login.vue -->
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
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      fetch("loging", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify([this.username, this.password, this.email]),
      }).then((res) => {
        res.json().then((j) => {
          console.log(j);
        });
      });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы авторизации */
</style>
