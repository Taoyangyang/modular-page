/*
 * @Author: TaoYe 
 * @Date: 2019-06-02 14:53:13 
 * @Last Modified by: TaoYe
 * @Last Modified time: 2019-06-20 17:14:04
 */
<template>
    <div class='legoBackup'>
        <div class="mainContent">
            <div class="backupList">
                <p class="backupNum">当前页面{{backupData.length}}个备份</p>
                <el-table class="backupTable" :data="backupData" :height="pageHeight-110">
                    <el-table-column prop="name" label="备份名称" width=""> </el-table-column>
                    <el-table-column prop="updatedTime" label="备份时间" width="180"> </el-table-column>
                    <el-table-column  label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="preview(scope.row)">预览</el-button>
                            <el-button type="text" size="small" @click="restore(scope.row)">恢复</el-button>
                            <el-button type="text" size="small" @click="delet(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 预览 -->
            <preview :componentsData="componentsList"></preview>
        </div>
    </div>
</template>

<script>
import * as testData from '../../testData'
import preview from "../page_components/preview";
import { resolve } from 'q';

export default {
    data() {
        return {
            pageId     : '',
            pageHeight : 0,
            backupData : [],
            previewHei : 667,                       //预览窗口高度
            previewWid : 375,                       //预览窗口宽度
            componentsList: [],                     //组件数据
        };
    },
    components: { preview },
    computed: {},
    created() {
        let that = this;
        that.pageHeight = document.body.clientHeight;
        that.pageId = that.$route.query.id || '';
        // 预览第一条数据
        that.getBackupList().then(res=>{
            res.length && that.preview(res[0])
        })
    },
    mounted() {
        let that = this;
    },
    methods: {
        // 获取备份列表
        getBackupList(){
            let that = this;
            return new Promise(resolve =>{
                that.axios.get('/v2/activity/backup/listByDiyId', {
                    params: { diyId: that.pageId }
                }).then(res=>{
                    if(res.data.ret=='0'){
                        that.backupData = res.data.result;
                        that.backupData.forEach(item=>{
                            item.updatedTime = that.formatDate(new Date(item.updatedDatetime), 'yyyy-MM-dd hh:mm:ss')
                        })
                        resolve(that.backupData)
                    }
                })

            })
        },
        // 预览
        preview(row){
            let that = this;
            that.componentsList = JSON.parse(row.content);
        },
        // 恢复备份
        restore(row){
            let that = this;
            that.$confirm('恢复备份会覆盖你当前编辑的内容，系统将为你自动备份当前内容', '确定恢复备份？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let backupStorage = localStorage.getItem("backupDataStorage");
                try {
                    backupStorage = backupStorage && JSON.parse(backupStorage)
                } catch (error) {
                    backupStorage = null;
                }
                that.restoreFun(row.id, row.diyId).then(rRes=>{
                    if(backupStorage){
                        that.backupFun({
                            cData      : backupStorage.data, 
                            pageId     : backupStorage.pageId, 
                            backupName : '自动备份'
                        }).then(bRes=>{
                            that.$message.success(bRes.data.msg);
                            that.$router.push({path: '/lego_add', query: {
                                id      : rRes.data.result.id,
                                pageName: row.name,
                            }})
                        })
                    }else{
                        that.$message.success(rRes.data.msg);
                        that.$router.push({path: '/lego_add', query: {
                            id      : rRes.data.result.id,
                            pageName: row.name,
                        }})
                    }
                }).catch(err=>{
                    that.$message.error(err.data.msg);
                })
            }).catch(() => {});
        },
        // 备份方法
        backupFun({pageId, cData, backupName}={}){
            let that = this;
            return new Promise((resolve, reject)=>{
                that.axios.post("/v2/activity/backup/add", {
                    content: cData,
                    diyId  : pageId,
                    name   : backupName,
                }).then(res=>{
                    res.data.ret==0 ? resolve(res) : reject(res)
                })
            })
        },
        // 恢复备份方法
        restoreFun(id, did){
            let that = this;
            return new Promise((resolve, reject)=>{
                that.axios.post('/v2/activity/diy/backup/restore', {
                    id   : id,
                    diyId: did
                }).then(res=>{
                    res.data.ret==0 ? resolve(res) : reject(res)
                })
            })
        },
        delet(row){
            let that = this;
            that.$confirm('确定操作，此备份将不可恢复', '确定删除备份？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.axios.post(`/v2/activity/backup/${row.id}/delete`).then(res=>{
                    if(res.data.ret==0){
                        that.getBackupList();
                        that.$message.success(res.data.msg);
                    }else{
                        that.$message.error(res.data.msg);
                    }
                })
            }).catch(() => {});
        }
    },
    watch: {},
}
</script>
<style lang="less">
    .backupTable .el-table__header-wrapper thead th{ background: white !important; }
</style>
<style lang='less' scoped>
    .legoBackup{
        .mainContent{
            height: 100%;
            padding-top: 20px;
            padding-left: 10px;
            background: #EFF1F6;
            .backupList{
                .backupNum{
                    margin-bottom: 10px;
                    height: 20px;
                    font-size: 14px;
                    font-weight:400;
                    color:#606266;
                    line-height:20px;
                }
                .backupTable{
                    width: calc(~"100% - 450px");
                    max-width: 1000px;
                }
            }
        }
    }
</style>