import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import MyCollectionsView from "../views/MyCollectionsView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/my-collections",
    name: "my-collections",
    component: MyCollectionsView,
  },
  {
    path: "/login-page",
    name: "login-page",
    component: LoginView,
  },
  {
    path: "/register-page",
    name: "register-page",
    component: RegisterView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
