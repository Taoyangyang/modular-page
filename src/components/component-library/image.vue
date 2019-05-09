<template>
    <div class="imageComponent">
        <div class="imgBlock" ref="imageEle">
            <el-image :src="src" @load="imgLoaded" >
                <div slot="placeholder" class="image-slot">
                    加载中
                    <span class="dot">...</span>
                </div>
            </el-image>
        </div>
        <!-- 热区 -->
        <div class="eagleMapContainer" v-for="(item,index) in boxInfoOutput" :key="index" 
            v-dragMove="{setPosition: setPosition, outBoxSize: {w: imgSize.width, h:imgSize.height, index: index}}" ref="dragBox" 
            :style="{left: item.boxTLPoint.x+'px', top: item.boxTLPoint.y+'px', height: item.boxHeight+'px', width: item.boxWidth+'px'}"
        >{{index}}
            <div id="tz" v-dragEagle="{setPosition:setPosition, outBoxSize: {w: imgSize.width, h:imgSize.height, index: index}}"  >
                <div title="拖动调整大小" id="move_tz"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            src : 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            boxInfoOutput : [],
            imgSize  : {
                width : 0,
                height: 0
            }
        };
    },
    computed: {},
    created() {},
    mounted() {
        let that = this;
        that.$root.Bus.$on('addHotSpot', ()=>{
            that.boxInfoOutput.push({
                boxHeight : 100,
                boxWidth  : 200,
                boxTLPoint: { x: 0, y: 0 },
            })
        })
    },
    methods: {
        imgLoaded(){
            let that =this;
            setTimeout(() => {
                let sizeInfo = that.$refs.imageEle.getBoundingClientRect();
                that.$set(that.imgSize, 'width', sizeInfo.width)
                that.$set(that.imgSize, 'height', sizeInfo.height)
            }, 100);
        },
        // 热区
        setPosition({left, top, index}){
            let that = this;
            let boxInfoData = that.$refs.dragBox[index].getBoundingClientRect();
            that.$set(that.boxInfoOutput[index], 'boxHeight', boxInfoData.height);
            that.$set(that.boxInfoOutput[index], 'boxWidth', boxInfoData.width);
            that.$set(that.boxInfoOutput[index], 'boxTLPoint', {x: left, y: top});
            that.$root.Bus.$emit("setHotPosition", {hotSpotsPosition: that.boxInfoOutput})
        },
    },
    watch:{
        boxInfoOutput(newVal, oldVal){          //添加的时候出发（解决没有移动的时候不emit数据）
            let that = this;
            console.log('adddddd')
            that.$root.Bus.$emit("setHotPosition", {hotSpotsPosition: that.boxInfoOutput})
        }
    },
    beforeDestroy(){
        // this.$root.Bus.$off('addHotSpot')
    }
};
</script>
<style lang='less' scoped>
.imageComponent{
    position: relative;
    .eagleMapContainer {
        position: absolute;
        z-index: 200;
        overflow: hidden;
        visibility: visible;
        background: #f1f1f1;
        opacity: .6;
        cursor: move;
        #tz {
            position: absolute;
            right: 1px;
            bottom: 1px;
            width: 28px;
            height: 28px;
            cursor: se-resize;
            z-index: 200001;
            background-image: url("");
            #move_tz {
                position: absolute;
                right: 0px;
                bottom: 0px;
                width: 27px;
                height: 27px;
                cursor: se-resize;
                z-index: 100;
                background-image: url("");
                background: #cccccc;
                background-position: 0px 0px;
                &:hover{
                    background: #696969;
                }
            }
        }
    }
}
</style>