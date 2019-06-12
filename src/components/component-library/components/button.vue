<template>
    <div class="buttonComponent">
        <el-form ref="form" label-width="0">
            <el-form-item>
                <el-button v-for="(item,index) in setData.itemArray" :key="index" 
                    :type="item.type" :size="item.size" :plain="item.style=='plain'" :round="item.style=='round'"
                >
                    {{item.text}}
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {

        };
    },
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
    },
    mounted() {},
    methods: {},
    watch: { }
};
</script>
<style lang='less' scoped>
    .buttonComponent{
        /deep/ .el-form .el-form-item{
            margin-bottom: 0
        }
    }
</style>