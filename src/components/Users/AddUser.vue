<template>
<v-dialog max-width="500" v-model="$store.state.users.forms.add_user">
<v-form lazy-validation v-model="valid" ref="form">
  <v-card>
    <v-card-title class="primary">
      <v-icon dark>mdi-plus</v-icon>
      <span class="mr-2 white--text" >اضافة</span>
    </v-card-title>
    <v-divider/>
    <v-card-text class="pa-4">
      <v-text-field v-model="user.name" :rules="req" outlined prepend-inner-icon="mdi-information" label="الاسم"/>
      <v-text-field v-model="user.username" :rules="req" outlined prepend-inner-icon="mdi-account" label="اسم المسنخدم"/>
      <v-text-field v-model="user.password" :rules="req" outlined prepend-inner-icon="mdi-lock" label="كلمة المرور"/>
      <v-select :rules="req" :items="levels" outlined label="الصلاحية" item-value="value" item-text="label" v-model="user.level"/>
    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="success" @click="add_user" :loading="$store.state.loading">
        <v-icon dark>mdi-content-save</v-icon>
        <span class="mr-2 white--text">حفظ</span>
      </v-btn>
      <v-btn color="grey" class="mr-2" dark @click="$store.state.users.forms.add_user=false">
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
  name: "AddUser",
  data(){
    return{
      valid:true,
      req:[v=>!!v || 'لايمكن تركه فارغاً'],
      user:{
        name:'',
        username:'',
        password:'',
        level:0,

      },
      levels:[
        {label:'مدير',value:1},
        {label:'مشرف',value:2},
      ]
    }
  },
  methods:{
    add_user()
    {
      if(this.$refs.form.validate())
      {
        this.$store.state.loading = true;
        this.$axios.post('api/users/add-user',this.user).then(res=>{
          this.$store.commit("GET_USERS");
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.user.name = '';
          this.user.username = '';
          this.user.password = '';
          this.user.level = 0;
          this.$store.state.users.forms.add_user = false;

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