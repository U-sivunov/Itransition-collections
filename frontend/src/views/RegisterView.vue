<template>
  <div class="login-dialog">
    <h2>Register</h2>
    <form @submit.prevent="register">
      <label>Username:</label>
      <b-form-input id="username" v-model="username" type="text" name="username" required />
      <br />
      <label>Password:</label>
      <b-form-input id="password" v-model="password" type="password" name="password" required />
      <br />
      <label>Email:</label>
      <b-form-input id="email" v-model="email" type="email" name="email" required />
      <br />
      <b-button type="submit">Register</b-button>
    </form>
    <b-alert v-if="errorTarget" variant="danger" dismissible>
      Such {{ errorTarget }} already exist
    </b-alert>
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
      errorTarget: "",
    };
  },
  methods: {
    register() {
      axios
        .post("/api/register", { username: this.username, password: this.password, email: this.email })
        .then((res) => {
          if (res.data.code === "P2002") {
            this.errorTarget = res.data.meta.target[0];
          } else {
            this.$router.push({ path: '/login-page'});
          }
        });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы регистрации */
</style>
