/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:52:50 
 * @Last Modified by:   TaoYe 
 * @Last Modified time: 2019-06-20 14:52:50 
 */
<template>
    <div class='pageClassify'>
        <el-dialog class="elDialog pageClassifyDialog" title="页面分类" :visible.sync="dialogOpen" :close-on-click-modal="false" width="30%">
            <div class="classifyContent">
                <el-select v-model="pageClassify" multiple placeholder="请选择">
                    <el-option v-for="item in classifyOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
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
            pageClassify   : [],
            classifyOptions: [],
        };
    },
    props: { 
        visible: {
            type: Boolean, 
            default: false
        },
        classifyData : {
            type: Object,
            default: {}
        }
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
    mounted() { },
    methods: {
        // 获取options数据
        getClassifyOptions(){
            let that = this;
            return new Promise((resolve, reject)=>{
                that.axios.get('/v2/activity/category/listAll').then(res=>{
                    if(res.data && res.data.ret==0){
                        that.classifyOptions = res.data.result;
                        resolve({data: that.classifyOptions})
                    }else{
                        reject({msg: '请求错误'})
                    }
                })

            })
        },
        // 提交分类
        submitPageClassify(){
            let that = this;
            console.log(that.pageClassify)
            that.axios.post('/v2/activity/diy/categorys/update', {
                id       : that.classifyData.id,
                categorys: that.pageClassify.join(',')
            }).then(res=>{
                console.log(res, "=9=9")
                if(res.data && res.data.ret==0){
                    that.$message.success(res.data.msg);
                    that.$emit('close');
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        }
    },
    watch: {
        visible(newVal, oldVal){
            let that = this;
            if(newVal){
                that.getClassifyOptions().then(res=>{
                    console.log(that.classifyData, "9-9-9")
                    that.pageClassify = [];         // 清空选项
                    let categoryList = that.classifyData.categoryList || [];
                    console.log(categoryList,that.pageClassify, "9-999999")
                    categoryList.forEach(item=>{
                        that.pageClassify.push(item.id)
                        console.log(that.pageClassify, "0-0-0-0-0-")
                    })
                })
            }
        }
    }
}
</script>
<style lang='less' scoped>
    .pageClassify{
        .el-select{
            width: 100%;
        }
    }
</style>