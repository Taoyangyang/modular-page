<template>
    <div class='imageSetting'>
        <el-button type="primary" @click="addHotSpots">添加热区</el-button>
        <div class="dataBox" style="min-height:20px">
            <p v-for="(item,index) in showData.hotSpotsPosition" :key="index">热区{{index}}: 宽-{{item.boxWidth}} 高-{{item.boxHeight}} 左上点位置{{item.boxTLPoint.x}}，{{item.boxTLPoint.y}}</p>
        </div>
        <br />
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button type="danger" @click="delet">删除</el-button>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            hotSpotsPosition: []
        };
    },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
    },
    created() {
        
    },
    mounted() {
        let that = this;
        that.$root.Bus.$on('setHotPosition', value=>{
            that.hotSpotsPosition = value;
        })
    },
    methods: {
        addHotSpots(){
            let that = this;
            that.$root.Bus.$emit('addHotSpot')
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.hotSpotsPosition)
        },
        delet(){
            this.$emit('delete')
        }
    },
}
</script>
<style lang='less' scoped>

</style>