<template>
    <!-- 页面设置 -->
    <div class="pageSetting" @click="pageSetting">
        <el-popover placement="left-start" title="页面设置" transition="fade-in-linear" width="400" trigger="click">
            <el-form class="pageSetForm" ref="form" label-position="top" :model="pageSet" label-width="80px" size="small">
                <el-form-item label="分享标题（最多15字）">
                    <el-input v-model="pageSet.shareTitle" maxlength="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="分享描述（最多50字）">
                    <el-input type="textarea" v-model="pageSet.desc" :rows="3" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="关键词（1/20 单个关键词限定10个中文字符）">
                    <el-tag :key="tag" v-for="tag in pageSet.dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}} </el-tag>
                    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
                    </el-input>
                    <el-button v-else class="button-new-tag" @click="showInput">+ 添加关键词</el-button>
                </el-form-item>
                <el-form-item label="分享图" >
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <img v-if="pageSet.shareImg" :src="pageSet.shareImg+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="80" height="80" class="avatar">
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
                    <el-button @click="closePageSet">关闭</el-button>
                </el-form-item>
            </el-form>
            <i slot="reference" class="iconfont icon-yemianshezhi"></i>
        </el-popover>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            pageSet        : {
                shareTitle : "",
                desc       : "",
                dynamicTags: ['标签'],
                shareImg   : "",
                bgColor    : ""
            },
            inputVisible: false,
            inputValue  : '',
            predefineColors: [ '#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 0.68)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94, 0.5)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%, 0.73)' ]
        };
    },
    computed: {},
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        // 页面设置
        pageSetting(){
            let that = this;
            that.showSetBlock = false;
            that.showSetBtn   = false;
        },
        handleClose(tag) {
            this.pageSet.dynamicTags.splice(this.pageSet.dynamicTags.indexOf(tag), 1);
        },

        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.pageSet.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        closePageSet(){
            let that = this;
            var event = new MouseEvent("click"); 
            document.dispatchEvent(event);
        },
        submitPageSet(){
            let that = this;
            console.log(that.pageSet)
        },
        floorPlanSuccess(file) {
            let that = this;
            console.log(file)
            that.$set(that.pageSet, "shareImg", file.fullPath);
        },
        uploadPicBefore(file) {
            if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                this.$notify({
                    duration: 1500,
                    message: '请上传图片格式文件',
                    type: 'error',
                });
                return false;
            }
        },
    },
    updated() {}, 
    beforeDestroy() {}, 
    destroyed() {}, 
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {}, 
    watch: {},
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