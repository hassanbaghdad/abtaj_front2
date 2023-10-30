<template>
  <div>
    <v-card class="ma-4" :loading="loading">
      <v-card-title>
        <v-icon>mdi-cube</v-icon>
        <span class="mr-2">المواد</span>
      </v-card-title>
      <v-divider/>
      <v-card-title v-if="$store.state.user.level ==1 || $store.state.user.level ==2">
        <v-btn color="orange" fab small @click="$store.state.subjects.forms.add_subject=true"><v-icon color="white">mdi-plus</v-icon></v-btn>

      </v-card-title>
      <v-divider/>
      <v-card-title>
        <v-row>
          <v-col cols="12" md="3" lg="2">
            <v-btn color="blue" dark block @click="get_subjects_custom(0)">
              <v-icon>mdi-eye</v-icon>
              <span class="mr-2">عرض جميع المواد</span>
            </v-btn>
          </v-col>
          <v-col cols="12" md="3" lg="2">
            <v-btn  color="success" dark block @click="get_subjects_custom(1)">
              <v-icon>mdi-eye</v-icon>
              <span class="mr-2">عرض المواد المضافة مؤخراً</span>
            </v-btn>
          </v-col>

        </v-row>





      </v-card-title>
      <v-divider/>
      <v-card-title>
        <v-row justify="center" class="pa-0 ma-0">
          <v-col cols="12" md="6">
            <v-text-field label="اسم المادة"  v-model="search.name_subject" @keyup="search_subject" prepend-inner-icon="mdi-magnify" outlined dense/>
          </v-col>
          <v-col cols="12" md="6">
            <v-select label="الفئة" clearable :items="$store.state.items.items_f" item-text="name_item" item-value="id_fk_item"  v-model="search.id_item" @change="search_subject" prepend-inner-icon="mdi-magnify" outlined dense/>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider/>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-center">ت</th>
              <th class="text-center">المادة</th>
              <th class="text-center">الفئة</th>
              <th class="text-center">العدد</th>
              <th class="text-center" v-if="type==1">منذ</th>
              <th v-if="$store.state.user.level ==1 || $store.state.user.level ==2" style="width: 50px;" class="text-center">تعديل</th>
              <th v-if="$store.state.user.level ==1 || $store.state.user.level ==2" style="width: 50px" class="text-center">حذف</th>
            </tr>


            </thead>
          <tbody>
          <tr v-for="(sub,i) in pageOfItems" :key="'item_i___'+i">
            <td class="text-center">{{subjects.indexOf(sub)+1}}</td>
            <td class="text-center">{{sub.name_subject}}</td>
            <td class="text-center">{{sub.name_item}}</td>
            <td class="text-center">{{ sub.count }} {{sub.name_unit}}</td>
            <td class="text-center" v-if="type==1">{{sub.days}} يوم</td>
            <td v-if="$store.state.user.level ==1 || $store.state.user.level ==2" class="text-center"><v-btn @click="set_to_edit(sub)" icon><v-icon color="blue">mdi-pencil</v-icon></v-btn></td>
            <td v-if="$store.state.user.level ==1 || $store.state.user.level ==2" class="text-center"><v-btn @click="delete_target(sub)" icon><v-icon color="error">mdi-delete</v-icon></v-btn></td>

          </tr>
          </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-divider/>
     <v-card-text>
       <div class="mypag" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
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

const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};
export default {
  name: "Subjects",
  data(){
    return{
      loading:false,
      defaultLabels,
      items_f:[],
      pageOfItems: [],
      type:2,
      subjects:this.$store.state.subjects.subjects,
      search:{
        name_subject:'',
        id_item:'',
      }
    }
  },
  components:{
    EditSubject,
    AddSubject,
    JwPagination,
  },
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    get_subjects_custom(num)
    {
      if(num ==0)
      {
        this.$store.commit("GET_SUBJECTS",0);
        this.type = 0;
      }
      if(num ==1)
      {
        this.$store.commit("GET_SUBJECTS",1);
        this.type = 1;
      }

    },
    get_subjects()
    {
      this.loading = true;
      axios.get('api/subjects/get-subjects').then(res=>{
        var data = res.data;
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


       this.$store.state.subjects.subjects = filtered;
       this.subjects = filtered;
       this.subjects = filtered;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    },
    get_new_subjects()
    {
      this.loading = true;
      axios.get('api/subjects/get-new-subjects').then(res=>{
        var data = res.data;
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

        this.$store.state.subjects.subjects = filtered;
        this.subjects = filtered;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    },
    search_subject()
    {
      var res = this.$store.state.subjects.subjects;
      res = res.filter(item=>item.name_subject.toLowerCase().match(this.search.name_subject.toLowerCase()));
      if(this.search.id_item != null && this.search.id_item != "" && this.search.id_item != undefined && this.search.id_item > 0)
      {
        res = res.filter(item=>item.id_fk_item==this.search.id_item);
      }


      this.subjects = res;
    },
    set_to_edit(target)
    {
      this.$store.state.subjects.target = target ;
      this.$store.state.subjects.forms.edit_subject = true;
    }
    ,

    delete_target(target)
    {
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {
        this.$store.state.loading = true;
        this.$axios.post('api/subjects/delete-subject',target).then(res=>{
          this.$store.commit("GET_SUBJECTS",0);
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.$store.state.subjects.forms.delete_subject = false;

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
   // this.$store.state.subjects.subjects = [];
   // this.subjects = [];
   this.$store.commit("GET_SUBJECTS",0);
    //this.get_subjects();
  },
  computed:{
    get_subjects2(){
      return this.$store.state.subjects.subjects;
    }
  },
  watch:{
    get_subjects2(new_subjects){
      this.subjects = new_subjects;
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