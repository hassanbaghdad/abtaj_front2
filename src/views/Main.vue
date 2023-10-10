<template>
  <div>
    <v-card class="ma-4" :loading="loading">
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
              <th class="text-center">Subject</th>
              <th class="text-center">Item</th>
              <th class="text-center">Unit</th>
            </tr>


            </thead>
          <tbody>
          <tr v-for="(sub,i) in pageOfItems" :key="'item_i_'+i">
            <td class="text-center">{{subjects.indexOf(sub)+1}}</td>
            <td class="text-center">{{sub.name_subject}}</td>
            <td class="text-center">{{sub.name_item}}</td>
            <td class="text-center">{{ sub.mycount }}</td>
          </tr>
          </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-divider/>
     <v-card-text>
       <div id="mypag" v-if="!$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
         <jw-pagination :items="subjects" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
       </div>
       <div id="mypagdark" v-if="$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
         <jw-pagination :items="subjects" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
       </div>
     </v-card-text>
    </v-card>

  </div>
</template>
<script>
import JwPagination from 'jw-vue-pagination';
const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};
export default {
  name: "Main",
  data(){
    return{
      loading:false,
      defaultLabels,
      pageOfItems: [],
      subjects:this.$store.state.subjects,
      search:{
        name_subject:'',
      }
    }
  },
  components:{
    JwPagination
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
      var res = this.$store.state.subjects;
      res = res.filter(item=>item.name_subject.match(this.search.name_subject));


      this.subjects = res;
    }
  },
  created() {
    this.get_subjects();
  },
  computed:{
    get_subjects2() {
      return this.$store.state.subjects;
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