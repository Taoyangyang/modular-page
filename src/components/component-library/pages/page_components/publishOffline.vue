<template>
    <div class='publishOffline'>
        <!-- 发布-下线设置弹框 -->
        <el-dialog class="pushOfflineDialog" title="设置发布方式" :visible.sync="dialogOpen" :append-to-body="true" width="30%">
            <div>
                <span>{{`${publishType=='publish' ? '发布后线上页面内容立即更新，操作不可撤回':'下线后访问该页面将自动跳转至手机端官网'}`}}</span><br /><br />
                <el-form ref="publishSetdata" :model="publishSetdata" label-width="0" size="small">
                    <el-form-item label="">
                        <el-select v-model="publishSetdata.type">
                            <el-option :label="`${publishType=='publish' ? '定时发布':'定时下线'}`" value="0"></el-option>
                            <el-option :label="`${publishType=='publish' ? '立即发布':'立即下线'}`" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="publishSetdata.type==0" label="">
                        <el-date-picker v-model="publishSetdata.time" type="datetime" placeholder="选择发布时间"> </el-date-picker>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('close')" size="small">取 消</el-button>
                <el-button type="primary" @click="publish" size="small">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            publishSetdata: {
                type: '0',
                time: ''
            },
        };
    },
    props: { 
        visible: {
            type: Boolean, 
            default: false
        },
        publishType: {
            type: String, 
            default: 'publish'
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
    mounted() {
        
    },
    methods: {
        // 发布
        publish(){
            let that = this;
            console.log(that.publishSetdata)
        },
    },
    watch: {},
}
</script>
<style lang='less' scoped>
    
</style>