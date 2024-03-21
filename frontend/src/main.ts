import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

axios.defaults.baseURL = "https://itransition-collections-back2.vercel.app/";
axios.interceptors.response.use(
  function (response) {
    console.log("respppp");
    return response;
  },
  function (error) {
    console.log("errrrrrrr");
    return Promise.reject(error);
  }
);
createApp(App).use(router).mount("#app");
