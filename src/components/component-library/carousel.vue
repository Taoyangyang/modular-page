<template>
    <div v-if="setData.carouselImages" class="carousel">
        <div v-if="setData.leftSide" class="tags">
            <el-tag v-for="(item,index) in setData.carouselImages" :key="item.id" type="warning" :class="['tabItem_'+index]"
            :ref="[index==tabIndex?'tabItem_active':'tabItem']" :effect="index==tabIndex ? 'dark':'plain'">
                {{item.itemTitle}}
            </el-tag>
        </div>
        <el-carousel :height="(setData.carouselHeight||'150')+'px'" :autoplay="setData.autoplay" :interval="setData.interval" @change="carouselChange" 
        trigger="click" :style="{padding: setData.leftSide ? '5px 10px':'0'}" >
            <el-carousel-item v-for="item in setData.carouselImages" :key="item.id">
                <el-image :src="item.imgUrl" fit="contain" style="width:100%; height:100%"></el-image>
            </el-carousel-item>
        </el-carousel>
        <!-- <swiper v-if="updatedToggle" :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="item in setData.carouselImages" :key="item.id" 
                :style="{height: setData.carouselHeight+'px', width: setData.leftSide?'85%':'100%'}"
            >
                <img :src="item.imgUrl" fit="contain" style="width:100%; height:100%" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper> -->
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            tabIndex : 0,
            // updatedToggle: false,
            // swiperOption : {
            //     slidesPerView : 'auto',
            //     centeredSlides: true,
            //     spaceBetween  : 10,
            //     loop      : true,
            //     autoplay  :{
            //         disableOnInteraction: false,
            //         delay: 3000
            //     },
            //     pagination: {
            //         el: '.swiper-pagination',
            //         clickable: true
            //     },
            //     observer: true,
            //     observerParents: true  
            // }
        };
    },
    props: {
        setData: { type: Object | Array },
    },
    computed: {
        // swiper() {
        //     return this.$refs.mySwiper.swiper
        // }
    },
    mounted() {
        let that = this;
        // that.updatedSwiper()
    },
    methods: {
        carouselChange(index){
            let that = this;
            that.tabIndex = index;
            that.$nextTick(()=>{
                // let activeEle = that.$refs['tabItem_active'];
                // activeEle && activeEle.length && activeEle[0].$el.scrollIntoView({
                //     behavior: 'smooth',     //平滑滚动，其他还有 instant
                //     block   : 'center'      //元素到页面顶部，其他还有 start, end, center});
                // })
                let eleBox     = document.querySelector(".tags");
                let currentEle = document.querySelector(".tabItem_"+that.tabIndex)
                currentEle && (eleBox.scrollLeft = currentEle.offsetLeft-currentEle.offsetWidth);
            })
        },
        // updatedSwiper(){
        //     let that = this;
        //     that.$nextTick(()=>{
        //         that.$set(that.swiperOption, 'autoplay', that.setData.autoplay && {delay: that.setData.interval});
        //         that.$set(that.swiperOption, 'spaceBetween', that.setData.leftSide ? 10:0);
        //         that.updatedToggle = true;
        //     })
        // }
    },
    watch: {
        // setData:{
        //     handler(newVal, oldVal){
        //         let that = this;
        //         that.updatedToggle = false;
        //         that.updatedSwiper()
        //     },
        //     deep: true
        // }
    }
};
</script>
<style lang='less' scoped>
    .carousel {
        .tags{
            margin: 5px 10px;
            margin-bottom: 0;
            height: 32px;
            width: calc(~"100% - 20px");
            white-space: nowrap;
            overflow-x: auto;
            &::-webkit-scrollbar { 
                width: 0; 
                height: 0; 
            } 
            .el-tag+.el-tag{
                margin-left: 6px
            }
        }
        /deep/.el-carousel{
            .el-carousel__item:nth-child(2n) {
                background-color: #99a9bf;
            }
            .el-carousel__item:nth-child(2n + 1) {
                background-color: #d3dce6;
            }
            .el-carousel__indicators li button{
                width: 4px;
                height: 4px;
                border-radius: 50%;
            }
        }
    }
</style>