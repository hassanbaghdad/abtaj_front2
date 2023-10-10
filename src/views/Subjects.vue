<template>
  <div>
    <v-card class="ma-4" :loading="loading">
      <v-card-title>
        <v-icon>mdi-cube</v-icon>
        <span class="mr-2">المواد</span>
      </v-card-title>
      <v-divider/>
      <v-card-title>
        <v-btn color="orange" fab small @click="$store.state.subjects.forms.add_subject=true"><v-icon color="white">mdi-plus</v-icon></v-btn>

      </v-card-title>
      <v-card-title>
          <v-text-field  v-model="search.name_subject" @keyup="search_subject" prepend-inner-icon="mdi-magnify" outlined dense/>

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
              <th style="width: 50px;" class="text-center">تعديل</th>
              <th style="width: 50px" class="text-center">حذف</th>
            </tr>


            </thead>
          <tbody>
          <tr v-for="(sub,i) in pageOfItems" :key="'item_i_'+i">
            <td class="text-center">{{subjects.indexOf(sub)+1}}</td>
            <td class="text-center">{{sub.name_subject}}</td>
            <td class="text-center">{{sub.name_item}}</td>
            <td class="text-center">{{ sub.count }}</td>
            <td class="text-center"><v-btn @click="set_to_edit(sub)" icon><v-icon color="blue">mdi-pencil</v-icon></v-btn></td>
            <td class="text-center"><v-btn @click="delete_target(sub)" icon><v-icon color="error">mdi-delete</v-icon></v-btn></td>

          </tr>
          </tbody>
          </template>
        </v-simple-table>
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
      pageOfItems: [],
      subjects:this.$store.state.subjects.subjects,
      search:{
        name_subject:'',
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
    get_subjects()
    {
      this.loading = true;
      axios.get('api/get-subjects').then(res=>{
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

        this.$store.state.subjects = filtered;
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
          this.$store.commit("GET_SUBJECTS");
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
    this.$store.commit("GET_SUBJECTS")
  },
  computed:{
    get_subjects2() {
      return this.$store.state.subjects.subjects;
    }
  },
  watch:{
    get_subjects2(new_subjects) {
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