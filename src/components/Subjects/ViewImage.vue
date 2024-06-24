<template>
    <v-dialog v-model="$store.state.subjects.forms.view_image" max-width="500">
        <v-card>
            <v-card-title>
                {{subject.name_subject}}
            </v-card-title>
            <v-divider/>
            <v-card-text>
                <v-img :src="subject.image"/>
            </v-card-text>
            <v-divider/>
            <v-card-actions>
                <v-btn color="grey" dark @click="$store.state.subjects.forms.view_image=false">
                    <v-icon>mdi-close</v-icon>
                    <span class="mr-2">الغاء</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "View-Image",
        data(){
            return{
                subject:{
                    image:''
                }
            }
        },
        computed:{
            get_sub:function () {
                return this.$store.state.subjects.target;
            }
        },
        watch:{
            get_sub:function (new_subject) {
                this.subject = new_subject;
                if (new_subject.image != '' && new_subject.image != null && new_subject.image != undefined)
                {
                    this.subject.image = this.$axios.defaults.baseURL + new_subject.image;
                }
            }
        },

    }
</script>

<style scoped>

</style>