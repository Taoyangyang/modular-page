<template>
    <div class="buttonComponent">
        <el-form ref="form" label-width="0">
            <el-form-item>
                <el-button type="primary" plain>确定</el-button>
                <el-button>取消</el-button>
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