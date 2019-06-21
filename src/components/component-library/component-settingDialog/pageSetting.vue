/*
 * @Author: TaoYe 
 * @Date: 2019-06-01 14:54:33 
 * @Last Modified by: TaoYe
 * @Last Modified time: 2019-06-21 15:18:04
 */
<template>
    <!-- 页面设置 -->
    <div class="pageSetting" @click="pageSetting">
        <el-popover placement="left-start" title="页面设置" transition="fade-in-linear" width="400" v-model="showSetting" trigger="manual" @hide="popoverClose">
            <el-form class="pageSetForm" ref="form" label-position="top" :model="pageSet" label-width="80px" size="small">
                <el-form-item label="分享标题（最多15字）">
                    <el-input v-model="pageSet.shareTitle" maxlength="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="分享描述（最多50字）">
                    <el-input type="textarea" v-model="pageSet.desc" :rows="3" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="关键词（1/20 单个关键词限定10个中文字符）">
                    <el-tag v-for="(tag,index) in pageSet.dynamicTags" :key="index" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}} </el-tag>
                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" maxlength="10" show-word-limit ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
                    </el-input>
                    <el-button v-else class="button-new-tag" @click="showInput">+ 添加关键词</el-button>
                </el-form-item>
                <el-form-item label="分享图" >
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <img v-if="pageSet.shareImg" :src="pageSet.shareImg" width="80" height="80" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                    <div class="imgLimit">
                        <p>尺寸：300 * 300px </p>
                        <p>格式：.jpg .png .webp</p>
                    </div>
                </el-form-item>
                <el-form-item label="背景色">
                    <el-color-picker v-model="pageSet.bgColor" show-alpha :predefine="predefineColors"> </el-color-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitPageSet">提交</el-button>
                    <el-button @click="showSetting=false">关闭</el-button>
                </el-form-item>
            </el-form>
            <i slot="reference" class="iconfont icon-yemianshezhi" @click="showSetting=true"></i>
        </el-popover>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';

export default {
    data() {
        return {
            showSetting    : false,
            pageSet        : {
                shareTitle : "",
                desc       : "",
                dynamicTags: [],
                shareImg   : "",
                absoluteUrl: "",
                bgColor    : ""
            },
            setDataChange  : false,
            inputVisible   : false,
            inputValue     : '',
            predefineColors: [ 
                '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 
                'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)' 
            ]
        };
    },
    components: {},
    computed: {
        pageSetData: {
            get(){
                return this.$store.state.pageSetData
            },
            set(newVal){
                this.$store.commit('updateData', {pageSetData: newVal})
            }
        },
    },
    created() {},
    mounted() {},
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 页面设置
        pageSetting(){
            let that = this;
            that.showSetBlock = false;
            that.showSetBtn   = false;
        },
        // 删除关键词
        handleClose(tag) {
            this.pageSet.dynamicTags.splice(this.pageSet.dynamicTags.indexOf(tag), 1);
        },
        // 展示关键词 input
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 新增页面关键词
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.pageSet.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        popoverClose(){
            let that = this;
            that.setDataChange && that.submitPageSet(false)
        },
        // 提交页面设置内容
        submitPageSet(showMsg=true){
            let that = this;
            that.axios.post('/v2/activity/diy/share/update', {
                id             : that.pageSet.id,
                title          : that.pageSet.shareTitle,
                description    : that.pageSet.desc,
                keyWords       : that.pageSet.dynamicTags.join(','),
                shareImagePath : that.pageSet.absoluteUrl,
                backgroundColor: that.pageSet.bgColor
            }).then(res=>{
                if(res.data.ret==0){
                    that.updateData({ pageSetConfig: that.pageSet });
                    showMsg && that.$message.success(res.data.msg);
                    that.showSetting = false;
                }else{
                    showMsg && that.$message.error(res.data.msg)
                }
            })
        },
        floorPlanSuccess(file) {
            let that = this;
            that.$set(that.pageSet, "shareImg", file.fullPath);
            that.$set(that.pageSet, "absoluteUrl", file.path);
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
    },
    watch: {
        pageSetData: {
            handler(newVal, oldVal){
                this.pageSet = newVal;
                this.setDataChange = !this.IsEmptyObj(oldVal);
            },
            deep: true
        }
    },
}
</script>
<style lang='less' scoped>
    .pageSetting{
        position: absolute;
        top: 40px;
        right: 40px;
        padding: 14px 0;
        display: inline-block;
        background: white;
        border-radius: 3px;
        cursor: pointer;
        .iconfont{
            padding: 0 12px;
            font-size: 24px;
            color: #606266;
        }
    }
</style>