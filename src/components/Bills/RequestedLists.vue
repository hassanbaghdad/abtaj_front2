<template>
  <div>
    <v-card class="ma-lg-8">
      <v-card-title>
        <v-icon color="orange">mdi-email</v-icon>
        <span class="mr-2">طلبات المواد</span>
      </v-card-title>
      <v-divider/>
      <v-card-title v-if="$vuetify.breakpoint.xs">
        <v-text-field label="اسم المحرر" outlined dense v-model="search.name" @keyup="search_req" prepend-inner-icon="mdi-magnify"/>
        <v-text-field label="الى" outlined dense  prepend-inner-icon="mdi-magnify"/>
        <v-text-field label="تاريخ الطلب" outlined dense v-model="search.created_at" @keyup="search_req" prepend-inner-icon="mdi-magnify"/>
        <v-text-field label="عدد الانواع" outlined dense v-model="search.count_items" @keyup="search_req" prepend-inner-icon="mdi-magnify"/>
        <v-text-field label="حالة الطلب" outlined dense v-model="search.list_state" @keyup="search_req" prepend-inner-icon="mdi-magnify"/>
      </v-card-title>
      <v-divider v-if="$vuetify.breakpoint.xs" />
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">ت</th>
              <th class="text-center">الى</th>
              <th class="text-center">المحرر</th>

              <th class="text-center">التاريخ</th>
              <th class="text-center">عدد النوع</th>
              <th class="text-center">الحالة</th>
              <th class="text-center">عرض</th>
              <th class="text-center">قبول</th>
              <th class="text-center">رفض</th>
              <th class="text-center">حذف</th>
            </tr>
            <tr v-if="!$vuetify.breakpoint.xs">
              <th class="text-center"></th>
              <th class="text-center"></th>
              <th class="text-center"><v-text-field outlined dense v-model="search.name" @keyup="search_req" prepend-inner-icon="mdi-magnify"/> </th>
              <th class="text-center"><v-text-field outlined dense v-model="search.created_at" @keyup="search_req" prepend-inner-icon="mdi-magnify"/> </th>
              <th class="text-center"><v-text-field outlined dense v-model="search.count_items" @keyup="search_req" prepend-inner-icon="mdi-magnify"/> </th>
              <th class="text-center"><v-text-field outlined dense v-model="search.list_state" @keyup="search_req" prepend-inner-icon="mdi-magnify"/> </th>
              <th class="text-center"></th>
              <th class="text-center"></th>
              <th class="text-center"></th>
              <th class="text-center"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(req , i) in requests" :key="'req_i_'+i">
              <td class="text-center">{{requests.indexOf(req)+1}}</td>
              <td class="text-center">{{req.to}}</td>
              <td class="text-center">{{req.name}}</td>
              <td class="text-center">{{req.created_at.substring(0,10)}}</td>
              <td class="text-center">{{req.count_items}}</td>
              <td class="text-center">{{req.state}}</td>
              <td class="text-center"><v-btn @click="set_list_to_view(req)" icon dark><v-icon color="info">mdi-eye</v-icon></v-btn>
              <td class="text-center"><v-btn  @click="change_state(req.list_id,1)" icon dark><v-icon color="success">mdi-check-circle</v-icon></v-btn>
              <td class="text-center"><v-btn  @click="change_state(req.list_id,0)" icon dark><v-icon color="pink">mdi-cancel</v-icon></v-btn>
              <td class="text-center"><v-btn @click="delete_list(req)" icon dark><v-icon color="error">mdi-delete</v-icon></v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <ViewMylistItems/>
  </div>
</template>

<script>
import ViewMylistItems from "@/components/Bills/ViewMylistItems.vue";

export default {
  name: "RequestedLists",
  components: { ViewMylistItems },
  filters:{
    get_list_state:function(val)
    {
      if (val == 0)
      {
        return "معلقة";
      }
      if (val == 1)
      {
        return "تم القبول";
      }

    }
  },
  data(){
    return{
      requests:[],
      requests_copy:[],
      loading:false,
      search:{
        name:'',
        created_at:'',
        list_state:'',
        count_items:null

      }

    }
  },
  methods:{
    get_requests()
    {
      this.loading = true;

      this.$axios.get('/api/lists/get-requests').then(res=>{
        res.data.map(x=>{
          x.to = this.$store.state.branches.branches.filter(item=>item.id == x.branche_id_fk)[0].title;
          return x;
        });
        this.requests = res.data;
        this.requests_copy = res.data;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    },
    search_req()
    {


      var filtered = this.requests_copy;
      if (this.search.name != null && this.search.name != "" && this.search.name != undefined)
      {
        filtered = filtered.filter(item=>item.name.toUpperCase().match(this.search.name.toUpperCase()))

      }
      if (this.search.list_state != null && this.search.list_state != "" && this.search.list_state != undefined)
      {
        filtered = filtered.filter(item=>item.state.toUpperCase().match(this.search.list_state.toUpperCase()))

      }
      if (this.search.created_at != null && this.search.created_at != "" && this.search.created_at != undefined)
      {
        filtered = filtered.filter(item=>item.created_at.toUpperCase().match(this.search.created_at.toUpperCase()))

      }
      if (this.search.count_items != null && this.search.count_items != "" && this.search.count_items != undefined)
      {
        filtered = filtered.filter(item=>item.count_items == this.search.count_items)

      }

      this.requests = filtered;

    },
    delete_list(item)
    {
      this.loading = true;
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {

        this.$axios.post('/api/lists/delete-list',{list_id:item.list_id}).then(res=>{
          this.get_requests();
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 2000
          });

        }).catch(err=>{
          this.$fire({
            title: "فشل",
            text: err.response.data.msg,
            type: "warning",
            timer: 3000
          })
        }).finally(fin=>{
          this.loading = false;
        })
      });
    },
    change_state(list_id, new_list_state)
    {
      this.loading = true;
        this.$axios.post('/api/lists/change-state',{list_id:list_id,list_state:new_list_state}).then(res=>{
          this.get_requests();
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 2000
          });
          this.get_requests();

        }).catch(err=>{
          this.$fire({
            title: "فشل",
            text: err.response.data.msg,
            type: "warning",
            timer: 3000
          })
        }).finally(fin=>{
          this.loading = false;
        })

    },
    set_list_to_view(list)
    {
      this.$store.state.subjects.list_target = list;
      this.$store.state.subjects.forms.view_list_items = true;
    }
  },
  created() {
    this.get_requests();
  }
};
</script>

<style scoped>

</style>