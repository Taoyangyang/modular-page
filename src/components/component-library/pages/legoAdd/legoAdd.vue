/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:51:48 
 * @Last Modified by: TaoYe
 * @Last Modified time: 2019-06-21 17:21:21
 */
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
                <div class="pageContent" :style="{background: pageSetData.bgColor}">
                    <div class="pageTopBlock">
                        <img class="pageTopImg" src="~assets/images/lego/pageTop.jpg">
                        <p class="title">标题</p>
                    </div>
                    <div class="componentsList" :style="{overflowY: showModal?'hidden':'auto'}" ref="componentsDiv">
                        <draggable v-model="componentsList" @start="datadragStart" @update="datadragUpdate" @end="datadragEnd" :disabled="!enabled" :move="datadragMove" :options="{animation:500}" >
                            <transition-group>
                                <!-- <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" @mouseenter="mouseEnter($event, index, item.componentName)"> -->
                                <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" :ref="'drag-item-'+item.id" @click="showSetting(index, item.id, item.componentName)">
                                    <component :is="item.componentName" :setData="item.data" :config="item.config" :cId="item.id"></component>
                                </div>
                            </transition-group>
                        </draggable>
                    </div>
                    <!-- 弹框遮罩 -->
                    <div class="modal" v-if="showModal"></div>
                </div>
                <div v-if="showSetBtn && clickComIndex!=null" class="funBlock" :style="{top: settingPosit.top-45+'px', left: settingPosit.left+30+'px'}">
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
        <div v-if="showSetBlock" class="settingBlock" :style="{top: setBlockTop+'px', left: settingPosit.left+395+'px'}" ref="settingBlock">
            <div class="pseudoRow" :style="{top: setRowTop+20+'px'}"></div>
            <component :is="currentComType+'Setting'" :showData="showData" :config="comConfig" @cancel="settingCancel" @confirm="settingConfirm" 
                @setPosition="modifySetPosition(settingPosit.top)">
            </component>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import * as testData from "../../testData"
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
                left : 0,
                timeStamp: 0
            },
            addCompBtns   : {
                imageModule   :[
                    {name: '单图热区', img: require('assets/images/lego/ic_hotspot.png'), eventPayload: {name: 'imageComponent', payLoad: {}}},
                    {name: '单图', img: require('assets/images/lego/ic_pic.png'), eventPayload: {name: 'imageComponent', payLoad: {singleImg: true}}},
                    {name: '轮播图', img: require('assets/images/lego/ic_carousel.png'), eventPayload: {name: 'carouselComponent', payLoad: {}}},
                    {name: '标签轮播', img: require('assets/images/lego/ic_tabs.png'), eventPayload: {name: 'carouselComponent', payLoad: {hasTitle: true}}},
                    {name: '视频', img: require('assets/images/lego/ic_video.png'), eventPayload: {name: 'videoComponent', payLoad: {}}},
                ],
                functionModule: [
                    {name: 'Form表单', img: require('assets/images/lego/ic_form.png'), eventPayload: {name: 'formComponent', payLoad: {}}},
                    {name: '弹窗表单', img: require('assets/images/lego/ic_popform.png'), eventPayload: {name: 'dialogComponent', payLoad: {dialogForm: true}}},
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
            showSetCompet : "",             //显示设置的组件块
            pageDiyId     : "",
            pageId        : "",             //页面的id
            pageName      : "",             //页面名称
            pageSort      : [],             //页面分类
        };
    },
    computed: {
        ...mapState({
            pageSetData   : state => state.pageSetData,	
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

        that.pageId   = that.$route.query.id || '';
        that.pageDiyId= that.$route.query.diyId || '';
        that.pageName = that.$route.query.pageName || '';
        that.pageSort = that.$route.query.sort ? that.$route.query.sort.split(',') : [];
        console.log(that.pageName, that.pageSort, that.pageId)

        that.pageId && that.getComponentsDataById(that.pageId);
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 获取回显数据
        getComponentsDataById(id){
            let that = this;
            that.componentsList = [];
            that.axios.get(`/v2/activity/diy/${id}/detail`).then(res=>{
                console.log(res, "0-0")
                if(res.data && res.data.ret==0){
                    let result = res.data.result;
                    try {
                        that.componentsList = result.content ? JSON.parse(result.content):[];
                    } catch (error) {
                        console.warn("JSON 数据格式有误！")
                        that.componentsList = result.content ? eval ("("+ result.content +")"):[];
                    }
                    // 数据筛选 避免无效数据
                    that.componentsList = that.componentsList.filter(item=>item.componentName);

                    // 页面设置的数据
                    that.updateData({ pageSetData: {
                        id         : result.id,
                        shareTitle : result.title,
                        desc       : result.description,
                        dynamicTags: result.keyWords ? result.keyWords.split(','):[],
                        shareImg   : result.shareImageUrl,
                        absoluteUrl: result.shareImagePath,
                        bgColor    : result.backgroundColor,
                    } })
                }
            }).catch(err=>{
                // ==============================
                let result = testData.detailData;
                try {
                    that.componentsList = result.content ? JSON.parse(result.content):[];
                } catch (error) {
                    console.warn("JSON 数据格式有误！")
                    that.componentsList = result.content ? eval ("("+ result.content +")"):[];
                }
                // 数据筛选 避免无效数据
                that.componentsList = that.componentsList.filter(item=>item.componentName);

                // 页面设置的数据
                that.updateData({ pageSetData: {
                    id         : result.id,
                    shareTitle : result.title,
                    desc       : result.description,
                    dynamicTags: result.keyWords ? result.keyWords.split(','):[],
                    shareImg   : result.shareImageUrl,
                    absoluteUrl: result.shareImagePath,
                    bgColor    : result.backgroundColor,
                } })
                // ==============================
            })
        },
        // 添加组件
        addComponents(cName, config={}){
            let that = this;
            //计算动态的id值
            let componentsLen = that.componentsList.length;
            let dynamicID = componentsLen ? that.componentsList.reduce((item1, item2) => (item1.id > item2.id ? item1 : item2)).id+1 : 1;

            that.componentsList.push({
                componentName: cName, 
                id     : dynamicID, 
                data   : {},
                config : config
            })
            that.updateData({componentsList: that.componentsList});

            // 显示最新添加的模块
            that.$nextTick(()=>{
                let newComponentEle = that.$refs['drag-item-'+dynamicID][0];
                newComponentEle.scrollIntoView({ 
                    // behavior: 'smooth',
                    block   : 'end'
                })
                setTimeout(()=>{
                    var event = new MouseEvent("click");
                    newComponentEle.dispatchEvent(event); 
                }, 100)
            })
        },
        // 展示设置框
        showSetting(index, cid, cName){
            let that = this;
            if(index!=that.clickComIndex || !that.showSetBlock){
                that.showSetBlock   = false;
                that.$nextTick(()=>{
                    that.showSetBlock = true
                })
            }
            that.showSetCompet = that.$refs['drag-item-'+cid][0];
            let elPositionInfo = that.showSetCompet.getBoundingClientRect();
            that.updateData({clickComIndex: index})
            
            that.$set(that.settingPosit, 'top', elPositionInfo.top<=160 ? 160 : elPositionInfo.top )
            that.$set(that.settingPosit, 'left', elPositionInfo.width+20);
            that.$set(that.settingPosit, 'timeStamp', new Date().getTime());

            that.currentComType = cName.split('Component')[0];
            that.showData       = that.componentsList[that.clickComIndex]['data'];
            that.comConfig      = that.componentsList[that.clickComIndex]['config'];
            that.showSetBtn     = true;
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
                    showModal     : false,
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
				that.updateData({ clickComIndex: that.clickComIndex-1})
            }else{
                if(that.clickComIndex==that.componentsList.length-1) return false;
                that.dataInterchange(that.componentsList, that.clickComIndex+1, that.clickComIndex);
				that.updateData({ clickComIndex: that.clickComIndex+1})
            }
            that.showSetBlock = false;
			
			// 设置跟随；
            that.$nextTick(()=>{
                let activeComponentData = that.componentsList[that.clickComIndex];
                let activeComponenttEle = that.$refs['drag-item-'+activeComponentData.id][0];
                activeComponenttEle.scrollIntoView({block: 'center'});
                that.showSetting(that.clickComIndex, activeComponentData.id, activeComponentData.componentName);
            })
        },
        // 提交页面
        submitData(){
            let that =this;
            console.log(that.componentsList)
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
            that.updateData({clickComIndex: null})
            that.showSetBlock = false;
        },
        datadragUpdate(e) {
            e.preventDefault();
        },
        datadragEnd(e) {
            // console.log(e, "拖动结束");
        },
        datadragMove(e, originalEve) {
            return (e.draggedContext.element.text!=='Gold（不可拖动元素）');
        },
        // div中内容滚动检测
        componentDivScroll(e){
            let that = this;
            if(!that.showSetCompet) return false;

            let elPositionInfo = that.showSetCompet.getBoundingClientRect();
            that.$set(that.settingPosit, 'top', elPositionInfo.top<=160 ? 160 : elPositionInfo.top )


            let contentHeight = e.target.scrollHeight;
            let viewHeight    = e.target.clientHeight;
            let scrollTop     = e.target.scrollTop;

            let eleHeight     = elPositionInfo.height;
            let eleOffsetTop  = that.showSetCompet.offsetTop;

            let AMEND_TOP = 30 + 65;    // 顶部消失的修正值
            let AMEND_BOTTOM = -20;      // 底部消失的修正值
            let topCritical    = scrollTop > (eleHeight + eleOffsetTop - AMEND_TOP);          // 顶部达到临界
            let bottomCritical = eleOffsetTop > (scrollTop + viewHeight - AMEND_BOTTOM);      // 底部达到临界
            (topCritical || bottomCritical) && that.settingCancel();
        },
        modifySetPosition(settingTop){
            let that = this;
            that.$nextTick(()=>{
                setTimeout(()=>{
                    let settingEle = that.$refs.settingBlock;
                    if(!settingEle) return false;

                    let setHeight = settingEle.getBoundingClientRect().height;
                    if(settingTop+setHeight > that.initPageHight){
                        that.setBlockTop = that.initPageHight-setHeight;
                        that.setRowTop   = setHeight-(that.initPageHight-settingTop);
                    }else{
                        that.setBlockTop = settingTop<0 ? 0: settingTop;
                        that.setRowTop   = 0;
                    }
                }, 20)
            })
        }
    },
    // 离开
    // beforeRouteLeave(to, from, next){
    //     let that = this;
    //     that.$confirm('离开后数据将清空', '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText : '取消',
    //         type : 'warning'
    //     }).then(()=>{
    //         that.$parent.shwoBackup();
    //         // 清除遮罩
    //         that.$store.commit('updateData', {showModal: false});
    //         next()
    //     })
    // },
    watch: {
        showModal(newVal){
            this.$nextTick(()=>{
                this.showSetBtn = this.showSetBlock = newVal
            })
        },
        settingPosit: {
            handler(newVal){
                this.modifySetPosition(newVal.top)
            },
            deep: true
        },
    }
};
</script>

<style lang="less" scoped>
    @import './legoAdd.less';
</style>
