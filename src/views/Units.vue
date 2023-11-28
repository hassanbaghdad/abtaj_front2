<template>
  <v-card class="ma-4" :loading="$store.state.loading">
    <v-card-title>
      <v-icon color="blue">mdi-text-box-outline</v-icon>
      <span class="mr-2">الوحدات</span>
    </v-card-title>
    <v-divider/>
    <v-card-title v-if="$store.state.user.level ==1 || $store.state.user.level ==2">
    <v-btn color="orange" fab small @click="$store.state.units.forms.add_unit=true"><v-icon color="white">mdi-plus</v-icon></v-btn>

    </v-card-title>
    <v-card-title>
      <v-text-field  outlined prepend-inner-icon="mdi-magnify" @keyup="search_unit" v-model="search.name_unit" dense/>
    </v-card-title>

    <v-divider/>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th style="width: 50px;" class="text-center">ت</th>
            <th class="text-center">عنوان</th>
            <th v-if="$store.state.user.level ==1 || $store.state.user.level ==2" style="width: 50px;" class="text-center">تعديل</th>
            <th v-if="$store.state.user.level ==1 || $store.state.user.level ==2" style="width: 50px" class="text-center">حذف</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(u,i) in pageOfItems">
            <td class="text-center">{{units.indexOf(u)+1}}</td>
            <td class="text-center">{{u.name_unit}}</td>
            <td v-if="$store.state.user.level ==1 || $store.state.user.level ==2" class="text-center"><v-btn @click="set_to_edit(u)" icon><v-icon color="blue">mdi-pencil</v-icon></v-btn></td>
            <td v-if="$store.state.user.level ==1 || $store.state.user.level ==2" class="text-center"><v-btn @click="delete_target(u)" icon><v-icon color="error">mdi-delete</v-icon></v-btn></td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-divider/>
    <v-card-text>
      <div class="mypag" v-if="!$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="units" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
      <div class="mypagdark" v-if="$vuetify.theme.dark" style="text-align: center; justify-content: center;justify-self: center;width: 100%">
        <jw-pagination :items="units" :pageSize="10" :labels="defaultLabels" @changePage="onChangePage"></jw-pagination>
      </div>
    </v-card-text>
  <AddUnit/>
    <EditUnit/>
  </v-card>
</template>

<script>
import AddUnit from "@/components/Units/AddUnit.vue";
import EditUnit from "@/components/Units/EditUnit.vue";
import JwPagination from 'jw-vue-pagination';
const defaultLabels = {
  first: '>>',
  last: '<<',
  previous: '>',
  next: '<'
};


import index from "vuex";
export default {
  name: "Units",
  components:{
    AddUnit,
    EditUnit,
    JwPagination
  },
  data(){
    return{

      defaultLabels,
      pageOfItems: [],
      search:{
        name_unit:''
      },
      units:this.$store.state.units.units
    }
  },
  methods:{
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    search_unit()
    {
      var filterd = this.$store.state.units.units;

      filterd = filterd.filter(x=>x.name_unit.toLowerCase().match(this.search.name_unit.toLowerCase()));

      this.units = filterd;
    },
    set_to_edit(target)
    {
      this.$store.state.units.target = target ;
      this.$store.state.units.forms.edit_unit = true;
    }
    ,

    delete_target(target)
    {
      this.$confirm("هل انت متأكد من الحذف ؟").then(() => {
        this.$store.state.loading = true;
        this.$axios.post('api/units/delete-unit',target).then(res=>{
          this.$store.commit("GET_UNITS");
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.$store.state.units.forms.delete_unit = false;

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
    this.$store.commit("GET_UNITS");
  },
  computed:{

    get_units2()
    {
      return this.$store.state.units.units;
    }
  },
  watch:{
    get_units2(new_units)
    {
      this.units = new_units;
    }
  },

};
</script>

<style scoped>

</style>