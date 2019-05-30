<template>
    <div class="index">
        <div class="content flex_between">
            <div class="showContent">
                <div class="pageContent" ref="componentsDiv">
                    <draggable v-model="componentsList" @start="datadragStart" @update="datadragUpdate" @end="datadragEnd" :disabled="!enabled" :move="datadragMove" :options="{animation:500}" >
                        <transition-group>
                            <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" @mouseenter="mouseEnter($event, index, item.componentName)">
                                <component :is="item.componentName" :setData="item.data" :cId="item.id"></component>
                            </div>
                        </transition-group>
                    </draggable>
                    <!-- 弹框遮罩 -->
                    <div class="modal" v-if="showModal"></div>
                </div>
                <div v-if="showSetBtn && clickComIndex!=null" class="funBlock" :style="{top: settingPosit.top+'px', left: settingPosit.left+'px'}">
                    <i class="icon el-icon-arrow-up" @click="toUp"></i>
                    <i class="icon el-icon-arrow-down" @click="toDown"></i>
                    <i class="icon el-icon-s-tools" @click="showSetting"></i>
                    <i class="icon el-icon-delete" @click="deleteComponent"></i>
                </div>
            </div>
            <div class="btns">
                <el-button @click="addComponents('inputComponent')">输入框</el-button>
                <el-button @click="addComponents('selectComponent')">选择框</el-button>
                <el-button @click="addComponents('carouselComponent')">轮播图</el-button>
                <el-button @click="addComponents('imageComponent')">图片</el-button>
                <el-button @click="addComponents('videoComponent')">视频</el-button>
                <el-button @click="addComponents('gridComponent')">宫格</el-button>
                <el-button @click="addComponents('buttonComponent')">按钮</el-button>
                <el-button @click="addComponents('formComponent')">Form表单</el-button>
                <el-button @click="addComponents('dialogComponent')">弹窗表单</el-button>
            </div>
        </div>
        <el-button type="primary" @click="submitData">提交</el-button>
        <!-- 设置 -->
        <div v-if="showSetBlock" class="settingBlock" :style="{top: settingPosit.top+'px', left: settingPosit.left+'px'}">
            <component :is="currentComType+'Setting'" :showData="showData" @cancel="settingCancel" @confirm="settingConfirm"></component>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
// 组件
import inputComponent from "./component-library/input.vue";
import selectComponent from "./component-library/select.vue";
import carouselComponent from "./component-library/carousel.vue";
import imageComponent from "./component-library/image.vue";
import videoComponent from "./component-library/video.vue";
import gridComponent from "./component-library/grid.vue";
import buttonComponent from "./component-library/button.vue";
import formComponent from "./component-library/form.vue";
import dialogComponent from "./component-library/dialog.vue";
// 组件设置
import inputSetting from "./component-library/component-settingDialog/inputSetting.vue";
import imageSetting from "./component-library/component-settingDialog/imageSetting.vue";
import carouselSetting from "./component-library/component-settingDialog/carouselSetting.vue";
import selectSetting from "./component-library/component-settingDialog/selectSetting.vue";
import videoSetting from "./component-library/component-settingDialog/videoSetting.vue";
import gridSetting from "./component-library/component-settingDialog/gridSetting.vue";
import buttonSetting from "./component-library/component-settingDialog/buttonSetting.vue";
import formSetting from "./component-library/component-settingDialog/formSetting.vue";
import dialogSetting from "./component-library/component-settingDialog/formSetting.vue";

