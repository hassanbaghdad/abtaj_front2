<template>
  <div>

    <v-row justify="center">
      <v-col cols="12" md="6" >
        <v-card  class="mt-4 ma-lg-4" v-if="!$store.state.loading">
          <v-card-title>
            <v-icon>mdi-store</v-icon>
            <span class="mr-2">سحب من المخزن</span>
          </v-card-title>
          <v-divider />
          <v-card-title>
            <v-select clearable @change="search_sub" v-model="search.id_fk_item" :items="items_ff" item-text="name_item"
                      item-value="id_fk_item" label="تحديد فئة" outlined />
          </v-card-title>
          <v-divider />
          <v-card-title>
            <v-text-field v-model="search.name_subject" @keyup="search_sub" label="بحث اسم مادة" outlined dense
                          prepend-inner-icon="mdi-magnify" />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center">تحديد</th>

                  <th class="text-center">اسم المادة</th>
                  <!--              <th class="text-center">الفئة</th>-->
                  <th class="text-center">العدد المتوفر</th>
                  <th class="text-center">العدد</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(sub ,y) in pageOfItems" :key="'sub_2___'+y">
                  <td class="text-center">
                    <v-btn fab x-small :color="sub.icon=='mdi-plus'?'pink':'success'" dark @click="add_to_list(sub)">
                      <v-icon>{{ sub.icon }}</v-icon>
                    </v-btn>
                  </td>

                  <td class="text-center"><span>{{ sub.name_subject }}</span></td>
                  <!--              <td class="text-center"><span>{{ sub.name_item }}</span></td>-->
                  <td class="text-center"><span>{{ sub.remining = sub.count - sub.count_wanted
                    }} / {{ sub.count }} {{ sub.name_unit }}</span></td>
                  <td class="text-center">
                    <v-row justify="center" class="pa-0">
                      <v-col cols="3" class="pa-0">
                        <v-btn width="20" height="20" @click="increment(sub)" fab x-small color="blue" dark class="mt-6">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="4" class="pa-0">
                        <v-text-field @focusout="calc(sub)" :rules="count_validator" v-model="sub.count_wanted"
                                      :key="'kidfj'+y" class="text-center"></v-text-field>
                      </v-col>
                      <v-col cols="3" class="pa-0">
                        <v-btn width="20" height="20" @click="discrement(sub)" fab x-small color="error" class="mt-6">
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>

          <v-card-text>
            <div class="mypag" v-if="!$vuetify.theme.dark"
                 style="text-align: center; justify-content: center;justify-self: center;width: 100%">
              <jw-pagination :items="subjects" :pageSize="10" :labels="defaultLabels"
                             @changePage="onChangePage"></jw-pagination>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mt-4 ma-lg-4">
          <v-card-title>
            <v-icon>mdi-list-box-outline</v-icon>
            <span class="mr-2">قائمتي</span>

          </v-card-title>
          <v-divider/>
          <v-card-text class="pa-0">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-center">ت</th>
                  <th class="text-center">اسم المادة</th>
                  <th class="text-center">الفئة</th>
                  <th class="text-center">العدد المطلوب</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(lis,i) in list_subjects" :key="'list___'+i">
                  <td class="text-center">{{list_subjects.indexOf(lis)+1}}</td>
                  <td class="text-center">{{lis.name_subject}}</td>
                  <td class="text-center">{{lis.name_item}}</td>
                  <td class="text-center">{{lis.count_wanted}} {{lis.name_unit}}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
          <v-divider/>
          <v-card-actions>
            <v-btn dark color="blue" @click="add_list" :loading="loading">
              <v-icon>mdi-send</v-icon>
              <span class="mr-2">ارسال طلب المواد</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

    </v-row>



  </div>
</template>

<script>
import JwPagination from "jw-vue-pagination";


const defaultLabels = {
  first: ">>",
  last: "<<",
  previous: ">",
  next: "<"
};

