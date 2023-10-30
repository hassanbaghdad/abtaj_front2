import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Items from "@/views/Items.vue";
import Units from "@/views/Units.vue";
import Subjects from "@/views/Subjects.vue";
import Subjects2 from "@/views/Subjects2.vue";
import Users from "@/views/Users.vue";
import Login from "@/views/Login.vue";
import ItemsReports from "@/components/Items/ItemsReports.vue";
import PrintItemsReport from "@/components/Items/PrintItemsReport.vue";


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/items",
    name: "Items",
    component: Items,
  },
  {
    path: "/items-reports",
    name: "ItemsReports",
    component: ItemsReports,
  },
  {
    path: "/print-items-report",
    name: "PrintItemsReport",
    component: PrintItemsReport,
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
