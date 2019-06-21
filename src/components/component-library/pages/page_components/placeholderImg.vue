/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:52:42 
 * @Last Modified by:   TaoYe 
 * @Last Modified time: 2019-06-20 14:52:42 
 */
<template>
    <div class='placeholderImg' :style="{height: imgType=='dialogForm'?'100px':'150px'}">
        <img :src="imgUrl" width="100">
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            
        };
    },
    props: {
        imgType:{
            type: String,
            default: 'singleImg'
        }
    },
    computed: {
        imgUrl(){
            let that = this;
            switch (that.imgType) {
                case 'singleImg':
                    return require('assets/images/lego/img_pic@2x.png')
                    break;
                case 'hotAreaImg':
                    return require('assets/images/lego/img_pic@2x.png')
                    break;
                case 'carousel':
                    return require('assets/images/lego/img_carousel@2x.png')
                    break;
                case 'carouselTabs':
                    return require('assets/images/lego/img_tabs@2x.png')
                    break;
                case 'video':
                    return require('assets/images/lego/img_video@2x.png')
                    break;
                case 'form':
                    return require('assets/images/lego/img_form@2x.png')
                    break;
                case 'dialogForm':
                    return require('assets/images/lego/img_pic@2x.png')
                    break;
                default:
                    return ''
                    break;
            }
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        
    },
    updated() {}, 
    beforeDestroy() {}, 
    destroyed() {}, 
    //如果页面有keep-alive缓存功能，这个函数会触发
    activated() {}, 
    watch: {},
}
</script>
<style lang='less' scoped>
    .placeholderImg{
        position: relative;
        width: 100%;
        text-align: center;
        img{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
</style>