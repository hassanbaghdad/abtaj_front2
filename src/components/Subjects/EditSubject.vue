<template>
<v-dialog max-width="500" v-model="$store.state.subjects.forms.edit_subject">
<v-form lazy-validation v-model="valid" ref="form">
  <v-card>
    <v-card-title class="primary">
      <v-icon dark>mdi-pencil</v-icon>
      <span class="mr-2 white--text" >تعديل</span>
    </v-card-title>
    <v-divider/>
    <v-card-text class="pa-4">
      <v-text-field v-model="subject.name_subject" :rules="req" outlined prepend-inner-icon="mdi-information" label="المادة"/>
      <v-select :rules="req" label="الفئة" :items="$store.state.items.items" outlined v-model="subject.id_fk_item" item-value="id" item-text="name_item"/>
      <v-select :rules="req" label="الوحدة" :items="$store.state.units.units" outlined v-model="subject.id_fk_unit" item-value="id" item-text="name_unit"/>
      <v-text-field v-model="subject.count" :rules="req_no" outlined prepend-inner-icon="mdi-information" label="الكمية"/>
      <v-img v-if="subject.image" :src="subject.image" height="200"></v-img>

      <v-file-input v-model="selectedFile" label="Choose file" @change="uploadImage"></v-file-input>
      <v-img v-if="imageUrl" :src="imageUrl" height="200"></v-img>

    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="success" @click="edit_subject" :loading="$store.state.loading">
        <v-icon dark>mdi-content-save</v-icon>
        <span class="mr-2 white--text">حفظ</span>
      </v-btn>
      <v-btn color="grey" class="mr-2" dark @click="$store.state.subjects.forms.edit_subject=false">
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
  name: "EditSubject",
  data(){
    return{
      valid:true,
      req:[v=>!!v || 'لايمكن تركه فارغاً'],
     req_no:[v=>!!v&&v > -1 || 'يجب ادخال رقم'],
      subject:{
        ids:'',
        name_subject:'',
        id_fk_item:null,
        id_fk_unit:null,
        count:'',
        image: null,

      },
      selectedFile: null,
      imageUrl: null,
      image_edited:false
    }
  },
  methods:{

    edit_subject()
    {
      if(this.$refs.form.validate())
      {
        var fd = new FormData();
        fd.append('ids',this.subject.ids);
        fd.append('name_subject',this.subject.name_subject);
        fd.append('id_fk_item',this.subject.id_fk_item);
        fd.append('id_fk_unit',this.subject.id_fk_unit);
        fd.append('count',this.subject.count);
        fd.append('selectedFile',this.selectedFile);
        fd.append('image_edited',this.image_edited);
        this.$store.state.loading = true;
        this.$axios.post('api/subjects/edit-subject',fd).then(res=>{
          this.$store.commit("GET_SUBJECTS",0);
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.subject.ids = '';
          this.subject.name_subject = '';
          this.subject.id_fk_item = '';
          this.subject.id_fk_unit = '';
          this.subject.count = '';

          this.$store.state.subjects.forms.edit_subject = false;
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

    },
    uploadImage() {
      const reader = new FileReader();

      reader.onload = (event) => {
        this.imageUrl = event.target.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    },

  },
  computed:{
    get_target()
    {
      return  this.$store.state.subjects.target;
    }
  },
  watch:{
    get_target(new_target)
    {
      this.subject = new_target;
      this.subject.id_fk_item = parseInt(new_target.id_fk_item);
      this.subject.count = parseInt(new_target.count);

    }
  },

};
</script>

<style scoped>

</style>