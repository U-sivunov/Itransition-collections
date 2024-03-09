<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label for="username">Username:</label>
      <input id="username" v-model="username" type="text" name="username" required />
      <br />
      <label for="password">Password:</label>
      <input id="password" v-model="password" type="password" name="password" required />
      <br />
      <label for="email">Email:</label>
      <input id="email" v-model="email" type="email" name="email" required />
      <br />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      password: "",
      email: "",
    };
  },
  methods: {
    register() {
      console.log("j");
      // axios.post("/api/register",{username: this.username, password: this.password, email: this.email});
      fetch("api/registering", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify([this.username, this.password, this.email]),
      }).then((res) => {
        res.json().then((j) => {
          console.log("555555555555");
        });
      });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы регистрации */
</style>
