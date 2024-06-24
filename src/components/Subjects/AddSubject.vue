<template>
<v-dialog max-width="500" v-model="$store.state.subjects.forms.add_subject">
<v-form lazy-validation v-model="valid" ref="form">
  <v-card>
    <v-card-title class="primary">
      <v-icon dark>mdi-plus</v-icon>
      <span class="mr-2 white--text" >اضافة</span>
    </v-card-title>
    <v-divider/>
    <v-card-text class="pa-4">
      <v-text-field v-model="subject.name_subject" :rules="req" outlined prepend-inner-icon="mdi-information" label="المادة"/>
      <v-select :rules="req" label="الفئة" :items="$store.state.items.items" outlined v-model="subject.id_fk_item" item-value="id" item-text="name_item"/>
      <v-select :rules="req" label="الوحدة" :items="$store.state.units.units" outlined v-model="subject.id_fk_unit" item-value="id" item-text="name_unit"/>
      <v-text-field v-model="subject.count" :rules="req_no" outlined prepend-inner-icon="mdi-information" label="الكمية"/>
      <v-file-input v-model="subject.selectedFile" label="Choose file" @change="uploadImage"></v-file-input>
      <v-img v-if="subject.imageUrl" :src="subject.imageUrl" height="200"></v-img>

    </v-card-text>
    <v-divider/>
    <v-card-actions>
      <v-btn color="success" @click="add_subject" :loading="$store.state.loading">
        <v-icon dark>mdi-content-save</v-icon>
        <span class="mr-2 white--text">حفظ</span>
      </v-btn>
      <v-btn color="grey" class="mr-2" dark @click="$store.state.subjects.forms.add_subject=false">
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
  name: "AddSubject",
  data(){
    return{
      valid:true,
      req:[v=>!!v || 'لايمكن تركه فارغاً'],
     req_no:[v=>!!v&&Number(v) > -1 || 'يجب ادخال رقم'],
      subject:{
        name_subject:'',
        id_fk_item:'',
        id_fk_unit:'',
        count:'',
        selectedFile: null,
        imageUrl: null,


      }
    }
  },
  methods:{
    add_subject()
    {
      if(this.$refs.form.validate())
      {
        this.$store.state.loading = true;
        var fd = new FormData();

        fd.append('name_subject',this.subject.name_subject);
        fd.append('id_fk_item',this.subject.id_fk_item);
        fd.append('id_fk_unit',this.subject.id_fk_unit);
        fd.append('count',this.subject.count);
        fd.append('selectedFile',this.subject.selectedFile);

        this.$axios.post('api/subjects/add-subject',fd).then(res=>{
          this.$store.commit("GET_SUBJECTS",0);
          this.$fire({
            title: "نجح",
            text: res.data.msg,
            type: "success",
            timer: 3000
          });
          this.subject.name_subject = '';
          this.subject.id_fk_item = '';
          this.subject.id_fk_unit = '';
          this.subject.count = '';
          this.subject.selectedFile = '';
          this.subject.imageUrl = '';
          this.$store.state.subjects.forms.add_subject = false;

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
        this.subject.imageUrl = event.target.result;
      };
      if (this.subject.selectedFile) {
        reader.readAsDataURL(this.subject.selectedFile);
      }
    },
  }
};
</script>

<style scoped>

</style>