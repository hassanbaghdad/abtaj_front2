<template>
  <div>
    <v-card class="ma-lg-8">
      <v-card-title>
        <v-icon>mdi-file-document-plus</v-icon>
        <span class="mr-2">طلبات المواد الخاصة بي</span>
      </v-card-title>
      <v-divider/>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">ت</th>
              <th class="text-center">عدد المواد</th>
              <th class="text-center">تاريخ الطلب</th>
              <th class="text-center">الحالة</th>
              <th class="text-center">عرض</th>
              <th class="text-center">حذف</th>
            </tr>
            </thead>
            <tbody>
            <tr  v-for="(item ,i) in lists" :key="'list_i_'+i">

              <td class="text-center">{{lists.indexOf(item)+1}}</td>
              <td class="text-center">{{item.count_items}}</td>
              <td class="text-center">{{item.created_at.substring(0,10)}}</td>
              <td class="text-center">
                <v-icon v-if="item.list_state == 0">mdi-clock-outline</v-icon>
                <v-icon v-if="item.list_state == 1" color="success">mdi-check</v-icon>
              </td>
              <td class="text-center">
                <v-btn @click="set_list_to_view(item)" icon dark color="info">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </td>
              <td class="text-center">
                <v-btn @click="delete_list(item)" icon dark color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <ViewMylistItems/>
    </v-card>
  </div>
</template>

<script>
import ViewMylistItems from "@/components/Bills/ViewMylistItems.vue";

export default {
  name: "MyBills",
  components: { ViewMylistItems },
  filters:{
    list_state:function(value)
    {
      if (value == 0)
      {
        return "قيد الانتظار";
      }
      if (value == 1)
      {
        return "تم القبول";
      }

    }
  },
  data(){
    return{
      lists:[],
      loading:false,
    }
  },
  methods:{
    get_mylists()
    {
      this.loading = true;
      this.$axios.post('/api/lists/get-mylists',{list_state:0}).then(res=>{
        this.lists = res.data;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    },
    delete_list(item)
    {
      this.loading = true;
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {

        this.$axios.post('/api/lists/delete-list',{list_id:item.list_id}).then(res=>{
          this.get_mylists();
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
    set_list_to_view(list)
    {
      this.$store.state.subjects.list_target = list;
      this.$store.state.subjects.forms.view_list_items = true;
    }
  },
  created() {
    this.get_mylists();
  }
};
</script>

<style scoped>

</style>