import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import BootstrapVue3 from "bootstrap-vue-3";
import { VMarkdownEditor } from "vue3-markdown";
import { VMarkdownView } from 'vue3-markdown'
import 'vue3-markdown/dist/style.css'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import { SmartTagz } from "smart-tagz";
import "smart-tagz/dist/smart-tagz.css";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

axios.defaults.baseURL = "https://itransition-collections-back2.vercel.app/";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(response => response, error => {
    console.error('Axios error');
    console.error(error.request);
    return Promise.reject(error);
});
createApp(App)
    .use(router)
    .use(BootstrapVue3)
    .component('VMarkdownEditor', VMarkdownEditor)
    .component('VMarkdownView', VMarkdownView)
    .component('smart-tagz', SmartTagz)
    .component('Datepicker', VueDatePicker)
    .mount("#app");


