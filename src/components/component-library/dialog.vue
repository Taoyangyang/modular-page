<template>
    <div class='dialog'>
        <el-button type="text" size="medium" @click="toggleDialog($event)">弹窗</el-button>

        <el-dialog class="dialogBlock" title="表单提交" :visible.sync="showDialog" width="100%" 
            :modal="false" :close-on-click-modal="false" @close="closeDialog" :style="{top:dialogTop+'px'}"
        >
            <el-form v-if="!IsEmptyObj(setData)" ref="form" label-width="70px">
                <el-form-item v-for="item in setData.checkFormItem" :key="item.label" :label="item.label">
                    <component :is="'el-'+item.compontType" :type="item.type" :options="item.options && item.options" :placeholder="item.placeholder" size="medium">
                        <template v-if="item.append" slot="append">{{item.append}}</template>
                    </component>
                </el-form-item>
                <el-form-item class="buttonBlock">
                    <el-button size="medium" :style="{background: setData.btnColor, color: 'white'}">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            showDialog: false,
            dialogTop : 0,
        };
    },
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
                return this.$store.statecomponentsList
            },
            set(newVal){
                this.$store.commit('updateData', {componentsList: newVal})
            }
        }
    },
    created() {
        
    },
    mounted() {
        
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
        }
    }
}
</script>
<style lang='less' scoped>
    .dialog{
        position: relative;
        .el-button--text{
            width: 100%;
            text-align: center;
        }
        .dialogBlock{
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            overflow: visible;
            /deep/.el-form{
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
    }
</style>