<template>
    <div class="carouselSetting">
        <el-form label-position="right" label-width="80px" :model="carouselFormItem">
            <el-form-item label="高度">
                <el-input v-model="carouselFormItem.carouselHeight" placeholder="请输入高度"></el-input>
            </el-form-item>
            <el-form-item label="图片数量">
                <el-input v-model="carouselImagesLen" placeholder="请输入轮播图片数量"></el-input>
            </el-form-item>
            <el-form-item label="自动切换">
                <el-col :span="8">
                    <el-switch v-model="carouselFormItem.autoplay"></el-switch>
                </el-col>
                <el-col :span="16">
                    <el-input v-model.number="carouselFormItem.interval" :disabled="!carouselFormItem.autoplay" placeholder="切换间隔(毫秒数)"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="留边轮播">
                <el-col :span="8">
                    <el-switch v-model="carouselFormItem.leftSide"></el-switch>
                </el-col>
            </el-form-item>
            <!-- 展示数据区域 -->
            <div class="showDataBlock">
                <div class="showItem flex_start_v" v-for="(item,index) in carouselFormItem.carouselImages" :key="index" @click="upLoadIndex=index">
                    <!-- <img :src="item.imgUrl" width="40" height="40" @click="chooseImg(index)"> -->
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <img v-if="item.imgUrl" :src="item.imgUrl+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="60" height="60" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-upload>
                    <div class="inputHint">
                        <p>跳转链接：<input type="text" v-model="item.linkUrl" placeholder="请输入跳转连接"></p>
                        <p v-if="carouselFormItem.leftSide">轮播标题：<input type="text" v-model="item.itemTitle" placeholder="请输入轮播标题"></p>
                    </div>
                    <i class="delIcon el-icon-circle-close" @click="delCarouselItem(index)"></i>
                </div>
            </div>
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
            carouselImagesLen: 0,
            carouselFormItem : {
                carouselImages : [
                    {imgUrl: '', linkUrl: '', itemTitle: '', id: Math.random()},
                ],
                carouselHeight : '150',
                autoplay       : true,
                interval       : 2000,
                leftSide       : false,
                enterTime      : 0,
            },
            upLoadIndex    : 0,
        };
    },
    // components: { elOssUpload },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        ...mapState({
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    mounted(){
        let that = this;
        that.enterTime = that.getNowTime();
        that.update(that.IsEmptyObj(that.showData) ? that.carouselFormItem : that.showData);
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        getNowTime(){
            return parseInt(new Date().getTime()/100)
        },
        update(newVal){
            let that = this, carousImgs;
            that.carouselFormItem  = newVal;
            carousImgs = newVal.carouselImages;
            that.carouselImagesLen = carousImgs ? (carousImgs.length).toString() : 0;
        },
        // 选择图片
        chooseImg(index){
            let that = this;
            console.log("选择图片", index)
        },
        floorPlanSuccess(file) {
            let that = this;
            that.$set(that.carouselFormItem.carouselImages[that.upLoadIndex], 'imgUrl', file.fullPath)
            
            console.log(file.fullPath, that.upLoadIndex)
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
        // 删除轮播图片
        delCarouselItem(index){
            let that = this;
            that.$confirm('是否删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.$delete(that.componentsList[that.clickComIndex].data.carouselImages, index)
                that.updateData({ componentsList: that.componentsList });
            }).catch(()=>{})
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.carouselFormItem)
        },
        delet(){
            this.$emit('delete')
        },
        pushImgs(imgNum){
            let that = this;
            for(let i=0; i<imgNum; i++){
                that.carouselFormItem.carouselImages.push({
                    id      : Math.random(),
                    imgUrl  : '',  
                    linkUrl : '',
                    itemTitle: ''
                })
            }
        }   
    },
    watch: {
        carouselImagesLen(newVal, oldVal){
            let that = this;
            if(newVal>=10){
                newVal = that.carouselImagesLen ='10';
            }
            console.log('newVal=>',newVal, "oldVal=>",oldVal, newVal, "ilen")
            if(newVal && that.getNowTime()-that.enterTime>3){
                newVal = (newVal.match(/^\d*/g)[0]) || '1';
                // if(newVal > oldVal){
                //     that.pushImgs(newVal-oldVal);
                // }else if(newVal < oldVal){
                //     that.carouselFormItem.carouselImages.splice(-(oldVal-newVal), oldVal-newVal)
                // }
                that.carouselFormItem.carouselImages = [];
                that.pushImgs(newVal);
            }
        },
        'carouselFormItem.carouselHeight':{
            handler(newVal, oldVal) {
                if(newVal){
                    this.$set(this.carouselFormItem, 'carouselHeight', (newVal.match(/^\d*/g)[0])||0)
                }
            }
        },
        showData: {
            handler(newVal, oldVal) {
                this.update(newVal)
    　　　　},
    　　　　deep: true
        },
    }
};
</script>
<style lang='less' scoped>
    .carouselSetting{
        text-align: center;
        .showDataBlock{
            margin-bottom: 10px;
            max-height: 300px;
            overflow: auto;
            font-size: 14px;
            .avatar-uploader-icon{
                width: 58px;
                height: 58px;
                text-align: center;
                line-height: 60px;
                border: 1px dashed #ccc;
                font-size: 20px;
            }
            .showItem{
                position: relative;
                margin-top: 5px;
                padding: 5px 2px;
                padding-left: 10px;
                text-align: left;
                border-radius: 3px;
                border: 1px solid #ccc;
                .inputHint{
                    margin-left: 10px;
                    width: calc(~"100% - 100px");
                    p{
                        color: #808080;
                    }
                    input{
                        margin-top: 5px;
                        width: calc(~"100% - 95px");
                        height: 22px;
                        border: 1px solid #f1f1f1;
                        padding: 0 5px;
                        border-radius: 3px;
                    }
                }
                .delIcon{
                    position: absolute;
                    right: 2px;
                    top: 5px;
                    cursor: pointer;
                    color: #F56C6C;
                }
            }
        }
    }
</style>