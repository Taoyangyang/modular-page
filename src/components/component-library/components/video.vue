<template>
    <div class="videoComponent">
        <video v-if="!IsEmptyObj(setData)" :src="setData.videoUrl" :width="setData.videoWidth" :height="setData.videoHeight" 
            :autoplay="setData.autoplay" :loop="setData.loop" :muted="setData.muted" controls
        >
            <source :src="setData.videoUrl" type="video/mp4">
            <source :src="setData.videoUrl" type="video/ogg">
            您的浏览器不支持 video 视频播放。
        </video>
        <placeholderImg v-else imgType="video"></placeholderImg>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import placeholderImg from "../pages/page_components/placeholderImg";

export default {
    data() {
        return {};
    },
    components: {placeholderImg},
    props: {
        setData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {},
    mounted() {},
    methods: {},
    watch: {}
};
</script>
<style lang='less' scoped>
    .videoComponent{
        text-align: center;
    }
</style>