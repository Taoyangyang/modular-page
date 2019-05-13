<template>
    <div class="inputComponent">
        <el-input :placeholder="setData.inputPlshd || '请输入内容'" v-model="inputVal">
            <template slot="prepend">{{setData.inputName||'标签'}}</template>
        </el-input>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            // inputVal: '',
        };
    },
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        inputVal: {
            get(){
                return this.$store.state.inputVal
            },
            set(newVal){
                this.$store.commit('updateData', {inputVal: newVal})
            }
        }
    },
    created() {
        console.log(this.setData, "*-*-")
    },
    mounted() {},
    methods: {},
    watch:{
        setData(newVal, oldVal){
            console.log(newVal, oldVal)
        }
    }
};
</script>
<style lang='less' scoped>

</style>