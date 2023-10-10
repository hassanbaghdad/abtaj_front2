<template>
  <v-card class="ma-4" :loading="$store.state.loading">
    <v-card-title>
      <v-icon>mdi-text-box-outline</v-icon>
      <span class="mr-2">الفئات</span>
    </v-card-title>
    <v-divider/>
    <v-card-title>
    <v-btn color="orange" fab small @click="$store.state.items.forms.add_item=true"><v-icon color="white">mdi-plus</v-icon></v-btn>

    </v-card-title>
    <v-card-title>
      <v-text-field  outlined prepend-inner-icon="mdi-magnify" @keyup="search_item" v-model="search.name_item" dense/>
    </v-card-title>

    <v-divider/>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th style="width: 50px;" class="text-center">ت</th>
            <th class="text-center">عنوان</th>
            <th style="width: 50px;" class="text-center">تعديل</th>
            <th style="width: 50px" class="text-center">حذف</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,i) in pageOfItems">
            <td class="text-center">{{items.indexOf(item)+1}}</td>
            <td class="text-center">{{item.name_item}}</td>
            <td class="text-center"><v-btn @click="set_to_edit(item)" icon><v-icon color="blue">mdi-pencil</v-icon></v-btn></td>
            <td class="text-center"><v-btn @click="delete_target(item)" icon><v-icon color="error">mdi-delete</v-icon></v-btn></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider/>
    <v-card-text>
      <div class="mypag" v-if="!$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="items" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
      <div class="mypagdark" v-if="$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="items" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
    </v-card-text>
    <AddItem/>
    <EditItem/>
  </v-card>
</template>

<script>
import JwPagination from 'jw-vue-pagination';
const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};
import AddItem from "@/components/Items/AddItem.vue";
import EditItem from "@/components/Items/EditItem.vue";
import index from "vuex";
export default {
  name: "Items",
  components:{
    AddItem,
    EditItem,
    JwPagination
  },
  data(){
    return{

      defaultLabels,
      pageOfItems: [],
      search:{
        name_item:''
      },
      items:this.$store.state.items.items
    }
  },
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    search_item()
    {
      var filterd = this.$store.state.items.items;

      filterd = filterd.filter(x=>x.name_item.toLowerCase().match(this.search.name_item.toLowerCase()));

      this.items = filterd;
    },
    set_to_edit(target)
    {
      this.$store.state.items.target = target ;
      this.$store.state.items.forms.edit_item = true;
    }
    ,

    delete_target(target)
    {
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {
        this.$store.state.loading = true;
        this.$axios.post('api/items/delete-item',target).then(res=>{
          this.$store.commit("GET_ITEMS");
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.$store.state.items.forms.delete_item = false;

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
    this.$store.commit("GET_ITEMS");
  },
  computed:{
    index() {
      return index
    },
    get_items2()
    {
      return this.$store.state.items.items;
    }
  },
  watch:{
    get_items2(new_items)
    {
      this.items = new_items;
    }
  },

};
</script>

<style scoped>

</style>