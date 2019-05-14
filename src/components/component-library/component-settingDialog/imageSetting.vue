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
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
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
    computed: {
        ...mapState({
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    created() {
        console.log(this.showData, "SHOWDATA")
    },
    mounted() {
        let that = this;
        // that.$root.Bus.$on('setHotPosition', value=>{
        //     that.hotSpotsPosition = value;
        // })
    },
    methods: {
        ...mapMutations([ 
            'updateData'
        ]),
        addHotSpots(){
            let that = this;
            console.log(that.componentsList[that.clickComIndex], that.clickComIndex, "******************")
            that.hotSpotsPosition.push({
                boxHeight : 100,
                boxWidth  : 200,
                boxTLPoint: { x: 0, y: 0 },
            })

            that.$set(that.componentsList[that.clickComIndex], "data", that.hotSpotsPosition);
            that.updateData({componentsList: that.componentsList})
            console.log(that.$store.state, "o[o[")
            // that.$root.Bus.$emit('addHotSpot')
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            let that = this;
            let storeData = that.componentsList[that.clickComIndex].data;

            console.log(that.hotSpotsPosition, that.clickComIndex, "p-p-p")
            that.$emit('confirm', {hotSpotsPosition: that.hotSpotsPosition})
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        clickComIndex(newVal, oldVal){
            console.log(newVal, "clickIndex")
        }
    }
}
</script>
<style lang='less' scoped>

</style>