import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  rtl:true,
  theme: {
      themes:{
        light:{
          primary:'#3f3736'
        },
        dark:{
          primary:'#212121'
        },
      },
    dark:false

  },


});
