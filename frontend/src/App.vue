<template>
  <nav>
    {{user}}
    <div class="header-wrap">
      <div class="menu-wrap">
        <router-link to="/">Home</router-link>
        <router-link to="/my-collections" v-if="user.username">My collections</router-link>
        <router-link v-if="user.role === 'ADMIN'" to="/admin">Admin</router-link>
      </div>

      <div class="search-wrap">
        <b-form @submit="search()" style="display: flex">
          <b-form-input v-model="searchText" placeholder="Search"></b-form-input>
          <b-button type="submit">Find</b-button>
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

  .page-content {
    padding: 20px;
    text-align: start;
  }
  .login-dialog {
    text-align: center;
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
                id: undefined,
                role: ""
            },
            searchText: ''
        };
    },
    mounted() {
        if (localStorage.user) {
            this.user = JSON.parse(localStorage.user);
        }
    },
    methods: {
      logout() {
        axios
          .get("/api/logout")
          .then((res) => {
              console.log(res);
            if (res.status === 'success') {
              this.user.username = '';
              this.user.id = undefined;
              this.user.isAdmin = false;
              localStorage.clear();
            }
          });
      },
      search() {
        this.$router.push({ path: '/search/' + this.searchText});
      },
      getAuthUser() {
          axios
              .get("/api/getAuthUser")
              .then((res) => {
                  if (res.data.user) {
                      this.user.username = res.data.user.username;
                      this.user.role = res.data.user.role;
                      this.user.id = res.data.user.id;
                      localStorage.setItem('user', JSON.stringify(this.user));
                  }
              });
      }
    }
  };
</script>
