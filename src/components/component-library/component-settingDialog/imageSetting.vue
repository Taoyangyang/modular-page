<template>
    <div class='imageSetting'>
        <el-button type="primary" @click="addHotSpots">添加热区</el-button>
        <div class="dataBox" style="min-height:20px">
            <div class="dataItem" v-for="(item,index) in showData.hotSpotsPosition" :key="index">
                <p><b>热区{{index}}</b>: 宽-{{item.boxWidth}} 高-{{item.boxHeight}} 左上点位置{{item.boxTLPoint.x}}，{{item.boxTLPoint.y}}</p>
                <input type="text" v-model="item.linkUrl" placeholder="请输入图片跳转连接">
                <i class="delIcon el-icon-circle-close" @click="delHotSpot(index)"></i>
            </div>
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
            hotSpotsDatas: [],
        };
    },
    props: {
        showData:{ type: Object | Array },
    },
    computed: {
        ...mapState({
            componentsList: state => state.componentsList,
            clickComIndex : state => state.clickComIndex,	
        })
    },
    created() {
        let that = this;
        console.log(this.showData, "SHOWDATA")
    },
    mounted() {
        let that = this;
        // that.$root.Bus.$on('setHotPosition', value=>{
        //     that.hotSpotsDatas = value;
        // })
    },
    methods: {
        ...mapMutations([ 
            'updateData'
        ]),
        addHotSpots(){
            let that = this;
            let oldDatas = that.componentsList[that.clickComIndex].data.hotSpotsPosition;
            if(oldDatas){
                that.hotSpotsDatas = oldDatas;
            }
            that.hotSpotsDatas.push({
                boxHeight : 100,
                boxWidth  : 200,
                boxTLPoint: { x: 0, y: 0 },
                linkUrl   : "",
            })

            that.$set(that.componentsList[that.clickComIndex], "data", {hotSpotsPosition: that.hotSpotsDatas});
            that.updateData({ componentsList: that.componentsList });
            // 设置框中显示回显数据
            // that.showData = that.componentsList[that.clickComIndex]['data']
            // that.$root.Bus.$emit('addHotSpot')
        },
        delHotSpot(index){
            let that = this;
            that.$confirm('是否删除该热区?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.$delete(that.componentsList[that.clickComIndex].data.hotSpotsPosition, index)
                that.updateData({ componentsList: that.componentsList });
            }).catch(()=>{})
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            let that = this;
            let oldDatas = that.componentsList[that.clickComIndex].data.hotSpotsPosition;
            if(oldDatas){
                that.hotSpotsDatas = oldDatas;
            }
            that.$emit('confirm', {hotSpotsPosition: that.hotSpotsDatas})
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        clickComIndex(newVal, oldVal){
            console.log(newVal, this.componentsList[this.clickComIndex], "clickIndex")
        }
    }
}
</script>
<style lang='less' scoped>
    .imageSetting{
        .dataBox{
            max-height: 400px;
            overflow: auto;
            font-size: 14px;
            .dataItem{
                position: relative;
                margin-top: 5px;
                padding: 5px 2px;
                text-align: left;
                border-radius: 3px;
                border: 1px solid #ccc;
                p{ margin: 4px 0; }
                input{
                    width: calc(~"100% - 14px");
                    height: 22px;
                    border: 1px solid #f1f1f1;
                    padding: 0 5px;
                    border-radius: 3px;
                }
                .delIcon{
                    position: absolute;
                    right: 2px;
                    top: 5px;
                    cursor: pointer;
                    color: #F56C6C;
                }
            }
        }
    }
</style>