<template>
    <div class="index legoAdd">
        <div class="content flex_between">
            <div class="btns">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="图像模块" name="imageModule">
                        <div v-for="item in addCompBtns.imageModule" :key="item.name" class="funBtnItem" @click="addComponents(item.eventPayload.name, item.eventPayload.payLoad)">
                            <img :src="item.img" width="24px">
                            <p>{{item.name}}</p>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="功能模块" name="functionModule">
                        <div v-for="item in addCompBtns.functionModule" :key="item.name" class="funBtnItem" @click="addComponents(item.eventPayload.name, item.eventPayload.payLoad)">
                            <img :src="item.img" width="24px">
                            <p>{{item.name}}</p>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <!-- <el-button @click="addComponents('inputComponent')">输入框</el-button>
                <el-button @click="addComponents('selectComponent')">选择框</el-button>
                <el-button @click="addComponents('gridComponent')">宫格</el-button>
                <el-button @click="addComponents('buttonComponent')">按钮</el-button> -->
            </div>
            <div class="showContent">
                <div class="pageContent">
                    <div class="pageTopBlock">
                        <img class="pageTopImg" src="~assets/images/lego/pageTop.jpg">
                        <p class="title">标题</p>
                    </div>
                    <div class="componentsList" ref="componentsDiv">
                        <draggable v-model="componentsList" @start="datadragStart" @update="datadragUpdate" @end="datadragEnd" :disabled="!enabled" :move="datadragMove" :options="{animation:500}" >
                            <transition-group>
                                <!-- <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" @mouseenter="mouseEnter($event, index, item.componentName)"> -->
                                <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" @click="showSetting($event, index, item.componentName)">
                                    <component :is="item.componentName" :setData="item.data" :cId="item.id"></component>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <!-- 弹框遮罩 -->
                    <div class="modal" v-if="showModal"></div>
                </div>
                <div v-if="showSetBtn && clickComIndex!=null" class="funBlock" :style="{top: settingPosit.top-45+'px', left: settingPosit.left+40+'px'}">
                    <i class="icon el-icon-s-tools"></i>
                    <i class="icon el-icon-arrow-up" @click="componentSort('up')"></i>
                    <i class="icon el-icon-arrow-down" @click="componentSort('dowm')"></i>
                    <i class="icon el-icon-delete" @click="deleteComponent"></i>
                </div>
                <!-- 页面设置 -->
                <pageSetting></pageSetting>
            </div>
        </div>
        <!-- 设置 -->
        <div v-if="showSetBlock" class="settingBlock" :style="{top: setBlockTop+'px', left: settingPosit.left+410+'px'}" ref="settingBlock">
            <div class="pseudoRow" :style="{top: setRowTop+15+'px'}"></div>
            <component :is="currentComType+'Setting'" :showData="showData" :config="comConfig" @cancel="settingCancel" @confirm="settingConfirm"></component>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
// 组件
import inputComponent from "../../components/input.vue";
import selectComponent from "../../components/select.vue";
import carouselComponent from "../../components/carousel.vue";
import imageComponent from "../../components/image.vue";
import videoComponent from "../../components/video.vue";
import gridComponent from "../../components/grid.vue";
import buttonComponent from "../../components/button.vue";
import formComponent from "../../components/form.vue";
import dialogComponent from "../../components/dialog.vue";
// 组件设置
import pageSetting from "../../component-settingDialog/pageSetting.vue";

import inputSetting from "../../component-settingDialog/inputSetting.vue";
import imageSetting from "../../component-settingDialog/imageSetting.vue";
import carouselSetting from "../../component-settingDialog/carouselSetting.vue";
import selectSetting from "../../component-settingDialog/selectSetting.vue";
import videoSetting from "../../component-settingDialog/videoSetting.vue";
import gridSetting from "../../component-settingDialog/gridSetting.vue";
import buttonSetting from "../../component-settingDialog/buttonSetting.vue";
import formSetting from "../../component-settingDialog/formSetting.vue";
import dialogSetting from "../../component-settingDialog/formSetting.vue";

