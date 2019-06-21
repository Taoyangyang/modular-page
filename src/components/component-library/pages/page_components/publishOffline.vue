/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:52:32 
 * @Last Modified by:   TaoYe 
 * @Last Modified time: 2019-06-20 14:52:32 
 */
<template>
    <div class='publishOffline'>
        <!-- 发布-下线设置弹框 -->
        <el-dialog class="pushOfflineDialog" title="设置发布方式" :visible.sync="dialogOpen" :close-on-click-modal="false" :append-to-body="true" width="30%">
            <div>
                <span>{{`${publishData.type=='1' ? '发布后线上页面内容立即更新，操作不可撤回':'下线后访问该页面将自动跳转至手机端官网'}`}}</span><br /><br />
                <el-form ref="publishSetdata" :model="publishSetdata" label-width="0" size="small">
                    <el-form-item label="">
                        <el-select v-model="publishSetdata.way">
                            <el-option :label="`${publishData.type=='1' ? '定时发布':'定时下线'}`" value="0"></el-option>
                            <el-option :label="`${publishData.type=='1' ? '立即发布':'立即下线'}`" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="publishSetdata.way==0" label="">
                        <el-date-picker v-model="publishSetdata.time" type="datetime" placeholder="选择发布时间" :picker-options="pickerOptions"> </el-date-picker>
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
                way : '0',          //1 立即发布；0 定时发布
                time: ''
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            }
        };
    },
    props: { 
        visible: {
            type: Boolean, 
            default: false
        },
        publishData: {
            type: Object, 
            default: ()=>{
                return {
                    id  : '',
                    type: '1', // 1 发布； 0 下线
                }
            }
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
            let that = this, requestUrl, query = { id : that.publishData.id };

            if(that.publishSetdata.way=='0' && that.publishSetdata.time==''){
                that.$message.error("时间不可为空")
                return false;
            }
            if(that.publishData.type=='1'){     //发布
                requestUrl = '/v2/activity/diy/online';
                query.onlineTime = that.publishSetdata.way=='1' ? '':that.publishSetdata.time;
            }else{                              //下线
                requestUrl = '/v2/activity/diy/offline';
                query.offlineTime = that.publishSetdata.way=='1' ? '':that.publishSetdata.time;
            }

            that.axios.post(requestUrl, query).then(res=>{
                if(res.data.result===true){
                    that.$emit('close');
                    that.$emit('reload');
                    that.$message.success(res.data.msg)
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
    },
    watch: {
        visible(newVal, oldVal){
            if(newVal){
                this.publishSetdata.way = '0';
                this.publishSetdata.time = '';
            }
        }
    },
}
</script>
<style lang='less' scoped>
    
</style>