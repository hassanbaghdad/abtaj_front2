<template>
  <div>
    <v-card class="ma-4" :loading="loading">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="3" lg="2">
            <v-icon color="grey">mdi-chart-bar</v-icon>
            <span class="mr-2">المواد المنتهية</span>
          </v-col>
          <v-col cols="12" md="3" lg="2">
            <v-btn color="blue" dark @click="print">
              <v-icon>mdi-printer</v-icon>
              <span class="mr-2">طباعة</span>
            </v-btn>
          </v-col>
        </v-row>

      </v-card-title>
      <v-divider/>

      <v-card-title>
        <v-row justify="center" class="pa-0 ma-0">
          <v-col cols="12" md="6">
            <v-text-field label="اسم المادة" v-model="search.name_subject" @keyup="search_subject2" prepend-inner-icon="mdi-magnify" outlined dense/>

          </v-col>
          <v-col cols="12" md="6">
            <v-select clearable label="الفئة" :items="$store.state.items.items_f" item-text="name_item" item-value="id_fk_item"  v-model="search.id_item" @change="search_subject2" prepend-inner-icon="mdi-magnify" outlined dense/>

          </v-col>
        </v-row>

      </v-card-title>
      <v-divider/>
      <v-card-text>
        <div class="print text-center">
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-center">ت</th>
                <th class="text-center">المادة</th>
                <th class="text-center">الفئة</th>
                <th class="text-center">العدد</th>
<!--                <th class="text-center">الحد الادنى للنفاذ</th>-->
              </tr>


              </thead>
              <tbody>
              <tr v-for="(sub,i) in pageOfItems" :key="'item_i_'+i">
                <td class="text-center">{{subjects.indexOf(sub)+1}}</td>
                <td class="text-center">{{sub.name_subject}}</td>
                <td class="text-center">{{sub.name_item}}</td>
                <td class="text-center">{{ sub.count }} {{sub.name_unit}}</td>
<!--                <td class="text-center">{{ sub.minimum }}</td>-->


              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>

      </v-card-text>
      <v-divider/>
     <v-card-text>
       <div class="mypag" v-if="!$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
         <jw-pagination :items="subjects" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
       </div>
       <div class="mypagdark" v-if="$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
         <jw-pagination :items="subjects" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
       </div>
     </v-card-text>
    <AddSubject/>
      <EditSubject/>
    </v-card>
  </div>
</template>
<script>
import JwPagination from 'jw-vue-pagination';
import AddSubject from "@/components/Subjects/AddSubject.vue";
import EditSubject from "@/components/Subjects/EditSubject.vue";
import $ from 'jquery'
const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};
export default {
  name: "ItemsReports",
  data(){
    return{
      loading:false,
      defaultLabels,
      pageOfItems: [],
      subjects:this.$store.state.items.reports,
      minimum:0,
      items_f:[],
      search:{
        name_subject:'',
        id_item:'',
      }
    }
  },
  components:{
    JwPagination,
    AddSubject,
    EditSubject
  },
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    get_subjects(mini)
    {
      this.loading = true;
      axios.post('api/items/get-items-reports',{minimum:mini}).then(res=>{
        var data = res.data;
        this.$store.state.items.reports = res.data;
        var filtered = data.filter(x=>{
          if(x.name_subject =="" || x.name_subject ==null || x.name_subject ==undefined)
          {
            x.name_subject ="";
          }
          if(x.name_item =="" || x.name_item ==null || x.name_item ==undefined)
          {
            x.name_item ="";
          }
          if(x.name_unit =="" || x.name_unit ==null || x.name_unit ==undefined)
          {
            x.name_unit ="";
          }
          if(x.count =="" || x.count ==null || x.count ==undefined)
          {
            x.count ="";
          }
          if(x.count !="" || x.count !=null || x.count !=undefined)
          {
            x.mycount =  x.count + ' ' + x.name_unit;
          }

          return x;
        });

        this.items_f = filtered;
        this.$store.state.items.reports = filtered.sort((a, b) => (a.name_subject > b.name_subject ? 1 : -1));;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    },
    search_subject2()
    {
      this.$store.state.items.id_item = null;
      var res = this.$store.state.items.reports;
      if (this.search.name_subject != null && this.search.name_subject != "" && this.search.name_subject != undefined)
      {
        res = res.filter(item=>item.name_subject.toLowerCase().match(this.search.name_subject.toLowerCase()));

      }
      if(this.search.id_item != null && this.search.id_item != "" && this.search.id_item != undefined && this.search.id_item > 0)
      {
        res = res.filter(item=>item.id_fk_item== this.search.id_item);
        this.$store.state.items.id_item = this.search.id_item;
      }

      this.subjects = res.sort((a, b) => (a.name_subject > b.name_subject ? 1 : -1));;
    },
    get_report(mini)
    {
      this.minimum = mini;
      this.get_subjects(mini);
    },

    print() {

      //console.log(this.subjects)
      this.$store.state.drawer =false;
      if (this.minimum == 0)
      {
        this.$store.state.items.title_print ="تقرير المواد المنتهية";
      }
      if (this.minimum == 1)
      {
        this.$store.state.items.title_print ="تقرير مواد على وشك النفاذ";
      }

      this.$store.state.items.reports =this.subjects;

      this.$router.push({
       // path:'/print-items-report/'+this.minimum,
        path:'/print-items-report',
      });
    }

  },
  created() {
    this.$store.commit("GET_ITEMS_REPORTS",0)

    this.subjects =[];
  //  this.$store.commit("GET_ITEMS_REPORTS",0);
   this.$store.state.items.id_item = null;
  },
  beforeCreate() {

  },
  computed:{
    get_subjects2() {
      return this.$store.state.items.reports;
    }
  },
  watch:{
    get_subjects2(new_reports) {
      this.subjects = new_reports;
    }
  },

};
</script>

<style >
.mypag ul li a{
  color: black !important;
}
.mypagdark ul li a{
  color: white !important;
}

</style>