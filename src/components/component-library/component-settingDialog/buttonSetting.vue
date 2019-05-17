<template>
    <div class="buttonSetting">
        <el-button type="primary" icon="el-icon-circle-plus" @click="addBtn">添加按钮</el-button>
        <!-- 展示数据区域 -->
        <div class="showDataBlock">
            <div class="showItem flex_start_v" v-for="(item,index) in buttonFormDatas.itemArray" :key="index">
                <el-row>
                    <el-col :span="5">
                        <el-input v-model="item.text" size="mini" placeholder="文本"></el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="item.type" size="mini" placeholder="类型">
                            <el-option v-for="(item,index) in buttonTypes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="item.size" size="mini" placeholder="尺寸">
                            <el-option v-for="(item,index) in buttonSizes" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="6">
                        <el-select v-model="item.style" size="mini" placeholder="样式">
                            <el-option v-for="(item,index) in buttonStyles" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <i class="delIcon el-icon-circle-close" @click="delBtn(index)"></i>
            </div>
        </div>
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
            buttonFormDatas : {
                itemArray: [
                    {text: "确定", type: '', size: '', style: ''},
                    {text: "取消", type: '', size: '', style: ''},
                ]
            },
            buttonTypes: [
                {value: '',        label: '默认按钮'},
                {value: 'primary', label: '主要按钮'},
                {value: 'success', label: '成功按钮'},
                {value: 'info',    label: '信息按钮'},
                {value: 'warning', label: '警告按钮'},
                {value: 'danger',  label: '危险按钮'},
            ],
            buttonSizes: [
                {value: '',        label: '默认'},
                {value: 'medium',  label: '中型'},
                {value: 'small',   label: '小型'},
                {value: 'mini',    label: '超小'},
            ],
            buttonStyles: [
                {value: '',        label: '默认'},
                {value: 'plain',   label: '简洁'},
                {value: 'round',   label: '圆角'},
            ],
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
    mounted(){
        let that = this;
        let objEmpty = Object.keys(that.showData).length==0;
        that.buttonFormDatas = objEmpty ? that.buttonFormDatas : that.showData;
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 添加按钮
        addBtn(){
            let that =this;
            that.buttonFormDatas.itemArray.push({text: "按钮", type: '', size: '', style: ''})
        },
        // 删除按钮
        delBtn(index){
            let that = this;
            that.$confirm('是否删除该按钮?', '提示', {
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
            this.$emit('confirm', this.buttonFormDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        showData: {
            handler(newVal, oldVal) {
                this.buttonFormDatas = newVal.itemArray ? newVal : this.buttonFormDatas;
    　　　　},
    　　　　deep: true
        },
    }
};
</script>
<style lang='less' scoped>
    .buttonSetting{
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
                    height: 21px;
                    width: 80%;
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