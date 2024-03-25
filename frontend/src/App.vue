<template>
  <nav>
    <router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |
    <router-link v-if="!user.username" to="/login-page">Login</router-link> |
    <p v-if="username">Hello, {{user.username}} <router-link v-on:click="logout()" to="/">Logout</router-link></p> |
    <router-link to="/register-page">Register</router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script>
    import axios from "axios";
    export default {
        provide() {
            return {
                user: this.user
            };
        },
        data() {
            return {
                user: {
                    username: "",
                    isAdmin: false,
                }
            };
        },
      methods: {
        logout() {
          axios
                  .post(
                          "/api/logout",
                  )
                  .then((res) => {
                    if (res.status === 'success') {
                      console.log('logouted');
                      this.user.username = '';
                      this.user.isAdmin = false;
                    }
                  });
        },
      }
    };
</script>
