<template>
  <div class="login-dialog">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <label>Username:</label>
      <b-form-input id="username" v-model="username" type="text" name="username" required />
      <br />
      <label>Password:</label>
      <b-form-input id="password" v-model="password" type="password" name="password" required />
      <br />
      <b-button type="submit">Login</b-button>
    </form>
    {{ errorMessage }}
    <b-alert v-if="errorMessage" variant="danger">
      {{ errorMessage }}
    </b-alert>
    <b-alert variant="danger">
      {{ errorMessage }}
    </b-alert>
    <b-alert variant="danger">
      еуыыые
    </b-alert>
  </div>
</template>

<script>
import axios from "axios";
export default {
          computed: {
            user () {
                return this.$store.state.user
            }
        },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      axios
        .post(
          "/api/login",
          { username: this.username, password: this.password, email: this.email }
        )
        .then((res) => {
        if (res.data.status === 'success') {
            this.user.username = res.data.user.username;
            this.user.role = res.data.user.role;
            this.user.id = res.data.user.id;
            localStorage.setItem('user', JSON.stringify(this.user));
            this.$store.commit('login', res.data.user);
            this.$router.push({ path: '/my-collections'});
        }})
        .catch( e => {
            this.errorMessage = e.response.data.message;
            console.log(e)
        });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы авторизации */
</style>
