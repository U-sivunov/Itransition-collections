import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import MyCollectionsView from "../views/MyCollectionsView.vue";
import AllCollectionsView from "../views/AllCollectionsView.vue";
import NewCollectionView from "../views/NewCollectionView.vue";
import NewItemView from "../views/NewItemView.vue";
import SearchView from "../views/SearchView.vue";
import ItemView from "../views/ItemView.vue";
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
    path: "/all-collections",
    name: "all-collections",
    component: AllCollectionsView,
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
    path: "/items",
    name: "items",
    children:[{
      path: ':id',
      component: ItemView,
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
    path: "/search",
    name: "search-page",
    children:[{
      path: ':str',
      component: SearchView,
    },]
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
