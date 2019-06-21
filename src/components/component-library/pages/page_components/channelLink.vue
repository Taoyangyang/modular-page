/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:53:01 
 * @Last Modified by:   TaoYe 
 * @Last Modified time: 2019-06-20 14:53:01 
 */
<template>
    <div class='channelLink'>
        <el-dialog class="elDialog channelDialog" title="渠道链接" :visible.sync="dialogOpen" :close-on-click-modal="false" :append-to-body="true" width="50%">
            <div class="content">
                <p class="tHint">发布后线上页面内容立即更新，操作不可撤回</p>
                <el-cascader v-if="!createdLinks" v-model="channelValue" :disabled="cascadrDisable" :options="channelOptions" :props="{ multiple: true, expandTrigger: 'hover', checkStrictly: true }" clearable> </el-cascader>
                <!-- <el-select v-if="!createdLinks" v-model="channelValue" multiple placeholder="请选择">
                    <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select> -->
                <div v-else class="channelLinks">
                    <div class="linksList" v-for="(item,index) in linksList" :key="index" >
                        <label for="">{{item.name}}</label>
                        <div class="inputDiv flex_start_v">
                            <input type="text" disabled v-model="item.url" placeholder="渠道链接" >
                            <el-tooltip class="item" effect="dark" content="复制链接" placement="bottom">
                                <i class="icon iconfont icon-link" v-clipboard:copy="item.url" v-clipboard:success="()=>$message.success('复制成功')" v-clipboard:error="()=>$message.error('复制失败')"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="二维码" placement="bottom">
                                <el-popover placement="bottom" title="" width="100" style="min-width: 0" trigger="click">
                                    <div class="QrCode">
                                        <!-- <img src="~assets/images/qrcode.png" width="100" alt=""> -->
                                        <vue-qr logoSrc="" :qid="index.toString()" :text="item.url" :size="100" :margin="0" :dotScale="1" :callback="qrCallBack"></vue-qr>
                                        <p style="text-align: center; margin-top: 5px; color: #409EFF; cursor: pointer" @click="downloadFile(item.qrData, item.name)">保存图片</p>
                                    </div>
                                    <i class="icon iconfont icon-qrcode" slot="reference"></i>
                                </el-popover>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <div v-if="!createdLinks">
                    <el-button @click="dialogOpen=false" size="small">取 消</el-button>
                    <el-button type="primary" @click="createLinks" :loading="submitLoad" size="small">生成链接</el-button>
                </div>
                <div v-else>
                    <el-button @click="modifyChannel" size="small">修改渠道</el-button>
                    <el-button type="primary" @click="dialogOpen = false" size="small">关 闭</el-button>
                </div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import VueQr from 'vue-qr';

export default {
    data() {
        return {
            channelOptions: [],
            channelValue  : [],
            createdLinks  : false,                  //是否已经生成链接
            cascadrDisable: true,
            submitLoad    : false,
            linksList     : [],
        };
    },
    components: { VueQr },
    props: { 
        visible: {
            type: Boolean, 
            default: false
        },
        channelData: {
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
    mounted() {
        
    },
    methods: {
        //获取options数据
        getOptions(){
            let that = this;
            return new Promise((resolve, reject)=>{
                that.axios.get("v2/crmChannel/page", {
                    params: { }
                }).then(res=>{
                    if(res.data && res.data.ret==0){
                        that.cascadrDisable = false;
                        that.channelOptions = that.formatData(res.data.result);
                        resolve(that.channelOptions)
                    }
                })
            })
        },
        // 格式化数据
        formatData(data, childDatas){
            if(this.$typeof(data)!='Array') return [];
            let newData = childDatas ? childDatas:[];
            data.forEach((item,index)=>{
                let newItem = {
                    label: item.name,
                    value: item.id,
                    children: [],
                }
                newData.push(newItem)
                this.formatData(item.channelList, newData[index].children)
            })
            return newData;
        },
        // 创建连接
        createLinks(){
            let that = this;
            let channelIds = [];
            that.submitLoad = true;

            that.channelValue.forEach(item=>{
                channelIds.push(item.slice(-1)[0])
            })
            that.axios.post('/v2/activity/diy/channels/update', {
                id      : that.channelData.id,
                channels: channelIds.join(','),
            }).then(res=>{
                if(res.data && res.data.ret==0){
                    that.submitLoad = false;
                    that.linksList  = res.data.result.channelList;
                    that.createdLinks = true;
                }else{
                    that.submitLoad = false;
                    that.$message.error(res.data.msg)
                }
            })
        },
        // 修改渠道
        modifyChannel(){
            let that = this;
            that.createdLinks = false;
        },
        // 二维码生成回调
        qrCallBack(data, qid){
            this.$set(this.linksList[qid], 'qrData', data)
        }
    },
    watch: {
        visible(newVal, oldVal){
            let that = this;
            if(newVal) {
                that.channelOptions = [];
                that.channelValue   = [];
                that.createdLinks   = false;
                that.cascadrDisable = true;
                that.getOptions()
            }
        }
    },
}
</script>
<style lang="less">
    .channelDialog .el-dialog .el-dialog__body{ padding: 10px 20px; }
</style>
<style lang='less' scoped>
    .channelDialog{
        .content{
            min-height: 75px;
            max-height: 500px;
            overflow-y: auto;
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 8px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 4px;
                background-color: rgba(194,194,194,1);
            }
            .tHint{
                margin-bottom: 10px;
            }
            .el-select, .el-cascader{
                width: 100%;
            }
            .channelLinks{
                .linksList{
                    margin-bottom: 10px;
                    label{
                        font-size:12px;
                        color:rgba(144,147,153,1);
                        line-height:20px;
                    }
                    .inputDiv{
                        padding-right: 10px;
                        width: calc(~"100% - 12px");
                        border: 1px solid #DCDFE6;
                        border-radius: 4px;
                        background-color: #FFF;
                        input{
                            padding-left: 15px;
                            width: calc(~"100% - 56px");
                            height: 40px;
                            line-height: 40px;  
                            box-sizing: border-box;
                            border: none;
                        }
                        .icon{
                            margin-left: 10px;
                            font-size: 18px;
                            cursor: pointer;
                            &:hover{ color: #409EFF }
                        }
                    }
                }
            }
        }
    }
</style>