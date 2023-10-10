import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import App from "@/App.vue";
import Main from "@/views/Main.vue";
import HomePage from "@/views/HomePage.vue";
import Items from "@/views/Items.vue";
import Units from "@/views/Units.vue";
import Subjects from "@/views/Subjects.vue";
import Users from "@/views/Users.vue";
import Login from "@/views/Login.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [

  {
    path: "/items",
    name: "Items",
    component: Items,
  },
  {
    path: "/units",
    name: "Units",
    component: Units,
  },
  {
    path: "/subjects",
    name: "Subjects",
    component: Subjects,
  },

  {
    path: "/xs7daf8d",
    name: "Subjects",
    component: Subjects,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/",
    name: "Subjects",
    component: Subjects,
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
