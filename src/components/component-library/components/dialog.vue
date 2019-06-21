<template>
    <div class='dialogComponent'>
        <div v-if="!IsEmptyObj(setData)" class="triggerBlock" size="medium" @click="toggleDialog($event)">
            <img v-if="setData.enterImg" :src="setData.enterImg" alt="" width="100%">
            <p v-else>弹窗</p>
        </div>
        <placeholderImg v-else imgType="dialogForm"></placeholderImg>

        <el-dialog class="dialogBlock" title=" " :custom-class="`dialogId_${randomId}`" :visible.sync="showDialog" width="95%" 
            :modal="false" :close-on-click-modal="false" @close="closeDialog" :style="{top:dialogTop+'px'}"
        >
            <p class="peoplesCounter" v-if="setData.counterSwitch && setData.counterPlchde">{{setData.counterPlchde}}</p>
            <el-form v-if="!IsEmptyObj(setData)" ref="form" label-width="0px">
                <el-form-item v-for="item in setData.checkFormItem" :key="item.label" label=" ">
                    <component :is="'el-'+item.compontType" :type="item.type" :options="item.options && item.options" :placeholder="item.placeholder" size="medium">
                        <template v-if="item.append" slot="append">{{item.append}}</template>
                    </component>
                </el-form-item>
                <el-form-item class="buttonBlock">
                    <div class="btn">
                        <img v-if="setData.btnBg" :src="setData.btnBg" width="100%" alt="">
                        <p v-else>提交</p>
                    </div>
                    <!-- <el-button size="medium" :style="{background: setData.btnColor, color: 'white'}">提交</el-button> -->
                </el-form-item>
                <p class="fame">* 为了您的隐私及我们的声誉,您的信息将被严格保密 *</p>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import placeholderImg from "../pages/page_components/placeholderImg";

export default {
    data() {
        return {
            randomId  : '',
            showDialog: false,
            dialogTop : 0,
        };
    },
    components: {placeholderImg},
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        ...mapState({
            clickComIndex : state => state.clickComIndex,	
            showModal     : state => state.showModal,
        }),
        componentsList: {
            get(){
                return this.$store.state.componentsList
            },
            set(newVal){
                this.$store.commit('updateData', {componentsList: newVal})
            }
        },
    },
    created() {
        this.randomId = this.getUUID();
    },
    mounted() {
        this.setDialogBg(this.setData.bgImg);
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        toggleDialog(e){
            let that = this;
            that.dialogTop = -e.currentTarget.getBoundingClientRect().top+80;
            that.showDialog = true;
            that.updateData({showModal: true})
        },
        closeDialog(){
            let that = this;
            that.updateData({showModal: false})
        },
        setDialogBg(bgImg){
            let that = this;
            let dialogEle = document.querySelector(`.dialogBlock .dialogId_${that.randomId}`);
            dialogEle.style.background = `#fff url(${bgImg}) center center no-repeat`;
            dialogEle.style.backgroundSize = `cover`;
        }
    },
    watch: {
        setData: {
            handler(newVal){
                let that = this;
                that.$nextTick(()=>{
                    that.setDialogBg(newVal.bgImg)
                })
            },
            deep: true
        }
    }
}
</script>
<style lang='less'>
    .dialogComponent{
        position: relative;
        .triggerBlock{
            width: 100%;
            min-height: 40px;
            text-align: center;
            background: #f1f1f1;
            cursor: pointer;
            p{
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #333;
            }
        }
        .dialogBlock{
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            overflow: visible;
            .el-dialog{
                .el-dialog__body{
                    text-align: center;
                    padding: 10px;
                    padding-top: 50px;
                    .peoplesCounter{
                        margin-bottom: 10px;
                        display: inline-block;
                        line-height: 24px;
                        height: 24px;
                        color: #737373;
                        font-size: 16px;
                        text-align: center;
                    }
                    .el-form{
                        padding: 5px 10px;
                        width: calc(~"100% - 20px");
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
                                // margin-left: 0 !important;
                            }
                            .btn{
                                position: relative;
                                margin-top: 5px;
                                cursor: pointer;
                                p{
                                    width: calc(~"100% - 2px");
                                    height: 40px;
                                    line-height: 40px;
                                    text-align: center;
                                    color: #409EFF;
                                    border-radius: 3px;
                                    border: 1px solid #DCDFE6;
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
            }
        }
    }
</style>