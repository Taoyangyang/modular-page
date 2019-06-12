<template>
    <div class='imageSetting'>
        <p class="typeName">{{config.singleImg ? '单图模式':'热区模式'}}</p>
        <el-button v-if="!config.singleImg" type="primary" icon="el-icon-circle-plus" size="medium" @click="addHotSpots">添加热区</el-button>
        <div class="showItem flex_start_v">
            <!-- <img :src="showData.imageUrl || imageUrl" width="40" height="40" @click="chooseImg"> -->
            <el-oss-upload class="avatar-uploader" :show-file-list="false" :on-success="floorPlanSuccess" :before-upload="uploadPicBefore">
                <img v-if="imageUrl" :src="imageUrl+'?x-oss-process=image/resize,m_fixed,h_178,w_178'" width="60" height="60" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="view"></div>
            </el-oss-upload>
            <div class="imgLinkUrl">
                <p>&nbsp;&nbsp;跳转链接：</p>
                <input type="text" :disabled="!config.singleImg" v-model="imageLinkUrl" placeholder="请输入链接">
            </div>
        </div>
        <div class="dataBox" style="min-height:20px">
            <div class="dataItem" v-for="(item,index) in showData.hotSpotsPosition" :key="index">
                <p><b>热区{{index}}</b>: 宽-{{item.boxWidth}} 高-{{item.boxHeight}} 左上点位置{{item.boxTLPoint.x}}，{{item.boxTLPoint.y}}</p>
                <input type="text" v-model="item.linkUrl" placeholder="请输入热区跳转连接">
                <i class="delIcon el-icon-circle-close" @click="delHotSpot(index)"></i>
            </div>
        </div>
        <br />
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
            hotSpotsDatas: [],
            imageUrl     : 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            imageLinkUrl : ''
        };
    },
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
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    created() {
        let that = this;
        that.imageUrl = that.showData.imageUrl ? that.showData.imageUrl : that.imageUrl;
        console.log(this.showData, "SHOWDATA")
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
        // chooseImg(){
        //     let that = this;
        //     console.log("选择图片")
        //     that.showData.imageUrl = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
        // },
        floorPlanSuccess(file) {
            let that = this;
            that.imageUrl = file.fullPath
            
            console.log(file.fullPath, that.imageUrl)
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
            console.log(newVal, this.componentsList[this.clickComIndex], "clickIndex")
        },
        showData: {
            handler(newVal, oldVal) {
                this.imageUrl = newVal.imageUrl;
    　　　　},
    　　　　deep: true
        },
    }
}
</script>
<style lang='less' scoped>
    .imageSetting{
        text-align: center;
        .typeName{
            margin: 10px 0;
            color: #808080;
            font-size: 15px;
        }
        .showItem{
            position: relative;
            margin-top: 10px;
            padding: 5px 2px;
            padding-left: 10px;
            text-align: left;
            border-radius: 3px;
            border: 1px solid #ccc;
            font-size: 14px;
            color: #808080;
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
        .dataBox{
            max-height: 400px;
            overflow: auto;
            font-size: 14px;
            .dataItem{
                position: relative;
                margin-top: 5px;
                padding: 5px 2px;
                text-align: left;
                border-radius: 3px;
                border: 1px solid #ccc;
                p{ margin: 4px 0; }
                input{
                    width: calc(~"100% - 14px");
                    height: 22px;
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