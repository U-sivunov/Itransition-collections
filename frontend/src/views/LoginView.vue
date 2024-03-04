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
      // Здесь вы можете реализовать логику отправки данных на сервер для аутентификации
      // Например, использовать axios или другую библиотеку для выполнения HTTP-запроса
      // Пример использования axios:
      // axios.post('/auth/login', { username: this.username, password: this.password })
      //   .then(response => {
      //     // Обработка успешного входа
      //   })
      //   .catch(error => {
      //     // Обработка ошибки входа
      //   });
    },
  },
};
</script>

<style scoped>
/* Ваши стили для страницы авторизации */
</style>
