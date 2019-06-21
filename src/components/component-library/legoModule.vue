<template>
    <div class='legoModule flex_start'>
        <div class="leftNav">
            <img class="leftNavItem" src="../../assets/images/lego/logo_short.png" width="20">
            <div v-for="(item,index) in leftNavDatas" :key="item.name" :style="{opacity: index==leftNavIndex?'1':'0.6'}" class="leftNavItem" 
            @click="$router.replace({path: item.link})">
                <i :class="['icon', item.icon]"></i>
                <p>{{item.name}}</p>
            </div>
        </div>
        <div class="rightContent">
            <div class="topBlock flex_between_v">
                <p>当前页面名称： {{pageName}}</p>
                <ul class="flex_start_v">
                    <li>
                        <el-popover placement="top" width="100" trigger="hover">
                            <img src="~assets/images/qrcode.png" width="100">
                            <span slot="reference">预览</span>
                        </el-popover>
                    </li>
                    <li @click="save">保存</li>
                    <li @click="shwoBackup">备份</li>
                    <li @click="publish">发布</li>
                </ul>
            </div>
            <!-- 发布 -->
            <publishOffline :visible="publishVisible" :publishData="publishData" @close="publishVisible=false"></publishOffline>
            <!-- 备份 -->
            <el-dialog class="backupDialog" title="备份" :visible.sync="backupVisible" :append-to-body="true" width="30%">
                <el-form class="backupForm" ref="backupForm" label-position="top" :model="backupData" label-width="80px" size="small">
                    <el-form-item label="备份名称（最多10字）">
                        <el-input v-model="backupData.backupName" maxlength="10" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="backupVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submitBackup()" size="small">备 份</el-button>
                </span>
            </el-dialog>

            <router-view class="pageEnter" :ref="leftNavIndex==0 ? 'addPage':'backupPage'"></router-view>
        </div>
    </div>
</template>

<script>
import publishOffline from "./pages/page_components/publishOffline";
import publishverify from "./publishVerify";
import { mapState } from 'vuex';

export default {
    components: {publishOffline},
    data() {
        return {
            pageId      : "",
            pageName    : "",
            leftNavDatas: [
                {icon: 'iconfont icon-appstore', name: '组件', link: '/lego_add'},
                {icon: 'iconfont icon-reloadtime', name: '备份', link: '/lego_backup'}
            ],
            leftNavIndex  : 0,
            publishVisible: false,
            publishData   : {},
            backupVisible : false,
            backupData    : {
                backupName: ""
            }
        };
    },
    computed: {
        ...mapState({
            pageSetData: state => state.lego.pageSetData
        })
    },
    created() {
        let that = this;
        that.leftNavIndex = that.$route.path.includes("lego_add")?0:1;
        that.pageName = that.$route.query.pageName || '***';
        that.pageId   = that.$route.query.id || ''
        that.leftNavDatas[0].link = `/lego_add?pageName=${that.pageName}&id=${that.pageId}`
        that.leftNavDatas[1].link = `/lego_backup?pageName=${that.pageName}&id=${that.pageId}`
    },
    mounted() {
        
    },
    methods: {
        // 保存
        save(){
            let that = this;
            that.$refs.addPage && that.$refs.addPage.submitData().then(componentsData=>{
                that.axios.post('/v2/activity/diy/save', {
                    id : that.pageId,
                    content: componentsData,
                }).then(res=>{
                    console.log(res)
                    if(res.data.ret=='0'){
                        // that.$router.push({path: '/lego_list', query: {name: '页面管理'}})
                        that.$store.commit('updateData', {showModal: false});           //关闭遮罩
                        that.$message.success("保存成功");
                    }else{
                        that.$message.error(res.data.msg);
                    }
                })
            }).catch(err=>{
                that.$message.error(err.msg);
            });
        },
        // 展示备份弹框
        shwoBackup(){
            let that = this;
            that.backupVisible = true;
            that.backupData.backupName = ''
        },
        // 提交备份
        submitBackup(){
            let that = this;
            if(that.backupData.backupName){
                that.$refs.addPage && that.$refs.addPage.submitData().then(componentsData=>{
                    that.axios.post("/v2/activity/backup/add", {
                        content: componentsData,
                        diyId  : that.pageId,
                        name   : that.backupData.backupName,
                    }).then(res=>{
                        that.backupVisible = false;
                        if(res.data.ret=='0'){
                            that.$message.success(res.data.msg);
                        }else{
                            that.$message.error(res.data.msg);
                        }
                    })
                }).catch(err=>{
                    that.$message.error(err.msg);
                });
            }else{
                that.$message.error("请输入备份名称");
            }
        },
        // 发布
        publish(){
            let that = this;
            that.$refs.addPage && that.$refs.addPage.submitData().then(cData=>{
                publishverify(cData, that.pageSetData).then(res=>{
                    that.publishData.type = '1';
                    that.publishData.id   = that.pageId;
                    that.publishVisible   = true;
                }).catch(err=>{
                    that.$message.error(err.msg)
                })
            }).catch(err=>{
                that.$message.error(err.msg)
            })
        }
    },
    watch: {
        $route(newVal){
            let that = this;
            // 备份数据操作
            if(newVal.path=="/lego_backup"){
                that.$refs.addPage && that.$refs.addPage.submitData().then(data=>{
                    localStorage.setItem('backupDataStorage', JSON.stringify({
                        data   : data,
                        pageId : that.pageId
                    }))
                })
            }else{
                localStorage.removeItem('backupDataStorage')
            }

            that.$store.commit('updateData', {showModal: false})
            that.leftNavIndex = newVal.path.includes("lego_add")?0:1;
            that.pageName = that.$route.query.pageName || '***';
        }
    },
}
</script>
<style lang="less">
    .backupDialog .el-dialog .el-dialog__body {padding: 10px 20px;}
</style>
<style lang='less' scoped>
    .legoModule{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background: white;
        .leftNav{
            height: 100%;
            width: 60px;
            background: #001529;
            color: white;
            text-align: center;
            .leftNavItem{
                padding: 15px 0;
                // opacity:0.6;
                cursor: pointer;
                .icon{ font-size: 22px; }
                p{ 
                    margin-top: 5px;
                    font-size: 12px; 
                }
            }
        }
        .rightContent{
            width: 100%;
            .topBlock{
                padding: 0 20px;
                width: calc(~"100% - 40px");
                height: 50px;
                line-height: 50px;
                font-size:14px;
                color:rgba(48,49,51,1);
                background: rgba(255,255,255,1);
                box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
                ul{
                    li{
                        padding: 0 10px;
                        height: 15px;
                        line-height: 15px;
                        &+li{
                            border-left: 1px solid #DCDFE6;
                        }
                        &:hover{
                            color: #409EFF;
                            cursor: pointer;
                        }
                    }
                }
            }
            .pageEnter{
                // margin: 10px;
                width: calc(~"100% - 0px");
                height: calc(~"100% - 50px")
            }
        }
    }
</style>