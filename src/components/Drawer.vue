
  <template>


      <v-navigation-drawer

        app
                           right
dark
        v-model="$store.state.drawer"

color="#3f3736"
      >
        <v-list-item  style="height: 100px">
          <v-list-item-avatar>
            <v-icon dark>mdi-lock</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text">{{$store.state.user.name}}</v-list-item-title>
          </v-list-item-content>


        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            co
            v-for="item in routes"
            :key="item.title"
            link
            :to="item.to"
            v-show="item.level >= $store.state.user.level"
          >
            <v-list-item-icon>
              <v-icon dark>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="error" @click="logout">
              <v-icon>mdi-exit-run</v-icon>
              <span class="mr-2">تسجيل خروج</span>
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

  </template>


<script>
export default {
  name: "Drawer",
  data(){
    return{
      drawer: null,
      routes: [
        { title: 'المواد', icon: 'mdi-cube',to:'/subjects',level:2 },
        { title: 'الفئات', icon: 'mdi-text-box-outline',to:'/items' ,level: 2},
        { title: 'الوحدات', icon: 'mdi-clipboard-text-outline',to:'/units',level: 2 },
        { title: 'المشرفين', icon: 'mdi-account-group',to:'/users' ,level: 1},

      ],
    }
  },
  methods:{
    logout(){
      this.$axios.post('api/users/logout').then(res=>{
        localStorage.clear();
        this.$store.state.user.login = false;
        this.$store.state.drawer = false;
        this.$router.push("/login");

      })
    }
  }
};
</script>

<style scoped>

</style>