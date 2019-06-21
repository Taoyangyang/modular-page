<template>
    <div class="carouselSetting">
        <settingSlot @confirm="confirm" @cancel="cancel">
            <p slot="dialogTitle" class="typeName">{{config.hasTitle ? '带页签卡片':'轮播模块'}}</p>
            <div slot="hint">
                <p>图片<span style="color:red">*</span></p>
                <p>{{config.hasTitle ? ' 建议图片宽度750，高度≤950，图片数量3~15个，支持格式jpg、png。要求组内图片高度一致。':' 建议图片宽度750，高度≤950，图片数量不超过6个，支持格式jpg、png。要求组内图片高度一致。'}}</p>
            </div>
            <div slot="mainContent">
                <el-button class="addBtn" type="primary" icon="el-icon-circle-plus" plain size="medium" @click="addCarouselItem">添加轮播</el-button>
                <el-form label-position="right" label-width="90px" :model="carouselFormItem">
                    <!-- <el-form-item label="高度">
                        <el-input v-model="carouselFormItem.carouselHeight" placeholder="请输入高度"></el-input>
                    </el-form-item> -->
                    <!-- <el-form-item label="图片数量">
                        <el-input v-model="carouselImagesLen" placeholder="请输入轮播图片数量"></el-input>
                    </el-form-item> -->

                    <!-- 展示数据区域 -->
                    <div class="showDataBlock">
                        <div class="showItem flex_start_v" v-for="(item,index) in carouselFormItem.carouselImages" :key="index" @click="upLoadIndex=index">
                            <!-- <img :src="item.imgUrl" width="40" height="40" @click="chooseImg(index)"> -->
                            <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                                <img v-if="item.imgUrl" :src="item.imgUrl+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="60" height="60" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                <div slot="view"></div>
                            </el-oss-upload>
                            <div class="inputHint">
                                <el-input v-if="config.hasTitle" type="text" v-model="item.itemTitle" maxlength="6" show-word-limit placeholder="请输入轮播标题" size="mini"></el-input>
                                <el-input type="text" v-model="item.linkUrl" placeholder="请输入跳转连接" size="mini"></el-input>
                            </div>
                            <i class="delIcon el-icon-delete" @click="delCarouselItem(index)"></i>
                        </div>
                    </div>
                    <!-- 标签主体设置 -->
                    <div v-if="config.hasTitle" class="subjectSetting">
                        <p class="subjectSetTitle">标签主题设置</p>
                        <!-- <el-row>
                            <el-col :span="12">
                                <el-form-item label="留边轮播">
                                    <el-switch v-model="carouselFormItem.leftSide"></el-switch>
                                </el-form-item>
                            </el-col> -->
                            <!-- <el-col :span="12">
                                <el-form-item label="显示标题">
                                    <el-switch v-model="carouselFormItem.showTitle"></el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row> -->
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="常规按钮：">
                                    <el-color-picker v-model="carouselFormItem.defaultBgColor" show-alpha size="small"></el-color-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="常规文字：">
                                    <el-color-picker v-model="carouselFormItem.defaultTextColor" show-alpha size="small"></el-color-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="激活按钮：">
                                    <el-color-picker v-model="carouselFormItem.activeBgColor" show-alpha size="small"></el-color-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="激活文字：">
                                    <el-color-picker v-model="carouselFormItem.activeTextColor" show-alpha size="small"></el-color-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="按钮圆角：">
                                    <el-radio-group v-model="carouselFormItem.borderRadius" size="small">
                                        <el-radio v-for="item in radiusOptions" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                    </el-radio-group>
                                    <!-- <el-select v-model="carouselFormItem.borderRadius" placeholder="请选择" size="small">
                                        <el-option v-for="item in radiusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                                    </el-select> -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <el-row v-if="config.hasTitle">
                        <el-col :span="10">
                            <el-form-item label="自动切换：">
                                <el-switch v-model="carouselFormItem.autoplay"></el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="滑动切换：">
                                <el-switch v-model="carouselFormItem.slidplay"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
            // carouselImagesLen: 0,
            carouselFormItem : {
                carouselImages : [
                    {imgUrl: '', imgWidth: 0, imgHeight: 0, imgSize: 0, linkUrl: '', itemTitle: '', id: Math.random()},
                ],
                carouselHeight : '150',
                autoplay       : false,
                slidplay       : false,
                interval       : 3000,
                leftSide       : false,
                showTitle      : false,
                activeBgColor  : "#409EFF",
                defaultBgColor : "#cccccc",
                defaultTextColor: "#f1f1f1",
                activeTextColor: "#ffffff",
                borderRadius   : "0.1",
                enterTime      : 0,
            },
            upLoadIndex    : 0,
            radiusOptions  : [
                {label: '小', value: '0.1'},
                {label: '中', value: '0.3'},
                {label: '大', value: '0.5'},
            ],
            imgSizeSame    : true,
        };
    },
    components: { settingSlot },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
        config   : {
            type: Object,
            default: {}
        }
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

        if(that.config.hasTitle){
            that.carouselFormItem.autoplay  = false;
            that.carouselFormItem.showTitle = true;
            that.carouselFormItem.carouselImages = [
                {imgUrl: '', imgWidth: 0, imgHeight: 0, imgSize: 0, linkUrl: '', itemTitle: '', id: Math.random()},
                {imgUrl: '', imgWidth: 0, imgHeight: 0, imgSize: 0, linkUrl: '', itemTitle: '', id: Math.random()},
                {imgUrl: '', imgWidth: 0, imgHeight: 0, imgSize: 0, linkUrl: '', itemTitle: '', id: Math.random()},
            ]
        }else{
            that.carouselFormItem.autoplay  = true;
            that.carouselFormItem. showTitle = false;
        }
        // that.carouselImagesLen = that.config.hasTitle ? 3 : 0;
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
            // that.carouselImagesLen = carousImgs ? (carousImgs.length).toString() : 0;
        },
        // 选择图片
        chooseImg(index){
            let that = this;
            console.log("选择图片", index)
        },
        floorPlanSuccess(file) {
            let that = this;
            // alert(22)
            // 根据图片高度设置轮播高度
            let carousData = that.carouselFormItem.carouselImages;
            let referencData = carousData.filter(item=>(item.imgWidth && item.imgHeight))[0];
            that.carouselFormItem.carouselHeight = referencData.imgHeight / (referencData.imgWidth/373);
            
            if(that.imgSizeSame){
                that.$set(that.carouselFormItem.carouselImages[that.upLoadIndex], 'imgUrl', file.fullPath);
            }else{
                // setTimeout(() => {
                //     let msgBoxs = document.querySelector('.global-center-layout');
                //     msgBoxs.style.display = 'none';
                // }, 300);
                that.$message.error("图片尺寸大小不相同，请校验图片尺寸")
            }
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
            }else{
                that.getUploadInfo(file).then(res=>{
                    let carousData = that.carouselFormItem.carouselImages;
                    let referencData = carousData.filter(item=>(item.imgWidth && item.imgHeight))[0];

                    if(referencData && carousData.length!=1 && referencData.imgWidth && referencData.imgHeight){
                        if(res.width!=referencData.imgWidth || res.height!=referencData.imgHeight){
                            that.imgSizeSame = false;
                            resetItemData(true)
                            return false;
                        }
                    }
                    that.imgSizeSame = true;
                    resetItemData()

                    function resetItemData(reset=false){
                        that.$set(carousData[that.upLoadIndex], 'imgWidth', reset ? 0:res.width);
                        that.$set(carousData[that.upLoadIndex], 'imgHeight', reset ? 0:res.height);
                        that.$set(carousData[that.upLoadIndex], 'imgSize', reset ? 0:res.size);
                    }
                    return file;
                }).catch(err=>{
                    return Promise.reject();
                })
            }
        },
        //读取图片数据
        getUploadInfo(file){
            return new Promise((resolve, reject)=>{
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var data = e.target.result;
                    //加载图片获取图片真实宽度和高度
                    var image = new Image();
                    image.src= data;
                    image.onload = function(){
                        resolve({
                            height: image.height,
                            width : image.width,
                            size  : file.size,
                            type  : file.type,
                            name  : file.name
                        })
                    };
                };
            })
        },
        // 添加图片
        addCarouselItem(){
            let that = this;
            that.pushImgs()
        },
        // 删除轮播图片
        delCarouselItem(index){
            let that = this;
            if(that.config.hasTitle && that.carouselFormItem.carouselImages.length<=3){
                that.$message.error("该模式下，图片下限为3组")
                return false;
            }
            if(!that.config.hasTitle && that.carouselFormItem.carouselImages.length<=1){
                that.$message.error("请至少保留一组")
                return false;
            }
            that.$confirm('是否删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                let storeImgs = that.componentsList[that.clickComIndex].data.carouselImages;
                if(storeImgs){
                    that.$delete(storeImgs, index)
                    that.updateData({ componentsList: that.componentsList });
                }else{
                    that.$delete(that.carouselFormItem.carouselImages, index)
                }
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
        pushImgs(){
            let that = this;
            if(!that.config.hasTitle && that.carouselFormItem.carouselImages.length >=6){
                that.$message.error("该模式下图片不超过6组")
                return false;
            }
            if(that.config.hasTitle && that.carouselFormItem.carouselImages.length >=15){
                that.$message.error("该模式下图片不超过15组")
                return false;
            }
            that.carouselFormItem.carouselImages.push({
                id       : Math.random(),
                imgUrl   : '',  
                imgWidth : 0, 
                imgHeight: 0, 
                imgSize  : 0,
                linkUrl  : '',
                itemTitle: ''
            })
        }   
    },
    watch: {
        // carouselImagesLen(newVal, oldVal){
        //     let that = this;
        //     if(newVal>=10){
        //         newVal = that.carouselImagesLen ='10';
        //     }
        //     console.log('newVal=>',newVal, "oldVal=>",oldVal, newVal, "ilen")
        //     if(newVal && that.getNowTime()-that.enterTime>3){
        //         newVal = (newVal.match(/^\d*/g)[0]) || '1';
        //         // if(newVal > oldVal){
        //         //     that.pushImgs(newVal-oldVal);
        //         // }else if(newVal < oldVal){
        //         //     that.carouselFormItem.carouselImages.splice(-(oldVal-newVal), oldVal-newVal)
        //         // }
        //         that.carouselFormItem.carouselImages = [];
        //         that.pushImgs(newVal);
        //     }
        // },
        // 'carouselFormItem.carouselHeight':{
        //     handler(newVal, oldVal) {
        //         console.log(newVal, "-=-=-=-=--------------------------")
        //         if(newVal){
        //             this.$set(this.carouselFormItem, 'carouselHeight', (newVal.match(/^\d*/g)[0])||0)
        //         }
        //     }
        // },
        // 同步修改setting的top值；
        'carouselFormItem.carouselImages.length'(newVal){
            this.$emit('setPosition')
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
<style lang="less">
    .carouselSetting .el-form .el-form-item{margin-bottom: 10px;}
    .showDataBlock .inputHint .el-input:nth-child(1){margin-bottom: 4px;}
</style>
<style lang='less' scoped>
    .carouselSetting{
        .addBtn{
            margin: 10px 0;
            margin-top: -5px;
            width: 100%;
        }
        .showDataBlock{
            margin-bottom: 10px;
            font-size: 14px;
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 4px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: rgba(194,194,194,1);
            }
            .avatar-uploader-icon{
                width: 58px;
                height: 58px;
                text-align: center;
                line-height: 60px;
                border: 1px dashed #ccc;
                font-size: 20px;
            }
            .showItem{
                margin-bottom: 10px;
                padding: 10px;
                text-align: left;
                border-radius: 3px;
                background: #F5F7FA;
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
                    margin-left: 10px;
                    font-size: 16px;
                    cursor: pointer;
                }
            }
        }
        .subjectSetting{
            padding: 15px 10px;
            background: #F5F7FA;
            border-radius: 4px;
            .subjectSetTitle{
                margin-bottom: 10px;
                height: 18px;
                line-height: 18px;
                font-size: 14px;
                color: #909399;
            }
        }
    }
</style>