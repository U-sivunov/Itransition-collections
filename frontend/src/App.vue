<template>
  <nav>
    {{user}}
    <div class="header-wrap">
      <div class="menu-wrap">
        <router-link to="/">Home</router-link>
        <router-link to="/my-collections" v-if="user.username">My collections</router-link>
        <router-link to="/all-collections">All collections</router-link>
        <router-link v-if="user.role === 'ADMIN'" to="/admin">Admin</router-link>
      </div>

      <div class="search-wrap">
        <b-form @submit="search()" style="display: flex">
          <b-form-input v-model="searchText" placeholder="Search"></b-form-input>
          <b-button type="submit" variant="primary">Find</b-button>
        </b-form>
      </div>
      <div class="login-wrap">
        <div v-if="!user.username"><router-link to="/login-page">Login</router-link> | <router-link to="/register-page">Register</router-link></div>
        <div v-if="user.username">Hello, {{user.username}}! <router-link v-on:click="logout()" to="/login-page">| Logout</router-link></div>
      </div>
    </div>
  </nav>
  <div class="page-content">
    <router-view />
  </div>
  <div v-if="spinner" class="spinner-wrapper">
    <b-spinner variant="primary" label="Spinning"></b-spinner>
  </div>
</template>

<style>
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
    align-items: center;
    width: 100%;
    gap: 20px;
    background-color: lightgreen;
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

  .search-wrap input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .search-wrap button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .login-wrap div {
    /*display: flex;*/
    /*flex-direction: row;*/
    /*gap: 10px;*/
  }

  .page-content {
    padding: 20px;
    text-align: start;
  }

  .login-dialog {
    text-align: center;
    width: 50%;
    margin: auto;
  }

  .spinner-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(2px);
    top: 0;
    transition-duration: .3s;
  }
</style>

<script>
  import axios from "axios";
  export default {
    computed: {
        user () {
            return this.$store.state.user
        }
    },
    provide() {
      return {
          spinner: this.spinner
      };
    },
    data() {
      return {
        spinner: false,
        searchText: ''
      };
    },
    mounted() {
        this.initSpinner();
        this.getAuthUser();
    },
    methods: {
      logout() {
        axios
          .get("/api/logout")
          .then((res) => {
              this.$store.commit('logout');
          });
      },
      search() {
        this.$router.push({ path: '/search/' + this.searchText});
      },
      getAuthUser() {
        axios
          .get("/api/getAuthUser")
          .then((res) => {
            if (res.data) {
              this.$store.commit('login', res.data);
            } else {
                this.$store.commit('logout');
                this.$router.push({ path: '/'})
            }
          })
        .catch(() => {
          this.$store.commit('logout');
        });
      },
      initSpinner() {
        axios.interceptors.request.use(function (config) {
            this.spinner = true;
            return config;
        }.bind(this), function (error) {
            this.spinner = false;
            return Promise.reject(error);
        }.bind(this));
        axios.interceptors.response.use(function (response) {
            this.spinner = false;
            return response;
        }.bind(this), function (error) {
            this.spinner = false;
            return Promise.reject(error);
        }.bind(this));
      }
    }
  };
</script>
