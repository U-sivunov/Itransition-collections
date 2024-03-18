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
  <div v-on:click="test()">testttt</div>
</template>

<script>
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
      // axios.post("/api/register",{username: this.username, password: this.password, email: this.email});
      fetch("api/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify([this.username, this.password, this.email]),
      }).then((res) => {
        res.json().then(() => {
          console.log("555555555555");
        });
      });
    },
    test() {
      console.log("tessttt");
      fetch(process.env.API_URL + "api/test", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      }).then((res) => {
        console.log("555555555555");
        console.log(res);
      });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы регистрации */
</style>
