<template>
    <div class='legoBackup'>
        <div class="mainContent">
            <div class="backupList">
                <p class="backupNum">当前页面？？个备份</p>
                <el-table class="backupTable" :data="backupData" :height="pageHeight-110">
                    <el-table-column prop="name" label="备份名称" width=""> </el-table-column>
                    <el-table-column prop="date" label="备份时间" width="180"> </el-table-column>
                    <el-table-column  label="操作" width="100">
                        <template slot-scope="scope">
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

export default {
    data() {
        return {
            pageHeight: 0,
            backupData: [
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
                {date: '2016-05-04', name: '备份名称11111111111'},
            ],
            previewHei : 667,                       //预览窗口高度
            previewWid : 375,                       //预览窗口宽度
            componentsList: testData.componentData, //组件数据
        };
    },
    components: { preview },
    computed: {},
    created() {
        let that = this;
        that.pageHeight = document.body.clientHeight;
    },
    mounted() {
        let that = this;
    },
    methods: {
        restore(row){
            let that = this;
            that.$confirm('恢复备会覆盖你当前编辑的内容，系统将为你自动备份当前内容', '确定恢复备份？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$message.success('恢复成功!');
                that.$router.push({path: '/lego_add', query: {pageName: row.name}})
            }).catch(() => {});
        },
        delet(){
            let that = this;
            that.$confirm('确定操作，此备份将不可恢复', '确定删除备份？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$message.success('删除成功!');
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