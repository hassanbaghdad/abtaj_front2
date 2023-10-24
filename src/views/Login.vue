<template>
  <div class="pa-4">
    <v-form lazy-validation ref="form" v-model="valid">
      <v-card max-width="500" class="ma-auto mt-16">
        <v-card-title>
          <v-icon>mdi-lock</v-icon>
          <span class="mr-2">تسجيل الدخول</span>
        </v-card-title>
        <v-divider/>
        <v-card-text>
          <v-text-field @keyup.13="login" outlined label="اسم المستخدم" v-model="user.username" :rules="req"/>
          <v-text-field @keyup.13="login" outlined label="كلمة المرور" v-model="user.password" :rules="req"/>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-btn @click="login" color="success" :loading="$store.state.loading">
            <v-icon>mdi-key</v-icon>
            <span class="mr-2">دخول</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

  </div>

</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      req:[v=>!!v || 'لايمكن تركه فارغاً'],
      valid:true,
      user:{
        username:'',
        password:''
      }
    }
  },
  methods:{
    login(){
      if(this.$refs.form.validate())
      {
        this.$store.state.loading = true;
        this.$axios.post('api/users/login',this.user).then(res=>{
          this.$store.state.user.name = res.data.name;
          this.$store.state.user.username = res.data.username;
          this.$store.state.user.user_id = res.data.user_id;
          this.$store.state.user.level = res.data.level;
          this.$store.state.user.token = res.data.token;
          this.$store.state.user.login = true;
          this.$store.state.drawer = true;
          localStorage.setItem("token",res.data.token);
          axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem("token");
          this.$router.push("/subjects");
        }).catch(err=>{
          this.$fire({
            title: "فشل",
            text: err.response.data.msg,
            type: "error",
            timer: 3000
          });
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