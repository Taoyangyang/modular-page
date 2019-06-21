/*
 * @Author: TaoYe 
 * @Date: 2019-06-01 14:54:15 
 * @Last Modified by:   TaoYe 
 * @Last Modified time: 2019-06-20 14:54:15 
 */
<template>
    <div>
        <div v-if="setData.carouselImages" class="carousel">
            <div v-if="setData.showTitle" :class="['tags', 'tags_'+componentId, 'flex_start_v']" :style="{background: pageSetData.bgColor}">
                <span v-for="(item,index) in setData.carouselImages" :key="item.id" :class="['tabItem_'+index]" :style="tabs_3_style(index)" 
                @click.stop="switchCarousel(index)" :ref="[index==tabIndex?'tabItem_active':'tabItem']" >
                    {{item.itemTitle}}
                </span>
                <!-- <el-tag v-for="(item,index) in setData.carouselImages" :key="item.id" :class="['tabItem_'+index]" :hit="false"
                :ref="[index==tabIndex?'tabItem_active':'tabItem']" :color="index==tabIndex ? setData.activeBgColor:setData.defaultBgColor">
                    {{item.itemTitle}}
                </el-tag> -->
            </div>
            <el-carousel :height="(setData.carouselHeight||'150')+'px'" :autoplay="setData.autoplay" :interval="setData.interval" 
            @change="carouselChange" trigger="click" :style="{margin: setData.leftSide ? '16px':'0'}" :ref="'carousel_'+componentId">
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
        <placeholderImg v-else :imgType="config&&config.hasTitle ? 'carouselTabs':'carousel'"></placeholderImg>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import placeholderImg from "../pages/page_components/placeholderImg";

export default {
    data() {
        return {
            tabIndex     : 0,
            componentId  : '',          //当前组件页面的id
            setActiveItem: '0',
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
    components: { placeholderImg },
    props: {
        setData: { type: Object | Array },
        config : { type: Object },
    },
    computed: {
        ...mapState({
            pageSetData: state => state.pageSetData,
        }),
        // swiper() {
        //     return this.$refs.mySwiper.swiper
        // },
        tabs_3_style() {
            return function(index) {
                let that = this; 
                let tabsStyle = {
                    background: index==that.tabIndex ? that.setData.activeBgColor : that.setData.defaultBgColor, 
                    color     : index==that.tabIndex ? that.setData.activeTextColor : that.setData.defaultTextColor, 
                    borderRadius: 32 * that.setData.borderRadius+'px'
                };
                if(that.setData.carouselImages.length<=3){
                    tabsStyle.margin = '0 10px';
                    tabsStyle.marginLeft = index==0 ? '5px':'10px';
                    tabsStyle.width = '33.33%';
                }

                return tabsStyle
            }
        },
    },
    mounted() {
        let that = this;
        that.componentId = that.getUUID();
        // that.updatedSwiper()
    },
    methods: {
        carouselChange(index){
            let that = this;
            if(!that.setData.showTitle) return false;
            
            that.tabIndex = index;
            that.$nextTick(()=>{
                // let activeEle = that.$refs['tabItem_active'];
                // activeEle && activeEle.length && activeEle[0].$el.scrollIntoView({
                //     behavior: 'smooth',     //平滑滚动，其他还有 instant
                //     block   : 'center'      //元素到页面顶部，其他还有 start, end, center});
                // })
                let eleBox     = document.querySelector(".tags_"+that.componentId);
                let currentEle = document.querySelector(`.tags_${that.componentId} .tabItem_${that.tabIndex}`)
                currentEle && (eleBox.scrollLeft = currentEle.offsetLeft-currentEle.offsetWidth);
            })
        },
        switchCarousel(index){
            this.$refs['carousel_'+this.componentId].setActiveItem(index)
        }
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
<style lang="less">
    .carousel .tags .el-tag{color: white;}
</style>
<style lang='less' scoped>
    .carousel {
        .tags{
            padding: 5px;
            // margin: 0 5px;
            height: 32px;
            width: calc(~"100% - 10px");
            white-space: nowrap;
            color: white;
            overflow-x: auto;
            &::-webkit-scrollbar { 
                width: 0; 
                height: 0; 
            } 
            .el-tag+.el-tag{
                margin-left: 6px
            }
            span{
                display: inline-block;
                padding: 0 10px;
                height: 32px;
                line-height: 32px;
                font-size: 14px;
                &+span{
                    margin-left: 6px
                }
            }
        }
        /deep/.el-carousel{
            .el-carousel__indicators {
                li button{
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                }
                .is-active button{
                    background: #409EFF
                }
            }
        }
    }
</style>