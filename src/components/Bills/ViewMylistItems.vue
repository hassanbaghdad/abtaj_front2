<template>
<v-dialog v-model="$store.state.subjects.forms.view_list_items" max-width="800">
  <v-card :loading="loading">
    <v-card-title>
      <v-icon>mdi-list-box-outline</v-icon>
      <span class="mr-2">عرض مواد الطلب</span>
    </v-card-title>
    <v-divider/>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center">ت</th>
            <th class="text-center">اسم المادة</th>
            <th class="text-center">عدد المواد</th>
          </tr>
          </thead>
          <tbody v-if="!loading">
          <tr v-for="(item , i) in list_items" :key="'list_item_i_'+i">
            <td class="text-center">{{list_items.indexOf(item)+1}}</td>
            <td class="text-center">{{item.name_subject}}</td>
            <td class="text-center">{{item.count}}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="grey" dark @click="$store.state.subjects.forms.view_list_items=false">
        <v-icon>mdi-cansel</v-icon>
        <span class="mr-2">الغاء</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
export default {
  name: "ViewMylistItems",
  data(){
    return{
      list_items:this.$store.state.subjects.list_items,
      list_id:0,
      loading:false
    }
  },
  methods:{
    get_list_items()
    {
      this.loading = true;
      this.$axios.post('/api/lists/get-list-items',{list_id:this.list_id}).then(res=>{
        this.list_items = res.data;
      }).catch(err=>{
        console.log(err)
      }).finally(fin=>{
        this.loading = false;
      })
    }
  },
  created()
  {
    this.get_list_items();
  },
  computed:{
    get_list_target:function()
    {
      return this.$store.state.subjects.list_target;
    },
    get_list_items2:function()
    {
      return this.$store.state.subjects.list_items;
    },

  },
  watch:{
    get_list_target:function(new_list)
    {
      this.list_id = new_list.list_id;
      this.get_list_items()
    },
    get_list_items2:function(new_items)
    {
      this.list_items = new_items;
    },
  },

};
</script>

<style scoped>

</style>