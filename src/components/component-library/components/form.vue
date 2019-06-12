<template>
    <div class='formComponent'>
        <el-form v-if="!IsEmptyObj(setData)" ref="form" label-width="80px">
            <el-form-item v-for="item in setData.checkFormItem" :key="item.label" :label="item.label">
                <component :is="'el-'+item.compontType" :type="item.type" :options="item.options && item.options" :placeholder="item.placeholder" size="medium">
                    <template v-if="item.append" slot="append">{{item.append}}</template>
                </component>
            </el-form-item>
            <el-form-item class="buttonBlock">
                <el-button size="medium" :style="{background: setData.btnColor, color: 'white'}">提交</el-button>
            </el-form-item>
        </el-form>
        <img v-else src="~assets/images/qrcode.png" width="100%" height="150">
    </div>
</template>

<script>

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
    computed: {},
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        
    },
    updated() {}, 
    beforeDestroy() {}, 
    destroyed() {}, 
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {}, 
    watch: {},
}
</script>
<style lang='less'>
    .formComponent{
        padding: 5px;
        .el-form{
            width: 100%;
            .el-form-item{
                margin-bottom: 10px;
                .el-form-item__content{
                    .el-cascader{
                        width: 100%;
                    }
                }
            }
            .buttonBlock{
                .el-form-item__content{
                    // margin-left: 0 !important;
                }
            }
        }
    }
</style>