<template>
    <div class="carousel">
        <el-carousel :height="(setData.carouselHeight||'150')+'px'" :autoplay="setData.autoplay" :interval="setData.interval" trigger="click">
            <el-carousel-item v-for="item in setData.carouselImages" :key="item.id">
                <el-image :src="item.imgUrl" fit="contain" style="width:100%; height:100%"></el-image>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            
        };
    },
    props: {
        setData: { type: Object | Array },
    },
    computed: {
        // ...mapState({
        //     carouselFormItem : state => state.carouselFormItem,				
        // }),
    },
    created() {},
    mounted() {},
    methods: {}
};
</script>
<style lang='less' scoped>
    .carousel {
        /deep/ .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        /deep/ .el-carousel__item:nth-child(2n + 1) {
            background-color: #d3dce6;
        }
        /deep/ .el-carousel__indicators li button{
            width: 4px;
            height: 4px;
            border-radius: 50%;
        }
    }
</style>