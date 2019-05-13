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
        <div class="eagleMapContainer" v-for="(item,index) in setData.hotSpotsPosition" :key="index" 
            v-dragMove="{setPosition: setPosition, outBoxSize: {w: imgSize.width, h:imgSize.height, index: index, cIndex: cIndex}}" ref="dragBox" 
            :style="{left: item.boxTLPoint.x+'px', top: item.boxTLPoint.y+'px', height: item.boxHeight+'px', width: item.boxWidth+'px'}"
        >{{cIndex}}==>{{index}}
            <div id="tz" v-dragEagle="{setPosition:setPosition, outBoxSize: {w: imgSize.width, h:imgSize.height, index: index, cIndex: cIndex}}"  >
                <div title="拖动调整大小" id="move_tz"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            src : 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
            // hotSpotsPosition : [],
            imgSize  : {
                width : 0,
                height: 0
            }
        };
    },
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
        cIndex: { type: Number, }
    },
    computed: {
        ...mapState({
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    created() {
        console.log(this.setData, "SETTING")
    },
    mounted() {
        let that = this;
        // that.$root.Bus.$on('addHotSpot', ()=>{
        //     that.hotSpotsPosition.push({
        //         boxHeight : 100,
        //         boxWidth  : 200,
        //         boxTLPoint: { x: 0, y: 0 },
        //     })
        // })
    },
    methods: {
        ...mapMutations([ 
            'updateData'
        ]),
        imgLoaded(){
            let that =this;
            setTimeout(() => {
                let sizeInfo = that.$refs.imageEle.getBoundingClientRect();
                that.$set(that.imgSize, 'width', sizeInfo.width)
                that.$set(that.imgSize, 'height', sizeInfo.height)
            }, 100);
        },
        // 热区
        setPosition({left, top, index, cIndex}){
            let that = this;
            let boxInfoData = that.$refs.dragBox[index].getBoundingClientRect();

            that.updateData({clickComIndex: cIndex})
            let dataItem = that.componentsList[that.clickComIndex].data.hotSpotsPosition[index];

            that.$set(dataItem, 'boxHeight', boxInfoData.height);
            that.$set(dataItem, 'boxWidth', boxInfoData.width);
            that.$set(dataItem, 'boxTLPoint', {x: left, y: top});
            // that.$root.Bus.$emit("setHotPosition", {hotSpotsPosition: that.hotSpotsPosition})
            that.updateData({componentsList: that.componentsList})
        },
    },
    watch:{
        componentsList(newVal, oldVal){          //添加的时候出发（解决没有移动的时候不emit数据）
            let that = this;
            console.log('adddddd')
            // that.$root.Bus.$emit("setHotPosition", {hotSpotsPosition: that.hotSpotsPosition})
            that.updateData({componentsList: that.componentsList})
        },
        cIndex(newVal, oldVal){
            console.log(newVal, "cindex变化")
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