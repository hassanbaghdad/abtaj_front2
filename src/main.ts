import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);


new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
