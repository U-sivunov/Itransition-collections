import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import MyCollectionsView from "../views/MyCollectionsView.vue";
import NewCollectionView from "../views/NewCollectionView.vue";
import NewItemView from "../views/NewItemView.vue";
import SearchView from "../views/SearchView.vue";
import CollectionView from "../views/CollectionView.vue";
import AdminView from "../views/AdminView.vue";

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
    path: "/new-collection",
    name: "new-collections",
    component: NewCollectionView,
  },
  {
    path: "/collections",
    name: "collections",
    children:[{
      path: ':id',
      component: CollectionView,
    },]
  },
  {
    path: "/new-item",
    name: "new-item",
    component: NewItemView,
  },
  {
    path: "/login-page",
    name: "login-page",
    component: LoginView,
  },
  {
    path: "/search:str",
    name: "search-page",
    component: SearchView,
  },
  {
    path: "/register-page",
    name: "register-page",
    component: RegisterView,
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
