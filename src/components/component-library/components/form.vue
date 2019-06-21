<template>
    <div class='formComponent' :style="bgStyle">
        <el-form v-if="!IsEmptyObj(setData)" ref="form" label-width="0px">
            <el-form-item>
                <p class="peoplesCounter" v-if="setData.counterSwitch && setData.counterPlchde">{{setData.counterPlchde}}</p>
            </el-form-item>
            <el-form-item v-for="item in setData.checkFormItem" :key="item.label" label="">
                <component :is="'el-'+item.compontType" :type="item.type" :options="item.options && item.options" :placeholder="item.placeholder" size="medium">
                    <template v-if="item.append" slot="append">{{item.append}}</template>
                </component>
            </el-form-item>
            <el-form-item class="buttonBlock">
                <div class="btn">
                    <img v-if="setData.btnBg" :src="setData.btnBg" width="100%" alt="">
                    <p v-else>提交</p>
                </div>
                <!-- <el-button size="medium" :style="btnStyle">提交</el-button> -->
            </el-form-item>
            <p class="fame">* 为了您的隐私及我们的声誉,您的信息将被严格保密 *</p>
        </el-form>
        <placeholderImg v-else imgType="form"></placeholderImg>
    </div>
</template>

<script>
import placeholderImg from "../pages/page_components/placeholderImg";

export default {
    data() {
        return {
            
        };
    },
    components: { placeholderImg },
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        btnStyle(){
            let that = this, style={};
            if(that.setData.btnBg){
                style = {
                    background: `url(${that.setData.btnBg}) 0 0 no-repeat`,
                    backgroundSize : 'cover',
                    color: '#ccc'
                }
            }else{
                style = {
                    background: '#409EFF',
                    color: 'white'
                }
            }
            return style;
        },
        bgStyle(){
            let that = this, style={};
            if(that.setData.whiteSpace==1){
                style.padding = '5px 16px';
            }else{
                style.padding = '5px 32px';
            }

            if(that.setData.bgImg){
                style.backgroundImage = `url(${that.setData.bgImg})`;
                style.backgroundSize = 'cover';
                style.backgroundRepeat = 'no-repeat';
                style.backgroundPosition = 'center';
            }else{
                style.background = "#f1f1f1"
            }
            return style;
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        
    },
    watch: {},
}
</script>
<style lang='less'>
    .formComponent{
        text-align: center;
        .peoplesCounter{
            // display: inline-block;
            line-height: 24px;
            height: 24px;
            color: #737373;
            font-size: 16px;
        }
        .el-form{
            padding: 10px 0;
            padding-top: 80px;
            width: calc(~"100% - 0px");
            .el-form-item{
                margin-bottom: 16px;
                .el-form-item__content{
                    .el-cascader{
                        width: 100%;
                    }
                    .el-input__inner{
                        height: 42px;
                        line-height: 42px;
                    }
                }
            }
            .buttonBlock{
                .el-form-item__content{
                    text-align: center;
                }
                .btn{
                    position: relative;
                    cursor: pointer;
                    p{
                        width: calc(~"100% - 2px");
                        height: 42px;
                        line-height: 42px;
                        text-align: center;
                        color: #409EFF;
                        background: white;
                        border: 1px solid #DCDFE6;
                        border-radius: 3px;
                    }
                }
            }
            .fame{
                line-height: 17px;
                font-size: 12px;
                color: #787878;
            }
        }
    }
</style>