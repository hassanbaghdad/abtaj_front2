import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
import router from "@/router";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem("token");
export default new Vuex.Store({
  state: {
    loading:false,
    drawer:true,
    user:{
      name:'',
      username:'',
      user_id:'',
      level:'',
      token:null,
      login:false
    },
    subjects:{
      subjects:[],
      target:[],
      forms:{
        add_subject:false,
        edit_subject:false,
        delete_subject:false,
      }
    },
    items:{
      items:[],
      target:[],
      forms:{
        add_item:false,
        edit_item:false,
        delete_item:false,
      }
    },
    units:{
      units:[],
      target:[],
      forms:{
        add_unit:false,
        edit_unit:false,
        delete_unit:false,
      }
    },
    users:{
      users:[],
      target:[],
      forms:{
        add_user:false,
        edit_user:false,
        delete_user:false,
      }
    },

  },
  getters: {},
  mutations: {
    async GET_ITEMS(state){
      state.items.items = [];
      state.loading = true;
      await axios.get('api/items/get-items').then(res=>{
        let _data = res.data;
        state.items.items = _data ;
      }).catch(err=>{
        if(err.response.status ==401)
        {
          state.user.login=false;
          state.loading = false;
          router.push('/login').catch(error=>{});
        }
      }).finally(function() {
        state.loading = false;
      })
    },
    async GET_SUBJECTS(state){
      state.subjects.subjects = [];
      state.loading = true;
      await axios.get('api/subjects/get-subjects').then(res=>{
        let _data = res.data;
        state.subjects.subjects = _data ;
      }).catch(err=>{
        if(err.response.status ==401)
        {
          state.user.login=false;
          state.loading = false;
          router.push('/login').catch(error=>{});
        }
      }).finally(function() {
        state.loading = false;
      })
    },
    async GET_UNITS(state){
      state.units.units = [];
      state.loading = true;
      await axios.get('api/units/get-units').then(res=>{
        let _data = res.data;
        state.units.units = _data ;
      }).catch(err=>{
        if(err.response.status ==401)
        {
          state.user.login=false;
          state.loading = false;
          router.push('/login').catch(error=>{});
        }
      }).finally(function() {
        state.loading = false;
      })
    },
    async GET_USERS(state){
      state.users.users = [];
      state.loading = true;
      await axios.get('api/users/get-users').then(res=>{
        let _data = res.data;
        state.users.users = _data ;
      }).catch(err=>{
        if(err.response.status ==401)
        {
          state.user.login=false;
          state.loading = false;
          router.push('/login').catch(error=>{});
        }
      }).finally(function() {
        state.loading = false;
      })
    },
    LOGOUT(state){
      axios.post('api/users/logout').then(res=>{
        state.user.name = "";
        state.user.user_id = "";
        state.user.username = "";
        state.user.level = "";
        state.user.token = null;
        state.user.login = false;


        state.drawer = false;
        localStorage.clear();
        // window.location.href = "/login"
        router.push('login').catch(err=>{})

      })
    }

  },
  actions: {

  },
  modules: {},
  plugins: [createPersistedState()],
});