export default {
  name: "AddBill",
  components: {
    JwPagination
  },
  filters: {},
  data() {
    return {
      subjects: [],
      subjects_copy: [],
      list_subjects: [],
      defaultLabels,
      pageOfItems: [],
      list: [],
      primay_list:{
        count_items:0
      },
      items_ff: [],
      search: {
        id_fk_item: 0,
        name_subject: ""
      },
      loading:false,
      count_validator: [v => v > -1 && !isNaN(v) || "عفوا العدد غير صالح"]
    };
  },
  methods: {
add_list()
{
  this.primay_list.count_items = this.list_subjects.length;
  this.loading = true;
  this.$axios.post('/api/lists/add-list',{list:this.primay_list,items:this.list_subjects}).then(res=>{

    this.$fire({
      title: "نجح",
      text: res.data.msg,
      type: "success",
      timer: 3000
    });

    this.primay_list.count_items = 0;
    this.list_subjects = [];
    this.list = [];

  }).catch(err=>{
    console.log(err)
  }).finally(fin=>{
    this.loading = false;
  })
},
    onChangePage(pageOfItems) {
      // update page of items
      this.pageOfItems = pageOfItems;
    },
    add_to_list(sub) {

      console.log(sub);
      if (sub.icon == "mdi-plus") {
        if (this.list.filter(li => li.ids == sub.ids).length < 1)
        {
          this.list.push(sub);
          this.list_subjects = this.list;
        }

      }
      if (sub.icon == "mdi-check")
      {
        if (this.list.filter(li => li.ids == sub.ids).length > -1) {
          this.list.splice(this.list.indexOf(sub), 1);
          this.list_subjects = this.list;
        }
      }

      this.change_icon(sub);
      this.search_sub();
      console.log(this.list_subjects);

    },
    increment(sub) {
      var index = this.subjects_copy.indexOf(sub);
      if (sub.count > 0 && sub.icon == "mdi-check") {
        if (parseInt(this.subjects_copy[index].count_wanted) <= parseInt(sub.count) - 1) {
          // this.$set(this.subjects_copy, index, {
          //   ...this.subjects_copy[index],
          //   count_wanted: parseInt(this.subjects_copy[index].count_wanted) + 1
          // });

          var filters1 = this.list_subjects;
          var filters2 = this.subjects_copy;
          var i = filters1.findIndex(f => f.ids == sub.ids);
          var i2 = filters2.findIndex(f => f.ids == sub.ids);
          this.list_subjects[i].count_wanted++;
          this.subjects_copy[i2].count_wanted++;
          console.log(this.list_subjects);
        }

      }


    },
    discrement(sub) {
      var index = this.subjects_copy.indexOf(sub);

      if (this.subjects[index].count_wanted > 0) {
        this.subjects_copy.filter(it=>it.ids == sub.ids)[0].count_wanted--;
        const filters = this.subjects_copy;
        var i = this.subjects_copy.findIndex(f => f.ids == sub.ids);
        this.list_subjects[i].count_wanted--;
        console.log(this.list_subjects);
      }
    },
    calc(sub) {
      var index = this.subjects_copy.indexOf(sub);
      if (isNaN(sub.count_wanted) || sub.count_wanted == null || sub.count_wanted == "" || sub.count_wanted == undefined) {

        this.$set(this.subjects, index, {
          ...this.subjects[index],
          count_wanted: 0
        });
        this.$set(this.subjects_copy, index, {
          ...this.subjects_copy[index],
          count_wanted: 0
        });

      }

      if (parseInt(sub.count_wanted) <= parseInt(sub.count) - 1) {

        this.$set(this.subjects, index, {
          ...this.subjects[index],
          count_wanted: sub.count_wanted
        });
        this.$set(this.subjects_copy, index, {
          ...this.subjects_copy[index],
          count_wanted: sub.count_wanted
        });

      }
      if (parseInt(sub.count_wanted) > parseInt(sub.count)) {
        this.$set(this.subjects, index, {
          ...this.subjects[index],
          count_wanted: sub.count
        });
        this.$set(this.subjects_copy, index, {
          ...this.subjects_copy[index],
          count_wanted: sub.count
        });

      }
    },

    search_sub() {
      let filterd = this.subjects_copy;

      if (this.search.id_fk_item != null && this.search.id_fk_item != "" && this.search.id_fk_item != undefined) {
        filterd = filterd.filter(item => item.id_fk_item == this.search.id_fk_item);
      }
      if (this.search.name_subject != null && this.search.name_subject != "" && this.search.name_subject != undefined) {
        filterd = filterd.filter(item => item.name_subject.toLowerCase().match(this.search.name_subject.toLowerCase()));
      }

      this.subjects = filterd;


    },
    change_icon(sub) {
      var filters = this.subjects_copy;
      var index = filters.findIndex(f => f.ids == sub.ids);

        if (sub.icon == "mdi-plus") {
          this.$set(this.subjects_copy, index, {
            ...this.subjects_copy[index],
            icon: "mdi-check"
          });

        }

        if (sub.icon == "mdi-check")
        {

          this.$set(this.subjects_copy, index, {
            ...this.subjects_copy[index],
            icon: "mdi-plus"
          });


        }

    },
    get_subjects4()
    {
      this.$axios.get('api/subjects/get-subjects-for-list').then(res=>{
        const subjectsCopy = res.data.filter(item => item.count > 0); // Create a copy of the array to avoid modifying the original data

        this.subjects = subjectsCopy;
        this.items_ff = subjectsCopy;
        this.subjects_copy = subjectsCopy;
      });
    }


  },
  created() {
   this.get_subjects4();
  },
  computed: {
    get_subjects: function() {
      return this.$store.state.subjects.subjects;
    },
    get_subjects_copy: function() {
      return this.subjects_copy;
    },

  },
  watch: {
    get_subjects: function(new_subjects) {
      const subjectsCopy = [...new_subjects].filter(item => item.count > 0); // Create a copy of the array to avoid modifying the original data
      this.items_ff = subjectsCopy;


      // Sort the subjectsCopy array based on a specific property, e.g., name

      // Sort the subjectsCopy array based on the 'name_subject' property
      subjectsCopy.sort((a, b) => a.ids.localeCompare(b.ids));

      this.subjects = subjectsCopy;
      this.items_ff = subjectsCopy;

      //this.subjects_copy = subjectsCopy;
    },
    get_subjects_copy(new_sub)
    {
      //this.pageOfItems = new_sub
    }
  }


};
</script>

<style lang="scss">
.v-text-field__slot input {
  text-align: center !important;
}
</style>