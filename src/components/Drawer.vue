
  <template>


      <v-navigation-drawer


        app
                           right
dark
        v-model="$store.state.drawer"

color="#3f3736"
      >
        <v-list-item  style="height: 100px;background-color: #ed9700">
          <v-list-item-avatar>
            <v-icon dark>mdi-lock</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="white--text">
              {{$store.state.user.name}}
              <v-btn  left icon small @click="logout"><v-icon dark>mdi-exit-run</v-icon></v-btn>

            </v-list-item-title>
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
              <v-icon :color="item.color" dark>{{ item.icon }}</v-icon>
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
        { title: 'حميع المواد', icon: 'mdi-cube',to:'/subjects',level:3,color:'blue' },
        { title: 'المواد المضافة مؤخراً', icon: 'mdi-cube',to:'/latest-subjects',level:3,color:'success' },
        { title: 'المواد المنتهية', icon: 'mdi-chart-bar',to:'/expired-items-reports',level: 3,color:'grey' },
        { title: 'مواد على وشك الانتهاء', icon: 'mdi-chart-bar',to:'/expired-soon-items-reports',level: 3,color:'pink' },
        { title: 'سحب من المخزن', icon: 'mdi-store',to:'/bills/add-bill',level: 3,color:'white' },
        { title: 'طلباتي للمواد', icon: 'mdi-file-document-plus',to:'/bills/mylists',level: 3,color:'red' },
        { title: 'طلبات السحب', icon: 'mdi-email',to:'/bills/requests',level: 3,color:'orange' },

        { title: 'الفئات', icon: 'mdi-text-box-outline',to:'/items' ,level: 3,color:'orange'},
        { title: 'الوحدات', icon: 'mdi-clipboard-text-outline',to:'/units',level: 3 ,color:'blue'},
       { title: 'المشرفين', icon: 'mdi-account-group',to:'/users' ,level: 1,color:'error'},

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