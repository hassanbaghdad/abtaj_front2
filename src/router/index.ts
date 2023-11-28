import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Items from "@/views/Items.vue";
import Units from "@/views/Units.vue";
import Subjects from "@/views/Subjects.vue";
import Subjects2 from "@/views/Subjects2.vue";
import Users from "@/views/Users.vue";
import Login from "@/views/Login.vue";
import ItemsReports from "@/components/Items/ExpiredItemsReports.vue";
import PrintItemsReport from "@/components/Items/PrintItemsReport.vue";
import LatestSubjects from "@/views/LatestSubjects.vue";
import ExpiredItemsReports from "@/components/Items/ExpiredItemsReports.vue";
import ExpiredSoonItemsReports from "@/components/Items/ExpiredSoonItemsReports.vue";
import Bills from "@/views/Bills.vue";
import AddBill from "@/components/Bills/AddBill.vue";
import MyBills from "@/components/Bills/MyLists.vue";
import MyLists from "@/components/Bills/MyLists.vue";
import RequestedLists from "@/components/Bills/RequestedLists.vue";


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/items",
    name: "Items",
    component: Items,
  },
  {
    path: "/expired-items-reports",
    name: "ExpiredItemsReports",
    component: ExpiredItemsReports,
  },
  {
    path: "/expired-soon-items-reports",
    name: "ExpiredSoonItemsReports",
    component: ExpiredSoonItemsReports,
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
    path: "/latest-subjects",
    name: "LatestSubjects",
    component: LatestSubjects,
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
    name: "SubjectsHome",
    component: Subjects,
  },

  {
    path: "/bills/add-bill",
    name: "AddBill",
    component: AddBill,
  },
  {
    path: "/bills/mylists",
    name: "MyLists",
    component: MyLists,
  },
  {
    path: "/bills/requests",
    name: "RequestedLists",
    component: RequestedLists,
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
