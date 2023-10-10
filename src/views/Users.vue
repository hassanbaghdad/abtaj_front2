<template>
  <v-card class="ma-4" :loading="$store.state.loading">
    <v-card-title>
      <v-icon>mdi-lock</v-icon>
      <span class="mr-2">المشرفين</span>
    </v-card-title>
    <v-divider/>
    <v-card-title>
    <v-btn color="orange" fab small @click="$store.state.users.forms.add_user=true"><v-icon color="white">mdi-plus</v-icon></v-btn>

    </v-card-title>
    <v-card-title>
      <v-text-field  outlined prepend-inner-icon="mdi-magnify" @keyup="search_user" v-model="search.name" dense/>
    </v-card-title>

    <v-divider/>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th style="width: 50px;" class="text-center">ت</th>
            <th class="text-center">الاسم</th>
            <th class="text-center">اسم المستخدم</th>
            <th class="text-center">الصلاحية</th>
            <th style="width: 50px;" class="text-center">تعديل</th>
            <th style="width: 50px" class="text-center">حذف</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(u,i) in pageOfItems">
            <td class="text-center">{{users.indexOf(u)+1}}</td>
            <td class="text-center">{{u.name}}</td>
            <td class="text-center">{{u.username}}</td>
            <td class="text-center">{{u.level | user_level}}</td>
            <td class="text-center"><v-btn @click="set_to_edit(u)" icon><v-icon color="blue">mdi-pencil</v-icon></v-btn></td>
            <td class="text-center"><v-btn @click="delete_target(u)" icon><v-icon color="error">mdi-delete</v-icon></v-btn></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider/>
    <v-card-text>
      <div class="mypag" v-if="!$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="users" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
      <div class="mypagdark" v-if="$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="users" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
    </v-card-text>
<AddUser/>
    <EditUser/>
  </v-card>
</template>

<script>
import AddUser from "@/components/Users/AddUser.vue";
import EditUser from "@/components/Users/EditUser.vue";
import JwPagination from 'jw-vue-pagination';
const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};



export default {
  name: "Users",
  filters:{
    user_level:function(value)
    {
      if(value==1)
      {
        return "مدير";
      }
      if(value==2)
      {
        return "مشرف";
      }


    }
  },
  components:{

    JwPagination,
    AddUser,
    EditUser
  },
  data(){
    return{

      defaultLabels,
      pageOfItems: [],
      search:{
        name:'',
      },
      users:this.$store.state.users.users
    }
  },
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    search_user()
    {
      var filterd = this.$store.state.users.users;

      filterd = filterd.filter(x=>x.name.toLowerCase().match(this.search.name.toLowerCase()));



      this.users = filterd;
    },
    set_to_edit(target)
    {
      this.$store.state.users.target = target ;
      this.$store.state.users.forms.edit_user = true;
    }
    ,

    delete_target(target)
    {
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {
        this.$store.state.loading = true;
        this.$axios.post('api/users/delete-user',target).then(res=>{
          this.$store.commit("GET_USERS");
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.$store.state.users.forms.delete_user = false;

        }).catch(err=>{
          this.$fire({
            title: "فشل",
            text: err.response.data.msg,
            type: "warning",
            timer: 3000
          })
        }).finally(fin=>{
          this.$store.state.loading = false;
        })
      });
    }

  },
  created() {
    this.$store.commit("GET_USERS");
  },
  computed:{

    get_users2()
    {
      return this.$store.state.users.users;
    }
  },
  watch:{
    get_users2(new_users)
    {
      this.users = new_users;
    }
  },

};
</script>

<style scoped>

</style>