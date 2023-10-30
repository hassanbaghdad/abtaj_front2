<template>
  <div>
    <div class="text-center" style="width: 100%;border: 1px solid black;background-color: #3a3939">
      <span class="ma-auto" style="color: white">{{title}} - {{dateprint}}</span>
    </div>
    <div  v-if="name_item != null && name_item != undefined && name_item != ''" class="text-center" style="width: 100%;border: 1px solid black;background-color: #797979">
      <span class="ma-auto" style="color: white">{{name_item}}</span>
    </div>


    <table class="print text-center ma-auto"  style="width: 100%;margin: 10px">
      <thead>
      <tr>
        <th class="text-center">ت</th>
        <th class="text-center">المادة</th>
        <th class="text-center" v-if="name_item == null || name_item == undefined || name_item == ''">الفئة</th>
        <th class="text-center">العدد</th>
<!--        <th class="text-center">الحد الادنى للنفاذ</th>-->
      </tr>


      </thead>
      <tbody>
      <tr v-for="(sub,i) in subjects" :key="'item_i_r_'+i">
        <td class="text-center">{{subjects.indexOf(sub)+1}}</td>
        <td class="text-center">{{sub.name_subject}}</td>
        <td class="text-center" v-if="name_item == null || name_item == undefined || name_item == ''">{{sub.name_item}}</td>
        <td class="text-center">{{ sub.count }} {{sub.name_unit}}</td>
<!--        <td class="text-center">{{ sub.minimum }}</td>-->


      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "PrintItemsReport",
  data(){
    return{
      subjects: this.$store.state.items.reports,
      mini:null,
      title:this.$store.state.items.title_print,
      id_item:this.$store.state.items.id_item,
      name_item:null,
      dateprint:''

      }
  },
  methods:{
    print()
    {
      //window.print();
    },
      get_name_item()
      {

        try {
          this.name_item = this.$store.state.items.items.filter(it=>it.id==this.id_item)[0].name_item

        }catch (e) {
          this.name_item = null;
        }
      },
    get_date_time()
    {
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.toLocaleTimeString();

      this.dateprint = date + ' ' + time;
    },
    get_data_to_print()
    {
      this.$store.state.loading = true;
       axios.post('api/items/get-items-reports',{minimum:this.mini}).then(res=>{
        let _data = res.data;
        this.subjects= _data ;
         if(this.mini == 0)
         {
           this.title= "تقرير المواد المنتهية";
         }
         if(this.mini == 1)
         {
           this.title = "تقرير مواد على وشك النفاذ";
         }

      }).catch(err=>{
        if(err.response.status ==401)
        {
          this.$store.state.user.login=false;
          this.$store.state.loading = false;
          this.$router.push('/login').catch(error=>{});
        }
      }).finally(function() {
      //  this.$store.state.loading = false;
         window.print();
      })
    }
  },

  computed:{
    get_subjects3() {
      return this.$store.state.items.reports;
    },
    get_id_item() {
      return this.$store.state.items.id_item;
    },

  },
  watch:{
    get_subjects3(new_reports) {
      this.subjects = new_reports;
    },
    get_id_item(new_id) {
      this.id_item = new_id
    },
  },

  created()
  {
  //  this.mini = this.$route.path.split('print-items-report/')[1];
  // this.get_data_to_print();
    //window.print()
    this.get_name_item();
    this.get_date_time();

  },
  mounted() {
    window.print();
  }
};
</script>

<style scoped>
.print{
  direction: rtl !important;
}
table ,tr, td, th {
  border: 1px solid black !important;
  border-collapse: collapse;
}
</style>