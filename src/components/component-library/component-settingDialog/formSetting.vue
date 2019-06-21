<template>
    <div class="formSetting">
        <settingSlot @confirm="confirm" @cancel="cancel">
            <p slot="dialogTitle" class="typeName">表单</p>
            <div slot="hint">
                <p>说明<span style="color:red">*</span></p>
                <p> 支持表单项增减排序，按钮切图</p>
            </div>
            <div slot="mainContent">
                <div class="formItem">
                    <h4>表单项</h4>
                    <el-input v-model="formDatas.formName" maxlength="6" show-word-limit placeholder="请输入表单名称" size="small"> </el-input>
                    <p class="hint">说明：表单名称将做为客户来源的入口</p>
                    <div class="chooseTem flex_start">
                        <div class="sortBtns">
                            <div class="sortItem" v-for="(item,index) in formItems" :key="item.label">
                                <i class="iconfont icon-shangyijiantou" @click="toUp(index)"></i>
                                <i class="iconfont icon-xiayijiantou" @click="toDown(index)"></i>
                            </div>
                        </div>
                        <el-checkbox-group v-model="checkedList" @change="checkChange">
                            <el-checkbox v-for="item in formItems" :key="item.label" :label="item.label"></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="uploadImg btnBg">
                    <h4>按钮切图</h4>
                    <p class="hint">以按钮实际边界为准切图，包含底色和文字</p>
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <img v-if="formDatas.btnBg" :src="formDatas.btnBg+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" height="80" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                </div>
                <div class="uploadImg bgImg">
                    <h4>背景切图</h4>
                    <p class="hint">建议图片宽度750，高度≤950</p>
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess_1" :before-upload="uploadPicBefore">
                        <img v-if="formDatas.bgImg" :src="formDatas.bgImg+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="80" height="80" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                </div>
                <div v-if="config.dialogForm" class="uploadImg enterImg">
                    <h4>入口切图</h4>
                    <p class="hint">建议宽度750，高度贴近按钮高度，最大不超过200</p>
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess_2" :before-upload="uploadPicBefore">
                        <img v-if="formDatas.enterImg" :src="formDatas.enterImg+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" height="80" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                </div>
                <div v-if="!config.dialogForm" class="whiteSpace flex_start_v">
                    <span class="labelStyle">左右留白：</span>
                    <el-radio-group v-model="formDatas.whiteSpace">
                        <el-radio :label="2">大</el-radio>
                        <el-radio :label="1">小</el-radio>
                    </el-radio-group>
                </div>
                <div class="counter flex_start_v">
                    <span class="labelStyle">计数器：</span>
                    <el-switch v-model="formDatas.counterSwitch"></el-switch>
                </div>
                <div v-if="formDatas.counterSwitch" class="counterHintInput">
                    <el-input type="textarea" placeholder="请输入计数器文案，数字位使用“@people”代替 例：目前已经有@people人获取报价" v-model="formDatas.counterPlchde" maxlength="30" show-word-limit></el-input>
                    <p class="counterHint">说明：计数器数量为基数加时间增长组合得出非真实数量</p>
                </div>
            </div>
        </settingSlot>    
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import settingSlot from '../component-settingDialog/settingSlot'

