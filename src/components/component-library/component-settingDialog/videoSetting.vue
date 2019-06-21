<template>
    <div class="inputSetting">
        <settingSlot @confirm="confirm" @cancel="cancel">
            <p slot="dialogTitle" class="typeName">视频模块</p>
            <div slot="hint">
                <p>尺寸<span style="color:red">*</span></p>
                <p> 建议最小尺寸640*360，不超过200M。</p>
            </div>
            <div slot="mainContent">
                <el-form :model="videoFormDatas">
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <video v-if="videoFormDatas.videoUrl" :src="videoFormDatas.videoUrl">
                            <source :src="videoFormDatas.videoUrl" type="video/mp4">
                            <source :src="videoFormDatas.videoUrl" type="video/ogg">
                            您的浏览器不支持 video 视频播放。
                        </video>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                    <el-row>
                        <!-- <el-col :span="9">
                            <el-form-item label="自动播放" label-width="72px">
                                <el-switch v-model="videoFormDatas.autoplay"></el-switch>
                            </el-form-item>
                        </el-col> -->
                        <el-col :span="9">
                            <el-form-item label="静音播放" label-width="72px">
                                <el-switch v-model="videoFormDatas.muted"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- <el-form-item label="视频路径" label-width="100px">
                        <el-input v-model="videoFormDatas.videoUrl" size="small" autocomplete="on"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item label="播放器宽度" label-width="100px">
                        <el-input v-model="videoFormDatas.videoWidth" size="small" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="播放器高度" label-width="100px">
                        <el-input v-model="videoFormDatas.videoHeight" size="small" autocomplete="off"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item label="自动播放" label-width="100px">
                        <el-col :span="8">
                            <el-switch :disabled="videoFormDatas.preload" v-model="videoFormDatas.autoplay"></el-switch>
                        </el-col>
                    </el-form-item> -->
                    <!-- <el-form-item label="预加载视频" label-width="100px">
                        <el-col :span="8">
                            <el-switch :disabled="videoFormDatas.autoplay" v-model="videoFormDatas.preload"></el-switch>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="循环播放" label-width="100px">
                        <el-col :span="8">
                            <el-switch v-model="videoFormDatas.loop"></el-switch>
                        </el-col>
                    </el-form-item> -->
                </el-form>
            </div>
        </settingSlot>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import settingSlot from '../component-settingDialog/settingSlot'

export default {
    data() {
        return {
            videoFormDatas : {
                videoUrl     : "",
                videoWidth   : "100%",
                videoHeight  : "auto",
                autoplay     : false,
                preload      : false,
                loop         : false,
                muted        : false,
            },
        };
    },
    components: { settingSlot },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
    },
    mounted(){
        let that = this;
        that.videoFormDatas = that.showData.videoUrl ? that.showData : that.videoFormDatas;
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        floorPlanSuccess(file) {
            let that = this;
            that.videoFormDatas.videoUrl = file.fullPath;
        },
        uploadPicBefore(file) {
            let that = this;
            const isLt200M = file.size / 1024 / 1024 < 200;
            if (file.type !== 'video/mp4' && file.type !== 'audio/ogg') {
                that.$notify({
                    duration: 1500,
                    message: '请上传视频格式文件',
                    type: 'error',
                });
                return false;
            }else if (!isLt200M) {
                that.$message.error('上传视频大小不能超过 200MB!');
                return false;
            }
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.videoFormDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        showData: {
            handler(newVal, oldVal) {
                this.videoFormDatas = newVal;
    　　　　},
    　　　　deep: true
        },
    }
};
</script>
<style lang='less'>
    .inputSetting{
        .el-upload{
            width: calc(~"100% - 2px");
            .avatar-uploader-icon{
                width: 100%;
                height: 164px;
                text-align: center;
                line-height: 164px;
                border: 1px dashed #ccc;
                border-radius: 4px;
                font-size: 20px;
                background: #F5F7FA;    
            }
        }
        .el-form .el-form-item{
            margin-bottom: 8px;
        }
    }
</style>