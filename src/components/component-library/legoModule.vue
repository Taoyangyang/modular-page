<template>
    <div class='legoModule flex_start'>
        <div class="leftNav">
            <img class="leftNavItem" src="../../assets/images/lego/logo_short.png" width="20">
            <div v-for="(item,index) in leftNavDatas" :key="item.name" :style="{opacity: index==leftNavIndex?'1':'0.6'}" class="leftNavItem" @click="toRoute(item.link, index)">
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
                    <li @click="backupVisible=true">备份</li>
                    <li @click="publishVisible=true">发布</li>
                </ul>
            </div>
            <!-- 发布 -->
            <publishOffline :visible="publishVisible" :publishType="'publish'" @close="publishVisible=false"></publishOffline>
            <!-- 备份 -->
            <el-dialog title="备份" :visible.sync="backupVisible" :append-to-body="true" width="30%">
                <el-form class="backupForm" ref="backupForm" label-position="top" :model="backupData" label-width="80px" size="small">
                    <el-form-item label="分享标题（最多10字）">
                        <el-input v-model="backupData.backupName" maxlength="10" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="backupVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="submitBackup" size="small">备 份</el-button>
                </span>
            </el-dialog>

            <router-view class="pageEnter" :ref="leftNavIndex==0 ? 'addPage':'backupPage'"></router-view>
        </div>
    </div>
</template>

<script>
import publishOffline from "./pages/page_components/publishOffline";
export default {
    components: {publishOffline},
    data() {
        return {
            pageName    : "",
            leftNavDatas: [
                {icon: 'iconfont icon-appstore', name: '组件', link: '/lego_add'},
                {icon: 'iconfont icon-reloadtime', name: '备份', link: '/lego_backup'}
            ],
            leftNavIndex  : 0,
            publishVisible: false,
            backupVisible : false,
            backupData    : {
                backupName: ""
            }
        };
    },
    computed: {},
    created() {
        let that = this;
        that.leftNavIndex = that.$route.path.includes("lego_add")?0:1;
        that.pageName = that.$route.query.pageName || '***';
        that.leftNavDatas[0].link = `/lego_add?pageName=${that.pageName}`
    },
    mounted() {
        
    },
    methods: {
        toRoute(link,index){
            let that = this;
            that.leftNavIndex = index;
            that.$router.replace({path: link})
        },
        save(){
            let that = this;
            that.$refs.addPage && that.$refs.addPage.submitData().then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
                that.$message.error(err.msg);
            });
        },
        submitBackup(){
            let that = this;
            console.log(that.backupData)
        }
    },
    watch: {
        $route(newVal){
            let that = this;
            that.leftNavIndex = newVal.path.includes("lego_add")?0:1;
            that.pageName = that.$route.query.pageName || '***';
        }
    },
}
</script>
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