export default {
    data() {
        return {
            formDatas    : {
                formName     : "",
                checkFormItem: [],
                btnBg        : "",
                bgImg        : "",
                enterImg     : "",
                whiteSpace   : 1,
                counterSwitch: true,
                counterPlchde: "",
                // btnColor     : '#409EFF',
            },
            checkedList  : [],

            formItems    : [
                { id: 1, label: "姓名", name: "nameInput", compontType: "input", type: "text", placeholder: "请输入姓名" },
                { id: 2, label: "联系方式", name: "phoneInput", compontType: "input", type: "tel", placeholder: "请输入联系方式" },
                { id: 4, label: "房屋面积", name: "areaInput", compontType: "input", type: "text", placeholder: "请输入房屋面积", append : '㎡' },
                { id: 3, label: "房屋户型", name: "modelSelect", compontType: "cascader", type: "text", placeholder: "请选择房屋户型" },
                { id: 5, label: "地址", name: "addressSelect", compontType: "cascader", type: "", placeholder: "请选择地址", options: [] },
            ],
        };
    },
    components: { settingSlot },
    props: {
        showData: {
            type: Object,
            default: () => {}
        },
        config: {
            type: Object
        }
    },
    computed: {
        ...mapState({
            componentsList: state => state.lego.componentsList,
            clickComIndex : state => state.lego.clickComIndex,	
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
            that.checkedList = val;
            that.chooseDataChange()
        },
        toUp(index){
            let that = this;
            if(index==0) return false;
            let itemID = that.formItems[index].id;
            that.formItems[index].id = that.formItems[index-1].id;
            that.formItems[index-1].id = itemID;
            that.formItems.sort((a,b)=>a.id-b.id);
            that.chooseDataChange();
        },
        toDown(index){
            let that = this;
            if(index==that.checkedList.length-1) return false;
            let itemID = that.formItems[index].id;
            that.formItems[index].id = that.formItems[index+1].id;
            that.formItems[index+1].id = itemID;
            that.formItems.sort((a,b)=>a.id-b.id);
            that.chooseDataChange();
        },
        chooseDataChange(){
            let that = this;
            that.formDatas.checkFormItem = [];
            that.checkedList.forEach(item=>{
                that.formDatas.checkFormItem.push(that.formItems.filter(it=>it.label==item)[0])
            })
            that.formDatas.checkFormItem.sort((a,b)=>a.id-b.id);
        },
        // 上传成功
        floorPlanSuccess(file) {
            let that = this;
            console.log(file)
            that.formDatas.btnBg = file.fullPath;
        },
        floorPlanSuccess_1(file) {
            let that = this;
            console.log(file)
            that.formDatas.bgImg = file.fullPath;
        },
        floorPlanSuccess_2(file) {
            let that = this;
            console.log(file)
            that.formDatas.enterImg = file.fullPath;
        },
        uploadPicBefore(file) {
            let that = this;
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                that.$notify({
                    duration: 1500,
                    message: '请上传图片格式文件',
                    type: 'error',
                });
                return false;
            }else if (!isLt2M) {
                that.$message.error('上传图片大小不能超过 2MB!');
                return false;
            }
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
    .labelStyle{
        margin-bottom: 4px;
        min-width: 80px;
        height: 17px;
        line-height: 17px;
        font-size: 14px;
        color:#303133;
    }

    .chooseTem{
        .sortBtns{
            .sortItem{
                margin: 10px 0;
                height: 40px;
                width: 40px;
                text-align: center;
                background: #F5F7FA;
                cursor: pointer;
                &:nth-child(1){
                    .iconfont:nth-child(1){
                        color: #DCDFE6;
                    }
                }
                &:nth-child(5){
                    .iconfont:nth-child(2){
                        color: #DCDFE6;
                    }
                }
                .iconfont{
                    display: block;
                    color: #AAADB1;
                    &:nth-child(1){
                        padding-top: 4px;
                    }
                }
            }
        }
        .el-checkbox-group{
            width: calc(~"100% - 40px");
            .el-checkbox{
                margin: 10px 0;
                margin-right: 0;
                padding-left: 5px;
                display: block;
                height: 40px;
                line-height: 40px;
                background: #F5F7FA;
            }
        }
    }
    .formItem, .uploadImg{
        margin-top: 10px;
        h4, p.hint{
            .labelStyle
        }
        p.hint{
            margin: 4px 0;
            color: #909399;
        }
        .avatar{
            max-width: 100%;
        }
        .avatar-uploader-icon{
            width: 78px;
            height: 78px;
            text-align: center;
            line-height: 80px;
            border: 1px dashed #ccc;
            font-size: 20px;
        }
    }
    .whiteSpace, .counter{
        margin-top: 10px;
    }
    .counterHintInput{
        .el-textarea{
            margin: 10px 0;
            margin-bottom: 5px;
        }
        .counterHint{
            .labelStyle;
            color: #C0C4CC;
        }
    }
}
</style>