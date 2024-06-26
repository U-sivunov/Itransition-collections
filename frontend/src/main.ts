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
import { createStore } from 'vuex';
import Vue3WordCloud from 'vue3-word-cloud';

const store = createStore({
    state: {
        user: {}
    },
    mutations: {
        login (state, user) {
            state.user = user;
        },
        logout (state) {
            state.user = {}
        }
    }
})

axios.defaults.baseURL = "https://itransition-collections-back2.vercel.app/";
axios.defaults.withCredentials = true;

createApp(App)
    .use(router)
    .use(BootstrapVue3)
    .use(store)
    .component('VMarkdownEditor', VMarkdownEditor)
    .component('vue3-word-cloud', Vue3WordCloud)
    .component('VMarkdownView', VMarkdownView)
    .component('smart-tagz', SmartTagz)
    .component('Datepicker', VueDatePicker)
    .mount("#app");


