<template>
<v-dialog max-width="500" v-model="$store.state.items.forms.add_item">
<v-form lazy-validation v-model="valid" ref="form">
  <v-card>
    <v-card-title class="primary">
      <v-icon dark>mdi-plus</v-icon>
      <span class="mr-2 white--text" >اضافة</span>
    </v-card-title>
    <v-divider/>
    <v-card-text class="pa-4">
      <v-text-field v-model="item.name_item" :rules="req" outlined prepend-inner-icon="mdi-information" label="المادة"/>
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="success" @click="add_item" :loading="$store.state.loading">
        <v-icon dark>mdi-content-save</v-icon>
        <span class="mr-2 white--text">حفظ</span>
      </v-btn>
      <v-btn color="grey" class="mr-2" dark @click="$store.state.items.forms.add_item=false">
        <v-icon>mdi-close</v-icon>
        <span class="mr-2">الغاء</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-form>
</v-dialog>
</template>

<script>
export default {
  name: "AddItem",
  data(){
    return{
      valid:true,
      req:[v=>!!v || 'لايمكن تركه فارغاً'],
      item:{
        name_item:'',

      }
    }
  },
  methods:{
    add_item()
    {
      if(this.$refs.form.validate())
      {
        this.$store.state.loading = true;
        this.$axios.post('api/items/add-item',this.item).then(res=>{
          this.$store.commit("GET_ITEMS");
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.item.name_item = '';
          this.$store.state.items.forms.add_item = false;

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
      }

    }
  }
};
</script>

<style scoped>

</style>