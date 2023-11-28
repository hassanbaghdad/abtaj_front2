<template>
  <v-card>
    <v-card-title>
      <span class="mr-2">قوائم المواد</span>
    </v-card-title>
    <v-divider/>
    <v-card-title>
      <v-btn color="orange" dark to="bills/add-bill">
        <v-icon>mdi-plus</v-icon>
        <span class="mr-2">انشاء قائمة</span>
      </v-btn>
    </v-card-title>
    <v-divider/>
    <v-card-text>

    </v-card-text>
    <AddBill/>
  </v-card>


</template>

<script>
import AddBill from "@/components/Bills/AddBill.vue";

export default {
  name: "Bills",
  components: { AddBill }
};
</script>

<style scoped>

</style>