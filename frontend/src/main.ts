import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import BootstrapVue3 from "bootstrap-vue-3";
import { VMarkdownEditor } from "vue3-markdown";
import 'vue3-markdown/dist/style.css'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

axios.defaults.baseURL = "https://itransition-collections-back2.vercel.app/";
axios.defaults.withCredentials = true;
createApp(App)
    .use(router)
    .use(BootstrapVue3)
    .component('VMarkdownEditor', VMarkdownEditor)
    .mount("#app");


