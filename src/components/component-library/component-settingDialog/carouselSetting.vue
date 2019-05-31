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
            <!-- 展示数据区域 -->
            <div class="showDataBlock">
                <div class="showItem flex_start_v" v-for="(item,index) in carouselFormItem.carouselImages" :key="index">
                    <img :src="item.imgUrl" width="40" height="40" @click="chooseImg(index)">
                    <input type="text" v-model="item.linkUrl" placeholder="请输入跳转连接">
                    <i class="delIcon el-icon-circle-close" @click="delCarouselItem(index)"></i>
                </div>
            </div>
            <elOssUpload :multiple="true" :file-list="imgArr" :show-file-list="true" :close-view="true" 
                :on-success="ossUploadSuccess" :on-error="onError" :on-remove="onRemove" server-callback-request-url="/presale/oss/upload_scenepicturese" 
                :needFileName="true"
            > </elOssUpload>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button type="danger" @click="delet">删除</el-button>
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import elOssUpload from "../../publicComponents/el-oss-upload/index"

export default {
    components: {},
    data() {
        return {
            carouselImagesLen: 0,
            carouselFormItem : {
                carouselImages : [
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', linkUrl: '', id: Math.random()},
                    {imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', linkUrl: '', id: Math.random()},
                ],
                carouselHeight : '150',
                autoplay       : true,
                interval       : 2000,
                enterTime      : 0,
                imgArr         : []
            }
        };
    },
    components: { elOssUpload },
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
        ossUploadSuccess(res, file, fileList){
            let that = ths;
            console.log(res, file, fileList)
        },
        onError(res, file, fileList){
            let that = this;
            console.log(res, file, fileList)
        },
        onRemove(file){
            let that = this;
            console.log(file);
        },
        // 删除宫格
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
                    imgUrl  : 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',  
                    linkUrl : ''
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
        .showDataBlock{
            margin-bottom: 10px;
            max-height: 300px;
            overflow: auto;
            font-size: 14px;
            .showItem{
                position: relative;
                margin-top: 5px;
                padding: 5px 2px;
                padding-left: 10px;
                text-align: left;
                border-radius: 3px;
                border: 1px solid #ccc;
                input{
                    margin-left: 10px;
                    height: 22px;
                    width: calc(~"100% - 100px");
                    border: 1px solid #f1f1f1;
                    padding: 0 5px;
                    border-radius: 3px;
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