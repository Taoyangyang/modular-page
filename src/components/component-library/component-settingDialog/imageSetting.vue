/*
 * @Author: TaoYe 
 * @Date: 2019-06-01 14:53:42 
 * @Last Modified by: TaoYe
 * @Last Modified time: 2019-06-21 15:26:46
 */
<template>
    <div class='imageSetting'>
        <settingSlot @confirm="confirm" @cancel="cancel">
            <p slot="dialogTitle" class="typeName">{{config.singleImg ? '单图':'单图热区'}}</p>
            <div slot="hint">
                <p>图片<span style="color:red">*</span></p>
                <p>{{`建议图片宽度750，高度≤${config.singleImg ? '950':'2000'}，支持格式jpg、png`}}</p>
            </div>
            <div slot="mainContent">
                <div class="showItem flex_start_v">
                    <!-- <img :src="showData.imageUrl || imageUrl" width="40" height="40" @click="chooseImg"> -->
                    <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                        <img v-if="imageUrl" :src="imageUrl+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="60" height="60" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="view"></div>
                    </el-oss-upload>
                    <div class="imgLinkUrl">
                        <el-input size="mini" type="text" :disabled="!config.singleImg" v-model="imageLinkUrl" placeholder="请输入链接"> </el-input>
                    </div>
                </div>
                <el-button v-if="!config.singleImg" class="addBtn" :disabled="!imageUrl" type="primary" icon="el-icon-circle-plus" plain size="medium" @click="addHotSpots">添加热区</el-button>
                <div class="dataBox" style="min-height:20px">
                    <div class="dataItem" v-for="(item,index) in showData.hotSpotsPosition" :key="index">
                        <p>热区{{index}}</p>
                        <div class="inputBlock flex_between_v">
                            <el-input type="text" v-model="item.linkUrl" placeholder="请输入热区跳转连接" size="mini"></el-input>
                            <i class="delIcon el-icon-delete" @click="delHotSpot(index)"></i>
                        </div>
                    </div>
                </div>
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
            hotSpotsDatas: [],
            imageUrl     : '',
            imageLinkUrl : ''
        };
    },
    components: { settingSlot },
    props: {
        showData :{ 
            type: Object | Array 
        },
        config   : {
            type: Object,
            default: {}
        }
    },
    computed: {
        ...mapState({
            componentsList: state => state.lego.componentsList,
            clickComIndex : state => state.lego.clickComIndex,	
            isImgUpload   : state => state.lego.isImgUpload,	
        }),
        // isImgUpload: {
        //     get(){
        //         return this.$store.state.lego.isImgUpload
        //     },
        //     set(newVal){
        //         this.$store.commit('updateData', {isImgUpload: newVal})
        //     }
        // },
    },
    created() {
        let that = this;
        that.imageUrl     = that.showData.imageUrl ? that.showData.imageUrl : that.imageUrl;
        that.imageLinkUrl = that.showData.imageLinkUrl ? that.showData.imageLinkUrl : that.imageLinkUrl;
    },
    mounted() {
        let that = this;
        // that.$root.Bus.$on('setHotPosition', value=>{
        //     that.hotSpotsDatas = value;
        // })
    },
    methods: {
        ...mapMutations([ 
            'updateData'
        ]),
        addHotSpots(){
            let that = this;
            let oldDatas = that.componentsList[that.clickComIndex].data.hotSpotsPosition;
            if(oldDatas){
                that.hotSpotsDatas = oldDatas;
            }
            that.hotSpotsDatas.push({
                boxHeight : 100,
                boxWidth  : 200,
                boxTLPoint: { x: 0, y: 0 },
                linkUrl   : "",
            })

            that.$set(that.componentsList[that.clickComIndex], "data", {
                hotSpotsPosition: that.hotSpotsDatas,
                imageUrl        : that.imageUrl
            });
            that.updateData({ componentsList: that.componentsList });
            // 设置框中显示回显数据
            // that.showData = that.componentsList[that.clickComIndex]['data']
        },
        delHotSpot(index){
            let that = this;
            that.$confirm('是否删除该热区?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.$delete(that.componentsList[that.clickComIndex].data.hotSpotsPosition, index)
                that.updateData({ componentsList: that.componentsList });
            }).catch(()=>{})
        },
        // 选择图片
        floorPlanSuccess(file) {
            let that = this;
            that.imageUrl = file.fullPath
            
            // 清空热区数据；
            that.$set(that.showData, 'hotSpotsPosition', that.isImgUpload && []);
            that.$set(that.showData, 'imageUrl', that.imageUrl);

            that.$set(that.componentsList[that.clickComIndex], 'data', {
                hotSpotsPosition: [],
                imageUrl        : that.imageUrl,
                imageLinkUrl    : that.imageLinkUrl
            })
            that.updateData({ 
                componentsList: that.componentsList,
                isImgUpload   : true 
            });
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
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            let that = this;
            let oldDatas = that.componentsList[that.clickComIndex].data.hotSpotsPosition;
            if(oldDatas){
                that.hotSpotsDatas = oldDatas;
            }
            that.$emit('confirm', {
                hotSpotsPosition: that.hotSpotsDatas,
                imageUrl        : that.imageUrl,
                imageLinkUrl    : that.imageLinkUrl
            })
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        clickComIndex(newVal, oldVal){
            //console.log(newVal, this.componentsList[this.clickComIndex], "clickIndex")
        },
        showData: {
            handler(newVal, oldVal) {
                this.imageUrl = newVal.imageUrl;
    　　　　},
    　　　　deep: true
        },
        'hotSpotsDatas.length'(newVal){
            this.$emit('setPosition')
        },
    }
}
</script>

<style lang="less">
    .dataBox .inputBlock .el-input__inner{border: none;}
    
</style>
<style lang='less' scoped>
    .imageSetting{
        .typeName{
            margin: 10px 0;
            color: #808080;
            font-size: 15px;
        }
        .showItem{
            position: relative;
            margin-top: 10px;
            padding: 10px;
            padding-left: 10px;
            text-align: left;
            border-radius: 3px;
            font-size: 14px;
            color: #808080;
            background: #F5F7FA;
            .avatar-uploader-icon{
                width: 58px;
                height: 58px;
                text-align: center;
                line-height: 60px;
                border: 1px dashed #ccc;
                font-size: 20px;
            }
            .imgLinkUrl{
                margin-left: 10px;
                width: calc(~"100% - 70px");

            }
            input{
                margin-top: 5px;
                padding: 0 5px;
                height: 22px;
                width: calc(100% - 20px);
                border: 1px solid #f1f1f1;
                border-radius: 3px;
            }
        }
        .addBtn{
            margin: 10px 0;
            width: 100%;
        }
        .dataBox{
            font-size: 14px;
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 4px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: rgba(194,194,194,1);
            }
            .dataItem{
                padding: 5px 2px;
                text-align: left;
                border-radius: 3px;
                p{ 
                    margin: 4px 0; 
                    font-size: 12px;
                    color: #909399;
                }
                .inputBlock{
                    padding-right: 10px;
                    border: 1px solid #DCDFE6;
                    border-radius: 4px;
                    input{
                        width: calc(~"100% - 14px");
                        height: 22px;
                        border: 1px solid #f1f1f1;
                        padding: 0 5px;
                        border-radius: 3px;
                    }
                    .delIcon{
                        font-size: 16px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>