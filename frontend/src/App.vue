<template>
  <nav>
    <div class="header-wrap">
      <div class="menu-wrap">
        <router-link to="/">Home</router-link>
        <router-link to="/" v-if="!user.username">My collections</router-link>
      </div>

      <div class="search-wrap">
        <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
      </div>
      <div class="login-wrap">
        <div v-if="!user.username"><router-link to="/login-page">Login</router-link> | <router-link to="/register-page">Register</router-link></div>
        <div v-if="user.username">Hello, {{user.username}} <router-link v-on:click="logout()" to="/login-page">Logout</router-link></div> |
      </div>
    </div>
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
  .header-wrap {
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 20px;
  }
  .menu-wrap {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .search-wrap {
    flex-grow: 10;
    max-width: 50%;
  }

  .login-wrap div {
    /*display: flex;*/
    /*flex-direction: row;*/
    /*gap: 10px;*/
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
            .get(
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
