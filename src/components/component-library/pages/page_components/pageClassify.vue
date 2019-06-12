<template>
    <div class='pageClassify'>
        <el-dialog class="elDialog pageClassifyDialog" title="页面分类" :visible.sync="dialogOpen" width="30%">
            <div class="classifyContent">
                <el-select v-model="pageClassify" multiple placeholder="请选择">
                    <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogOpen = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitPageClassify" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as testData from '../../testData'

export default {
    components: {},
    data() {
        return {
            pageClassify  : "",
            classifyOptions: testData.sortOptions,
        };
    },
    props: { 
        visible: {
            type: Boolean, 
            default: false
        },
    },
    computed: {
        dialogOpen: {
            get() {
                return this.visible
            },
            set(val){
                this.$emit('close')
            }
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        submitPageClassify(){
            let that = this;
            console.log(that.pageClassify)
        }
    },
}
</script>
<style lang='less' scoped>
    .pageClassify{
        .el-select{
            width: 100%;
        }
    }
</style>