export default {
    name: "index",
    components: {
        draggable, inputComponent, selectComponent, carouselComponent, imageComponent, videoComponent, gridComponent, buttonComponent, formComponent, dialogComponent,
        pageSetting, inputSetting, imageSetting, carouselSetting, selectSetting, videoSetting, gridSetting, buttonSetting, formSetting, dialogSetting
    },
    data() {
        return {
            enabled       : true,
            activeNames   : ['imageModule','functionModule'],
            showSetBlock  : false,
            settingPosit  : {
                top  : 0,
                left : 0
            },
            addCompBtns   : {
                imageModule   :[
                    {name: '单图热区', img: require('assets/images/lego/ic_hotspot.png'), eventPayload: {name: 'imageComponent', payLoad: {}}},
                    {name: '单图', img: require('assets/images/lego/ic_pic.png'), eventPayload: {name: 'imageComponent', payLoad: {singleImg: true}}},
                    {name: '轮播图', img: require('assets/images/lego/ic_carousel.png'), eventPayload: {name: 'carouselComponent', payLoad: {}}},
                    {name: '视频', img: require('assets/images/lego/ic_video.png'), eventPayload: {name: 'videoComponent', payLoad: {}}},
                ],
                functionModule: [
                    {name: 'Form表单', img: require('assets/images/lego/ic_form.png'), eventPayload: {name: 'formComponent', payLoad: {}}},
                    {name: '弹窗表单', img: require('assets/images/lego/ic_popform.png'), eventPayload: {name: 'dialogComponent', payLoad: {}}},
                ]
            },
            // clickComIndex : null,        //当前点击的组件下标
            currentComType: "",             //当前点击的组件类型；
            showData      : {},
            selecComponent: '',
            showSetBtn    : false,
            initPageHight : 680+65+90,      //初始化显示高度为680(加上top栏高度  页面的顶部图片高度)
            setBlockTop   : 0,              //设置框的相对top值
            setRowTop     : 0,              //设置框的箭头的相对top值
        };
    },
    computed: {
        ...mapState({
            clickComIndex : state => state.clickComIndex,	
            showModal     : state => state.showModal,
        }),
        componentsList: {
            get(){
                return this.$store.state.componentsList
            },
            set(newVal){
                this.$store.commit('updateData', {componentsList: newVal})
            }
        },
    },
    mounted(){
        let that = this;
        that.$refs.componentsDiv.addEventListener("scroll", that.componentDivScroll);
        //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 添加组件
        addComponents(cName, config={}){
            let that =this;
            //计算动态的id值
            let componentsLen = that.componentsList.length;
            let dynamicID = componentsLen ? that.componentsList.reduce((item1, item2) => (item1.id > item2.id ? item1 : item2)).id+1 : 1;

            that.componentsList.push({
                componentName: cName, 
                id     : dynamicID, 
                data   : {},
                config : config
            })
            that.updateData({componentsList: that.componentsList})
        },
        // 展示设置框
        showSetting(e, index, cName){
            let that = this;
            if(index!=that.clickComIndex || !that.showSetBlock){
                that.showSetBlock   = false;
                that.$nextTick(()=>{
                    that.showSetBlock = true
                })
                // setTimeout(()=>{that.showSetBlock = true}, 50)
            }
            let elPositionInfo = e.currentTarget.getBoundingClientRect();
            that.updateData({clickComIndex: index})
            
            that.$set(that.settingPosit, 'top', elPositionInfo.top )
            that.$set(that.settingPosit, 'left', elPositionInfo.width+20);

            that.showSetBtn     = true;
            that.currentComType = cName.split('Component')[0];
            that.showData       = that.componentsList[that.clickComIndex]['data'];
            that.comConfig      = that.componentsList[that.clickComIndex]['config'];
        },
        // 取消设置
        settingCancel(){
            let that = this;
            that.showData = {};
            that.updateData({clickComIndex: null})
            that.showSetBlock  = false;
        },
        // 确认设置
        settingConfirm(data){
            let that = this;
            that.$set(that.componentsList[that.clickComIndex], 'data', data)
            that.updateData({
                clickComIndex : null,
                componentsList: that.componentsList
            })
            that.showSetBlock = false;
        },
        // 删除组件
        deleteComponent(){
            let that = this;
            that.$confirm('是否删除该组件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.componentsList.splice(that.clickComIndex, 1)
                that.updateData({
                    clickComIndex : null,
                    componentsList: that.componentsList
                })
                that.showSetBlock = false;
                that.showSetBtn   = false;
            })
        },
        //排序
        componentSort(type){
            let that = this;
            if(type=='up'){
                if(that.clickComIndex==0) return false;
                that.dataInterchange(that.componentsList, that.clickComIndex-1, that.clickComIndex);
            }else{
                if(that.clickComIndex==that.componentsList.length-1) return false;
                that.dataInterchange(that.componentsList, that.clickComIndex+1, that.clickComIndex);
            }
            that.showSetBlock = false;
        },
        // 鼠标进入
        // mouseEnter(e, index, componentName){
        //     let that = this;
        //     that.showSetBtn = true;
        //     if(that.clickComIndex!=index) that.showSetBlock = false;

        //     that.updateData({ clickComIndex : index, })

        //     that.selecComponent = componentName;
        //     let elPositionInfo = e.currentTarget.getBoundingClientRect();
            
        //     that.$set(that.settingPosit, 'top', elPositionInfo.top - 110)
        //     that.$set(that.settingPosit, 'left', elPositionInfo.width+40);
            
        // },
        // 提交页面
        submitData(){
            let that =this;
            console.log(JSON.stringify(that.componentsList))
            return new Promise((resolve, reject)=>{
                if(that.componentsList.length){
                    resolve(JSON.stringify(that.componentsList))
                }else{
                    reject({code: 100, msg: "未添加组件"})
                }
            })
        },
        // 拖动的事件等等=======================================================>
        datadragStart(e) {
            let that = this;
            // console.log(e, "拖动开始");
            that.updateData({clickComIndex: null})
            that.showSetBlock = false;
        },
        datadragUpdate(e) {
            // console.log(e, "拖动更新");
            e.preventDefault();
            // console.log(`拖动前的索引 : ${e.oldIndex}, 拖动后的索引 : ${e.newIndex}`);
            // console.log(this.componentsList);
        },
        datadragEnd(e) {
            // console.log(e, "拖动结束");
        },
        datadragMove(e, originalEve) {
            // console.log(e, originalEve, "拖动移动");
            // console.log(`拖动前的索引 : ${e.draggedContext.index}, 拖动后的索引 : ${e.draggedContext.futureIndex}, 拖拽前-上次数据：`, e.relatedContext.list);
            return (e.draggedContext.element.text!=='Gold（不可拖动元素）');
        },
        // div中内容滚动检测
        componentDivScroll(e){
            let that = this;
            that.settingCancel();
        }
    },
    watch: {
        showModal(newVal){
            this.$nextTick(()=>{
                this.showSetBtn = this.showSetBlock = newVal
            })
        },
        'settingPosit.top'(newVal){
            let that = this;
            that.$nextTick(()=>{
                setTimeout(()=>{
                    let setHeight = that.$refs.settingBlock.getBoundingClientRect().height;
                    if(newVal+setHeight > that.initPageHight){
                        that.setBlockTop = that.initPageHight-setHeight;
                        that.setRowTop   = setHeight-(that.initPageHight-newVal);
                    }else{
                        that.setBlockTop = newVal<0 ? 0: newVal;
                        that.setRowTop   = 0
                    }
                }, 20)
            })
        }
    }
};
</script>

