<template>
    <div class="index">
        <div class="content flex_between">
            <div class="pageContent">
                <draggable v-model="componentsList" @start="datadragStart" @update="datadragUpdate" @end="datadragEnd" :disabled="!enabled" :move="datadragMove" :options="{animation:500}" >
                    <transition-group>
                        <div v-for="(item,index) in componentsList" :key="item.id" class="drag-item" @click="showSetting($event,index,item.componentName)">
                            <component :is="item.componentName" :setData="item.data"></component>
                        </div>
                    </transition-group>
                </draggable>
            </div>
            <div class="btns">
                <el-button @click="addComponents('inputComponent')">输入框</el-button>
                <el-button @click="addComponents('selectComponent')">选择框</el-button>
                <el-button @click="addComponents('carouselComponent')">轮播图</el-button>
                <el-button @click="addComponents('imageComponent')">图片</el-button>
            </div>
        </div>
        <el-button type="primary" @click="submitData">提交</el-button>
        <!-- 设置 -->
        <div v-if="showSetBlock" class="settingBlock" :style="{top: settingPosit.top+'px', left: settingPosit.left+'px'}">
            <component :is="currentComType+'Setting'" :showData="showData" @cancel="settingCancel" @confirm="settingConfirm" @delete="deleteComponent"></component>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
// 组件
import inputComponent from "./component-library/input.vue";
import selectComponent from "./component-library/select.vue";
import carouselComponent from "./component-library/carousel.vue";
import imageComponent from "./component-library/image.vue";
// 组件设置
import inputSetting from "./component-library/component-settingDialog/inputSetting.vue";
import imageSetting from "./component-library/component-settingDialog/imageSetting.vue";

export default {
    name: "index",
    components: {
        draggable, inputComponent, selectComponent, carouselComponent, imageComponent, 
        inputSetting, imageSetting
    },
    data() {
        return {
            enabled       : true,
            componentsList: [],
            allComponents : [],
            showSetBlock  : false,
            settingPosit  : {
                top  : 0,
                left : 0
            },
            clickComIndex : null,       //当前点击的组件下标
            currentComType: "",         //当前点击的组件类型；
            showData      : {},
        };
    },
    mounted(){
        //为了防止火狐浏览器拖拽的时候以新标签打开，此代码真实有效
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
    },
    methods: {
        // 添加组件
        addComponents(cName){
            let that =this;
            //图片组件的清除事件
            if(cName=='imageComponent'){
                that.$root.Bus.$off('addHotSpot');
            }

            that.componentsList.push({
                id  : that.componentsList.length, 
                componentName: cName, 
                data: {}
            })
            console.log(that.componentsList)
        },
        // 展示设置框
        showSetting(e,index,cName){
            let that = this;
            let elPositionInfo = e.currentTarget.getBoundingClientRect();

            that.clickComIndex = index;
            that.currentComType= cName.split('Component')[0];
            that.showSetBlock  = true;
            that.showData      = that.componentsList[that.clickComIndex]['data'];
            that.$set(that.settingPosit, 'top', elPositionInfo.top - 60)
            that.$set(that.settingPosit, 'left', elPositionInfo.left + elPositionInfo.width + 30);
        },
        // 取消设置
        settingCancel(){
            let that = this;
            that.showData = {};
            that.clickComIndex = null;
            that.showSetBlock  = false;
        },
        // 确认设置
        settingConfirm(data){
            let that = this;
            that.$set(that.componentsList[that.clickComIndex], 'data', data)
            that.clickComIndex = null;
            that.showSetBlock = false;
            console.log(that.componentsList)
        },
        // 删除组件
        deleteComponent(){
            let that = this;
            that.componentsList.splice(that.clickComIndex, 1)
            that.clickComIndex = null;
            that.showSetBlock = false;
        },
        // 提交页面
        submitData(){
            let that =this;
            console.log(that.componentsList)
        },
        // 拖动的事件等等
        datadragStart(e) {
            let that = this;
            console.log(e, "拖动开始");
            that.clickComIndex = null;
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
    }
};
</script>

<style lang="less" scoped>
    .index{
        position: relative;
        width: 100%;
        .content{
            .pageContent{
                padding: 10px;
                width: 375px;
                height: 667px;
                overflow-y: auto;
                border: 2px solid #ccc;
            }
            .drag-item {
                padding: 10px;
                margin: auto;
                width: 355px;
                position: relative;
                background: #f1f1f1;
                border: 1px dashed #ccc;
            }
        }
        .settingBlock{
            position: relative;
            position: absolute;
            padding: 10px;
            width: 300px;
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
