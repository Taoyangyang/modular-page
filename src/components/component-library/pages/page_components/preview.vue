<template>
    <div class=''>
        <div class="previewBlcok" :style="{width: previewWid+'px'}">
            <div class="pageTopBlock" ref="pageTop">
                <img class="pageTopImg" src="~assets/images/lego/pageTop.jpg" width="100%" @load="imgLoaded">
                <p class="title" :style="topTitleStyle">标题</p>
            </div>
            <div class="preview" :style="{height: previewHei+'px', marginTop: pageTopHei+'px'}">
                <div class="previewContent">
                    <div v-for="item in componentsData" :key="item.id" class="drag-item">
                        <component :is="item.componentName" :setData="item.data" :cId="item.id" :noEditor="true"></component>
                    </div>
                    <!-- 弹框遮罩 -->
                    <div class="modal" v-if="showModal"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';

// 组件
import inputComponent from "../../components/input";
import selectComponent from "../../components/select.vue";
import carouselComponent from "../../components/carousel.vue";
import imageComponent from "../../components/image.vue";
import videoComponent from "../../components/video.vue";
import gridComponent from "../../components/grid.vue";
import buttonComponent from "../../components/button.vue";
import formComponent from "../../components/form.vue";
import dialogComponent from "../../components/dialog.vue";

export default {
    data() {
        return {
            previewHei : 667,       //预览窗口高度
            previewWid : 375,       //预览窗口宽度
            pageTopHei : 0,         //页面顶部title高度    
        };
    },
    props: {
        componentsData: {
            type: Array,
            default: []
        }
    },
    components: {
        inputComponent, selectComponent, carouselComponent, imageComponent, videoComponent, 
        gridComponent, buttonComponent, formComponent, dialogComponent
    },
    computed: {
        ...mapState({
            showModal : state => state.showModal,
        }),
        topTitleStyle(){
            let that = this;
            let fontSize = 16*(that.pageTopHei/65)+'px';
            let bottom = 16*(that.pageTopHei/65)+'px';
            return {bottom, fontSize}
        }
    },
    created() {
        
    },
    mounted() {
        let that = this;
        // that.$nextTick(()=>{
        //     let heiFromTop = 60;
        //     let diffHeight = that.pageTopHei + heiFromTop;

        //     that.windowHei = document.body.offsetHeight;
        //     if(that.windowHei < that.previewHei + diffHeight){
        //         that.previewHei = that.windowHei - diffHeight;
        //         console.log(that.windowHei, that.previewHei, diffHeight, "0-0")
        //         that.previewWid = (that.windowHei - diffHeight)/1.77;

        //         let imgComponents = that.componentsData.filter(item=>item.componentName=='imageComponent');
        //         imgComponents.forEach(item=>{
        //             item.data.hotSpotsPosition.forEach(it=>{
        //                 it.boxTLPoint.x = it.boxTLPoint.x*(that.previewWid/375)
        //                 it.boxTLPoint.y = it.boxTLPoint.y*(that.previewWid/375)
        //                 it.boxHeight = it.boxHeight*(that.previewWid/375)
        //                 it.boxWidth  = it.boxWidth*(that.previewWid/375)
        //             })
        //         })
        //         console.log(imgComponents, "0-0")  
        //     }
        // })
    },
    methods: {
        imgLoaded(){
            let that = this;
            that.$nextTick(()=>{
                that.pageTopHei = that.$refs.pageTop.getBoundingClientRect().height;

                let heiFromTop = 60;
                let diffHeight = that.pageTopHei + heiFromTop;

                that.windowHei = document.body.offsetHeight;
                if(that.windowHei < that.previewHei + diffHeight){
                    that.previewHei = that.windowHei - diffHeight;
                    that.previewWid = (that.windowHei - diffHeight)/1.77;

                    let imgComponents = that.componentsData.filter(item=>item.componentName=='imageComponent');
                    imgComponents.forEach(item=>{
                        item.data.hotSpotsPosition.forEach(it=>{
                            it.boxTLPoint.x = it.boxTLPoint.x*(that.previewWid/375)
                            it.boxTLPoint.y = it.boxTLPoint.y*(that.previewWid/375)
                            it.boxHeight = it.boxHeight*(that.previewWid/375)
                            it.boxWidth  = it.boxWidth*(that.previewWid/375)
                        })
                    })
                }
            })
        }
    },
    watch: {
        previewWid(newVal, oldVal){
            let that = this;
            that.$nextTick(()=>{
                that.pageTopHei = that.$refs.pageTop.getBoundingClientRect().height;
            })
        }
    },
}
</script>
<style lang='less' scoped>
    .previewBlcok{
        position: fixed;
        // position: relative;
        top: 60px;
        right: 20px;
        z-index: 10;
        .pageTopBlock{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 220;
            .title{
                position: absolute;
                left: 0;
                width: 100%;
                text-align: center;
            }
        }
        .preview{
            width: 100%;
            background: white;
            box-shadow: 0 0 5px #ccc;
            height: 667px;
            overflow-y: auto;
            &::-webkit-scrollbar {display:none};
            .previewContent{
                position: relative;
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
        }
    }
</style>