export default {
    name: "index",
    components: {
        draggable, inputComponent, selectComponent, carouselComponent, imageComponent, videoComponent, gridComponent, buttonComponent, formComponent, dialogComponent,
        inputSetting, imageSetting, carouselSetting, selectSetting, videoSetting, gridSetting, buttonSetting, formSetting, dialogSetting
    },
    data() {
        return {
            enabled       : true,
            showSetBlock  : false,
            settingPosit  : {
                top  : 0,
                left : 0
            },
            // clickComIndex : null,       //当前点击的组件下标
            currentComType: "",         //当前点击的组件类型；
            showData      : {},
            selecComponent: '',
            showSetBtn    : false,
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
        }
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
        addComponents(cName){
            let that =this;
            //计算动态的id值
            let componentsLen = that.componentsList.length;
            let dynamicID = componentsLen ? that.componentsList.reduce((item1, item2) => (item1.id > item2.id ? item1 : item2)).id+1 : 1;

            that.componentsList.push({
                componentName: cName, 
                id  : dynamicID, 
                data: {}
            })
            that.updateData({componentsList: that.componentsList})
        },
        // 展示设置框
        showSetting(){
            let that = this;
            // that.updateData({clickComIndex: that.selecIndexselecIndex})

            that.showSetBlock   = true;
            that.currentComType = that.selecComponent.split('Component')[0];
            that.showData       = that.componentsList[that.clickComIndex]['data'];
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
            console.log(data, that.$store.state, "dddd")
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
            that.componentsList.splice(that.clickComIndex, 1)
            that.updateData({
                clickComIndex : null,
                componentsList: that.componentsList
            })
            that.showSetBlock = false;
            that.showSetBtn   = false;
        },
        //排序
        toUp(){
            let that = this;
            if(that.clickComIndex==0) return false;
            that.dataInterchange(that.componentsList, that.clickComIndex-1, that.clickComIndex)
        },
        //排序
        toDown(){
            let that = this;
            if(that.clickComIndex==that.componentsList.length-1) return false;
            that.dataInterchange(that.componentsList, that.clickComIndex+1, that.clickComIndex)
        },
        // 鼠标进入
        mouseEnter(e, index, componentName){
            let that = this;
            that.showSetBtn = true;
            if(that.clickComIndex!=index) that.showSetBlock = false;

            that.updateData({ clickComIndex : index, })

            that.selecComponent = componentName;
            let elPositionInfo = e.currentTarget.getBoundingClientRect();

            that.$set(that.settingPosit, 'top', elPositionInfo.top - 60)
            that.$set(that.settingPosit, 'left', elPositionInfo.left + elPositionInfo.width+10);
            
        },
        // 提交页面
        submitData(){
            let that =this;
            console.log(that.componentsList)
            console.log(JSON.stringify(that.componentsList))
        },

        // 拖动的事件等等=======================================================>
        datadragStart(e) {
            let that = this;
            console.log(e, "拖动开始");
            that.updateData({clickComIndex: null})
            that.showSetBlock = false;
        },
        datadragUpdate(e) {
            console.log(e, "拖动更新");
            e.preventDefault();
            console.log(`拖动前的索引 : ${e.oldIndex}, 拖动后的索引 : ${e.newIndex}`);
            console.log(this.componentsList);
        },
        datadragEnd(e) {
            console.log(e, "拖动结束");
        },
        datadragMove(e, originalEve) {
            console.log(e, originalEve, "拖动移动");
            console.log(`拖动前的索引 : ${e.draggedContext.index}, 拖动后的索引 : ${e.draggedContext.futureIndex}, 拖拽前-上次数据：`, e.relatedContext.list);
            return (e.draggedContext.element.text!=='Gold（不可拖动元素）');
        },
        // div中内容滚动检测
        componentDivScroll(e){
            let that = this;
            that.settingCancel();
        }
    }
};
</script>

<style lang="less" scoped>
    .index{
        position: relative;
        width: 100%;
        .content{
            .showContent{
                position: relative;
                .pageContent{
                    padding: 5px;
                    width: 375px;
                    height: 667px;
                    overflow-y: auto;
                    border: 2px solid #ccc;
                    &::-webkit-scrollbar {display:none}
                    .drag-item {
                        padding: 10px;
                        margin: auto;
                        width: 355px;
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
                        z-index: 1;
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
                width: 450px;
                text-align: left;
                /deep/ .el-button{
                    margin: 10px;
                }
            }
        }
        .settingBlock{
            position: relative;
            position: absolute;
            padding: 10px;
            width: 400px;
            background: #f1f1f1;
            border-radius: 5px;
            &::before{
                position: absolute;
                content: "";
                top: 15px;
                left: -10px;
                border: 10px solid #f1f1f1;
                transform: rotateZ(45deg);
            }
        }
    }
</style>
