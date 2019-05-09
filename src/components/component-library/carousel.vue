<template>
    <div class="carousel">
        <el-carousel trigger="click" height="150px">
            <el-carousel-item v-for="item in 4" :key="item">
                <h3 class="small">{{ item }}</h3>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    computed: {},
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
    }
</style>