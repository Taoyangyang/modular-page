<template>
    <div class="inputSetting">
        <el-form :model="videoFormDatas">
            <el-form-item label="视频路径" label-width="120px">
                <el-input v-model="videoFormDatas.videoUrl" size="small" autocomplete="on"></el-input>
            </el-form-item>
            <el-form-item label="播放器宽度" label-width="120px">
                <el-input v-model="videoFormDatas.videoWidth" size="small" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="播放器高度" label-width="120px">
                <el-input v-model="videoFormDatas.videoHeight" size="small" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="自动播放" label-width="120px">
                <el-col :span="8">
                    <el-switch :disabled="videoFormDatas.preload" v-model="videoFormDatas.autoplay"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="预加载视频" label-width="120px">
                <el-col :span="8">
                    <el-switch :disabled="videoFormDatas.autoplay" v-model="videoFormDatas.preload"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="循环播放" label-width="120px">
                <el-col :span="8">
                    <el-switch v-model="videoFormDatas.loop"></el-switch>
                </el-col>
            </el-form-item>
            <el-form-item label="静音播放" label-width="120px">
                <el-col :span="8">
                    <el-switch v-model="videoFormDatas.muted"></el-switch>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- <el-button type="danger" @click="delet">删除</el-button> -->
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            videoFormDatas : {
                videoUrl     : Math.random()>=0.5 ? "https://www.runoob.com/try/demo_source/movie.mp4":"https://www.runoob.com/try/demo_source/mov_bbb.ogg",
                videoWidth   : "350",
                videoHeight  : "150",
                autoplay     : false,
                preload      : false,
                loop         : false,
                muted        : false,
            },
        };
    },
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
<style lang='less' scoped>
    .inputSetting{
        text-align: center;
        /deep/ .el-form .el-form-item{
            margin-bottom: 8px;
        }
    }
</style>