<style lang="less" scoped>
    .index{
        // position: relative;
        width: 100%;
        overflow-y: auto;
        .content{
            height: 100%;
            .showContent{
                position: relative;
                width: calc(~"100% - 250px");
                background: #EFF1F6;
                .pageContent{
                    position: relative;
                    margin: 40px 0 0 40px;
                    padding: 5px;
                    width: 375px;
                    box-shadow:0px 2px 20px 0px rgba(0,0,0,0.1);
                    background: white;
                    .pageTopBlock{
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 65px;
                        position: absolute;
                        z-index: 20;
                        .pageTopImg{
                            width: 100%;
                            height: 65px;
                        }
                        p{
                            position: absolute;
                            left: 0;
                            bottom: 15px;
                            width: 100%;
                            text-align: center;
                        }
                    }
                    .componentsList{
                        margin-top: 65px;
                        height: 667px;
                        overflow-y: auto;
                        &::-webkit-scrollbar {display:none}
                    }
                    .drag-item {
                        // padding: 10px;
                        // width: 355px;
                        margin: auto;
                        position: relative;
                        background: #f1f1f1;
                        border: 1px dashed #ccc;
                        &:hover{
                            border-color: #409EFF
                        }
                    }
                    .modal{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,.2);
                        z-index: 3;
                    }
                }
                .funBlock{
                    position: absolute;
                    right: -40px;
                    top: 0;
                    padding: 10px 5px;
                    width: 30px;
                    font-size: 20px;
                    text-align: center;
                    background: #f1f1f1;
                    border-radius: 5px;
                    box-shadow: 0 0 5px #a9a9a9;
                    .icon{
                        &+.icon{
                            margin-top: 10px;
                        }
                        &:hover{
                            color: #409EFF;
                            cursor: pointer;
                        }
                    }
                }
            }
            .btns{
                padding-left: 10px;
                margin-top: 10px;
                height: calc(~"100% - 10px");
                width: 240px;
                text-align: left;
                background: white;
                /deep/ .el-button{
                    margin: 10px;
                }
                .funBtnItem{
                    display: inline-block;
                    padding: 20px;
                    width: calc(~"50% - 44px");
                    text-align: center;
                    cursor: pointer;
                    .icon{
                        font-size: 20px;
                    }
                }
            }
        }
        .settingBlock{
            position: relative;
            position: absolute;
            padding: 10px;
            width: 400px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px #a9a9a9;
            z-index: 10;
            .pseudoRow{
                position: absolute;
                content: "";
                left: -10px;
                border: 10px solid #fff;
                transform: rotateZ(45deg);
                box-shadow: -2px 2px 3px #a6a6a6;
            }
        }
    }
</style>
