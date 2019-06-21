<template>
    <div class="gridSetting">
        <el-form :model="gridFormDatas">
            <el-form-item label="总元素数" label-width="120px">
                <el-input v-model="gridFormDatas.totalNum" size="small" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="每行元素数" label-width="120px">
                <el-input v-model="gridFormDatas.perRowNum" size="small" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="元素高度" label-width="120px">
                <el-input v-model="gridFormDatas.perItemHieght" size="small" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="展示文字" label-width="120px">
                <el-col :span="8">
                    <el-switch v-model="gridFormDatas.hasText"></el-switch>
                </el-col>
            </el-form-item>
            <!-- 展示数据区域 -->
            <div class="showDataBlock">
                <div class="showItem flex_start_v" v-for="(item,index) in gridFormDatas.itemArray" :key="index">
                    <img :src="item.imgUrl" width="40" height="40" @click="chooseImg(index)">
                    <div class="inputs">
                        <input type="text" :disabled="!gridFormDatas.hasText" v-model="item.text" placeholder="请输入文本">
                        <input type="text" v-model="item.linkUrl" placeholder="请输入链接">
                    </div>
                    <i class="delIcon el-icon-circle-close" @click="delGridItem(index)"></i>
                </div>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- <el-button type="danger" @click="delet">删除</el-button> -->
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            gridFormDatas : {
                totalNum     : "6",
                perRowNum    : "3",
                perItemHieght: "88",
                hasText      : true,
                itemArray    : [
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                    {imgUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', text: '文本', linkUrl: ''},
                ]
            },
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
            componentsList: state => state.lego.componentsList,
            clickComIndex : state => state.lego.clickComIndex,	
        })
    },
    mounted(){
        let that = this;
        that.gridFormDatas = that.IsEmptyObj(that.showData) ? that.gridFormDatas : that.showData;
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 选择图片
        chooseImg(index){
            let that = this;
            console.log("选择图片", index)
        },
        // 删除宫格
        delGridItem(index){
            let that = this;
            that.$confirm('是否删除该宫格?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.$delete(that.componentsList[that.clickComIndex].data.itemArray, index)
                that.updateData({ componentsList: that.componentsList });
            }).catch(()=>{})
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.gridFormDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        showData: {
            handler(newVal, oldVal) {
                this.gridFormDatas = newVal.totalNum ? newVal : this.gridFormDatas;
    　　　　},
    　　　　deep: true
        },
        'gridFormDatas.totalNum'(newVal, oldVal) {
            let that = this;
            if(newVal){
                that.$set(that.gridFormDatas, 'itemArray', []);
                for(let i=0; i<newVal; i++){
                    that.gridFormDatas.itemArray.push({
                        imgUrl  : 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', 
                        text    : '文本',
                        linkUrl : ''
                    })
                }
            }
        }
    }
};
</script>
<style lang='less' scoped>
    .gridSetting{
        text-align: center;
        /deep/ .el-form .el-form-item{
            margin-bottom: 8px;
        }
        .showDataBlock{
            margin-bottom: 10px;
            max-height: 300px;
            overflow: auto;
            font-size: 14px;
            .showItem{
                position: relative;
                margin-top: 5px;
                padding: 5px 2px;
                padding-left: 10px;
                text-align: left;
                border-radius: 3px;
                border: 1px solid #ccc;
                input{
                    margin-left: 10px;
                    height: 21px;
                    width: calc(~"100% - 40px");
                    border: 1px solid #f1f1f1;
                    padding: 0 5px;
                    border-radius: 3px;
                    +input{margin-top: 2px}
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