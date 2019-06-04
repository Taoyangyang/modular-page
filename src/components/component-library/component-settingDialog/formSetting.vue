<template>
    <div class="formSetting">
        <div class="chooseTem">
            <el-checkbox-group v-model="checkedList" @change="checkChange">
                <el-checkbox v-for="item in formItems" :key="item.label" :label="item.label"></el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="showForm">
            <div class="sortBtns">
                <div class="sortItem" v-for="(item,index) in formDatas.checkFormItem" :key="item.label">
                    <i class="icon el-icon-arrow-up" @click="toUp(index)"></i>
                    <i class="icon el-icon-arrow-down" @click="toDown(index)"></i>
                </div>
            </div>
            <el-form ref="form" label-width="80px">
                <el-form-item v-for="item in formDatas.checkFormItem" :key="item.label" :label="item.label">
                    <component :is="'el-'+item.compontType" :type="item.type" :options="item.options && item.options" :placeholder="item.placeholder" size="medium">
                        <template v-if="item.append" slot="append">{{item.append}}</template>
                    </component>
                    <!-- <i class="delIcon el-icon-circle-close" @click="delformItem(index)"></i> -->
                </el-form-item>
                <el-form-item class="btnItem">
                    <el-button size="medium" :style="{background: formDatas.btnColor, color: 'white'}">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="btnSet flex_start_v">
            <div class="colorSelect flex_start_v">
                <span class="label">按钮颜色选择</span>
                <el-color-picker v-model="formDatas.btnColor" show-alpha :predefine="predefineColors"> </el-color-picker>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- <el-button type="danger" @click="delet">删除</el-button> -->
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
    components: {},
    data() {
        return {
            formDatas    : {
                checkFormItem: [],
                btnColor: '#409EFF',
            },
            checkedList  : [],
            formItems    : [
                {
                    label: "姓名",
                    compontType: "input",
                    type: "text",
                    placeholder: "请输入姓名"
                },
                {
                    label: "联系方式",
                    compontType: "input",
                    type: "tel",
                    placeholder: "请输入联系方式"
                },
                {
                    label: "房屋面积",
                    compontType: "input",
                    type: "text",
                    placeholder: "请输入房屋面积",
                    append : '㎡'
                },
                {
                    label: "地址",
                    compontType: "cascader",
                    type: "",
                    placeholder: "请选择地址",
                    options: []
                },
            ],
            predefineColors: [ '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)' ]
        };
    },
    props: {
        showData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapState({
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    created() {},
    mounted() {
        let that = this;
        if(that.IsEmptyObj(that.showData)){
            that.formDatas.checkFormItem = Object.assign([], that.formItems);
            that.formItems.forEach(item=>{
                that.checkedList.push(item.label)
            })
        }else{
            that.formDatas = that.showData;
            that.formDatas.checkFormItem.forEach(item=>{
                that.checkedList.push(item.label)
            })
        }
    },
    methods: {
        ...mapMutations([
            "updateData"
        ]),
        checkChange(val){
            let that = this;
            that.formDatas.checkFormItem = [];
            val.forEach(item=>{
                that.formDatas.checkFormItem.push(that.formItems.filter(it=>it.label==item)[0])
            })
        },
        toUp(index){
            let that = this;
            if(index==0) return false;
            that.dataInterchange(that.formDatas.checkFormItem, index-1, index)
        },
        toDown(index){
            let that = this;
            if(index==that.checkedList.length-1) return false;
            that.dataInterchange(that.formDatas.checkFormItem, index+1, index)
        },
        // moveEle(arr, index1, index2){
        //     let that = this;
        //     arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        //     return arr;
        // },
        // delformItem(index){
        //     let that = this;
        //     console.log(that.componentsList)
        //     that.$confirm('是否删除该块?', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText : '取消',
        //         type : 'warning'
        //     }).then(()=>{
        //         let componentsData = that.componentsList[that.clickComIndex].data;
        //         if(that.IsEmptyObj(componentsData)){
        //             that.$delete(that.formDatas.checkFormItem, index)
        //         }else{
        //             that.$delete(componentsData.checkFormItem, index)
        //             that.updateData({ componentsList: that.componentsList });
        //         }
        //     }).catch(()=>{})
        // },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.formDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {}
};
</script>
<style lang='less'>
.formSetting {
    text-align: center;
    .chooseTem{
        margin: 20px;
    }
    .showForm{
        display: flex;
        justify-content: flex-start;
        // align-items: center;
        .sortBtns{
            margin-top: 5px;
            .sortItem{
                margin-bottom: 18px;
                width: 30px;
                .icon{
                    display: block;
                    cursor: pointer;
                    &:hover{
                        color: #46a1ff;
                    }
                    &+.icon{
                        // margin-top: -4px;
                    }
                }
            }
        }
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
            .btnItem{
                .el-form-item__content{
                    text-align: left;
                }
            }
        }
    }
    .btnSet{
        margin: 20px;
        .colorSelect{
            font-size: 14px;
            span.label{
                margin-right: 10px;
            }
        }
    }
}
</style>