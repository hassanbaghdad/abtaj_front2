<template>
  <v-app>

      <Drawer/>

    <v-app-bar app color="primary">
      <v-btn  icon dark @click="$store.state.drawer = !$store.state.drawer"><v-icon>mdi-menu</v-icon></v-btn>
      <v-spacer/>
      <v-btn v-if="!$vuetify.theme.dark"  icon @click="$vuetify.theme.dark=true">
        <v-icon color="white">mdi-moon-waxing-crescent</v-icon>
      </v-btn>
      <v-btn v-if="$vuetify.theme.dark" icon @click="$vuetify.theme.dark=false">
        <v-icon>mdi-white-balance-sunny</v-icon>
      </v-btn>


    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import vuetify from "@/plugins/vuetify";
import Drawer from "@/components/Drawer.vue";

export default Vue.extend({
  name: "App",
  components: { Drawer },
  methods: {
    vuetify() {
      return vuetify
    }
  },

  data: () => ({
    //
  }),
  created() {
    this.$store.commit("GET_ITEMS")
    this.$store.commit("GET_UNITS")
  }
});
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400&display=swap');
*{
  font-family: 'Cairo', sans-serif;
}
</style>