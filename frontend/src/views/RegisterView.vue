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
    <div v-if="errorTarget">such {{ errorTarget }} already exist</div>
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
      email: "",
      errorTarget: "",
    };
  },
  methods: {
    register() {
      axios
        .post("/api/register", { username: this.username, password: this.password, email: this.email })
        .then((res) => {
          console.log(res);
          if (res.data.code === "P2002") {
            this.errorTarget = res.data.meta.target[0];
          }
        });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы регистрации */
</style>
