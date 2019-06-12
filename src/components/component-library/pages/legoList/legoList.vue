<template>
    <div class='listPageView legoList'>
        <div class="topBtns">
            <el-button type="primary" size="small" @click="newPage('add')">新建页面</el-button>
        </div>
        <!-- top块 -->
        <div class="tabsBlock flex_between_v">
            <el-tabs v-model="tabActive" @tab-click="handleClick">
                <el-tab-pane v-for="(item,index) in tabsData" :key="index" :label="item" :name="'tab_'+index" ></el-tab-pane>
            </el-tabs>
            <div class="tabsTools">
                <el-dropdown v-if="showOpen" trigger="click">
                    <span class="el-dropdown-link">
                        展开<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in tabsData" :key="index">{{item}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button class="sortManage" type="text" @click="classify">分类管理</el-button>
            </div>
        </div>
        <!-- 搜索块 -->
        <div class="searchArea searchBlock">
            <el-form :inline="true" :model="formData" ref="formData" label-width="80px" size="small">
                <el-form-item label="活动名称">
                    <el-input v-model="formData.name" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="formData.time" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="页面状态">
                    <el-select v-model="formData.state" placeholder="请选择状态">
                        <el-option label="未发布" value="0"></el-option>
                        <el-option label="已发布" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="toSearch">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 列表块 -->
        <div class="listBock" :style="{height: (windowHei-105)+'px'}">
            <div class="listItem" v-for="(item, index) in listData" :key="index">
                <div class="topImg">
                    <el-image :src="item.topImg" fit="cover" style="width: 100%; height: 200px"></el-image>
                    <div class="publishState vertical_v">
                        <span :style="{background: item.state ? '#67C23A':'#D8D8D8'}"></span>
                        {{item.state?"已发布":"未发布"}}
                    </div>
                    <div class="timeInterval flex_between_v">
                        <span>{{item.timeInterval.time}} {{item.timeInterval.type ? '下线':'发布'}}</span>
                        <el-button type="text" style="padding: 7px 0; font-size: 13px;" @click="cancleTask(item.timeInterval.type, item.timeInterval.time)">取消</el-button>
                    </div>
                </div>
                <div class="bottomInfo">
                    <div class="nameAupdateTime">
                        <!-- <p :class="['name', reNameSwitch||reNameIndex!=index?'overfloewEllipsis':'resetStyle']" :contenteditable="nameEditable" :ref="'pName_'+index" @blur="pInputBlur" @input="pInput">{{item.name}}</p> -->
                        <p v-if="reNameSwitch||reNameIndex!=index" :class="['name','overfloewEllipsis']" >{{item.name}}</p>
                        <el-input v-if="reNameIndex==index" type="textarea" placeholder="请输入" v-model="reNameValue" @blur="pInputBlur" @input="pInput" 
                            maxlength="15" show-word-limit :ref="'pName_'+index" resize="none">
                        </el-input>
                        <p v-if="reNameSwitch||reNameIndex!=index" class="updateTime">{{item.updateTime}} 更新</p>
                    </div>
                    <div class="funBtns flex_between_v">
                        <el-button size="mini" @click="editPage(index, item.name)">编辑</el-button>
                        <el-button size="mini" @click="openPubOffDialog('publish')">发布</el-button>
                        <el-button size="mini" @click="preview">预览</el-button>
                        <el-dropdown placement="bottom" trigger="click">
                            <span class="el-dropdown-link">
                                <el-button size="mini" icon="el-icon-more"></el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="rename(index,item.name)">重命名</el-dropdown-item>
                                <el-dropdown-item @click.native="channelLinks">渠道链接</el-dropdown-item>
                                <el-dropdown-item @click.native="pageClassifyVisible=true">页面分类</el-dropdown-item>
                                <el-dropdown-item @click.native="newPage('copy')">复制页面</el-dropdown-item>
                                <el-dropdown-item @click.native="operateLog">操作日志</el-dropdown-item>
                                <el-dropdown-item v-if="item.state" divided @click.native="openPubOffDialog('offline')">下线</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <!-- 预览 -->
        <div v-if="showPreview">
            <div class="previewModal" @click="showPreview=false"></div>
            <preview :componentsData="componentsList"></preview>
        </div>
        <!-- 分页 -->
        <div class="pageArea is-justify-end el-row--flex">
            <el-pagination class="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="4" :page-sizes="[20, 50, 100]" :page-size="20" layout="total, sizes, prev, pager, next, jumper" :total="100"> </el-pagination>
        </div>
        <!-- 发布-下线设置弹框 -->
        <publishOffline :visible="publishVisible" :publishType="publishType" @close="publishVisible=false"></publishOffline>
        <!-- 渠道链接 -->
        <channelLink :visible="channelVisible" @close="channelVisible=false"></channelLink>
        <!-- 页面分类 -->
        <pageClassify :visible="pageClassifyVisible" @close="pageClassifyVisible=false"></pageClassify>
        <!-- 分类弹框 -->
        <el-dialog class="elDialog sortDialog" title="分类管理" :visible.sync="sortVisible" width="30%">
            <div class="sortContent">
                <draggable tag="ul" :list="dynamicTags" class="list-group" handle=".handle">
                    <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)"> 
                        {{tag}} <i class="iconfont icon-tuozhuaijihuo handle"></i>
                    </el-tag>
                </draggable>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="addSortValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" > </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sortVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitSort" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加-复制页面 -->
        <el-dialog class="elDialog addCopyDialog" :title="addPageType=='add'?'新建页面':'复制页面'" :visible.sync="newPageVisible" width="30%">
            <div class="addCopyContent">
                <label for="">页面名称（上限15个中文字符）：</label>
                <el-input v-model="pageName" maxlength="15" placeholder="请输入内容"></el-input>
                <label for="">页面分类：</label>
                <el-select v-model="sortValue" multiple placeholder="请选择">
                    <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newPageVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitNewPage" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 操作日志 -->
        <el-dialog class="elDialog logDialog" title="操作日志" :visible.sync="logVisible" width="50%">
            <div class="logContent">
                <el-table :data="logDatas" style="width: 100%">
                    <el-table-column v-for="item in logDatasHead" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="logVisible = false" size="small">关 闭</el-button>
            </span>
        </el-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import draggable from "vuedraggable";
import * as testData from '../../testData'

import publishOffline from "../page_components/publishOffline";
import preview from "../page_components/preview";
import channelLink from "../page_components/channelLink";
import pageClassify from "../page_components/pageClassify";

export default {
    components: {},
    data() {
        return {
            tabsData   : ['全部', '类目1', '类目2', '未分类'],
            tabActive  : 'tab_0',                   //tab的默认选中
            showOpen   : false,                     //展开的展示开关
            formData   : {                          //表单数据
                name  : "",
                time  : "",
                state : "",
            },
            listData   : testData.listData,         //列表数据
            showPreview: false,                     //展示预览窗
            windowHei  : 0,                         //浏览器窗口高度
            componentsList: testData.componentData, //组件数据

            publishVisible: false,
            publishType   : 'publish',

            reNameIndex   : null,
            reNameSwitch  : true,                   //name 超出隐藏开关
            reNameValue   : '',

            channelVisible: false,                  //渠道弹框开关
            pageClassifyVisible: false,             //页面分类管理

            sortVisible   : false,                  //分类弹框开关
            dynamicTags   : ['标签一', '标签二', '标签三'],
            inputVisible  : false,
            addSortValue  : '',


            newPageVisible: false,                  //添加 复制页面
            addPageType   : 'add',                  //新增页面类型
            pageName      : '',                     //新增页面名称
            sortValue     : '',                     //页面分类
            sortOptions   : testData.sortOptions,

            logVisible    : false,                  //操作日志
            logDatasHead  : [                       //操作日志表头
                {label: '操作日期', prop: 'date', width: '150' },
                {label: '操作人',   prop: 'user', width: '150' },
                {label: '操作内容', prop: 'content', width: '' },
            ],
            logDatas      : [],                     //操作日志数据
        }
    },
    components: { draggable, publishOffline, preview, channelLink, pageClassify },
    computed: {},
    created() {
        console.log(testData)
    },
    mounted() {
        let that = this;
        // that.windowHei = window.screen.availHeight;
        that.windowHei = 700;
        that.$nextTick(()=>{
            setTimeout(()=>{
                that.showOpen = document.querySelector(".legoList .el-tabs .is-scrollable") && true;
            }, 100)
        })
    },
    methods: {
        // 分类管理
        classify(){
            let that = this;
            that.sortVisible = true;
        },
        handleClick(item){
            let that = this;
            console.log(item.index)
        },
        toSearch(){
            let that = this;
            console.log(that.formData)
        },
        resetForm() {
            let that = this;
            for(let key in that.formData){
                that.$set(that.formData, key, "")
            }
        },
        openPubOffDialog(type){
            let that = this;
            that.publishVisible = true; 
            that.publishType    = type;
        },
        //取消定时任务
        cancleTask(type, time){
            let that = this;
            that.$confirm(`定时${type==0?'发布':'下线'}时间：${time}`,`确定取消定时${type==0?'发布':'下线'}？`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$message.success('取消成功!');
            }).catch(() => {});
        },
        // 编辑 添加
        editPage(id, name){
            this.$router.push({path: '/lego_add', query: {pageName: name, id: id}})
        },
        // 预览
        preview(){
            let that = this;
            that.showPreview = true;
        },
        // 重命名
        rename(index, name){
            let that = this;
            that.reNameIndex  = index;
            that.reNameValue  = name;
            that.reNameSwitch = false;
            that.$nextTick(()=>{
                that.$refs['pName_'+index][0].focus();
                // that.po_Last(ele);
            })
        },
        // 失焦提交数据
        pInputBlur(){
            let that = this;
            if(that.reNameIndex || that.reNameIndex==0){
                if(that.reNameValue != that.listData[that.reNameIndex].name){
                    that.$confirm('是否保存重命名?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        console.log(that.reNameValue, "提交的name");
                        that.$set(that.listData[that.reNameIndex], 'name', that.reNameValue);
                        that.$message.success('操作成功!');
                        resetName()
                    }).catch(() => {
                        that.$message.error('操作失败!');
                        resetName()
                    });
                }else{
                    resetName()
                }
            }
            function resetName(){
                that.reNameIndex  = null;
                that.reNameSwitch = true;
                that.reNameValue  = '';
            }
        },
        // 输入赋值数据
        pInput(val){
            let that = this;
            let inputVal = val.replace(/(^\s*)|(\s*$)/g, "");
            if(inputVal.length > 15){
                that.$message.error('最多支持15个字符');
                inputVal = inputVal.slice(0, 15);
            }
            that.reNameValue = inputVal;
        },
        // 渠道链接
        channelLinks(){
            let that = this;
            that.channelVisible = true;
        },
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let addSortValue = this.addSortValue;
            if (addSortValue) {
                this.dynamicTags.push(addSortValue);
            }
            this.inputVisible = false;
            this.addSortValue = '';
        },
        submitSort(){
            let that = this;
            console.log(that.dynamicTags)
        },
        // 添加-复制页面
        newPage(type){
            let that = this;
            console.log(type)
            that.addPageType = type;
            that.newPageVisible = true;

        },
        submitNewPage(){
            let that = this;
            that.newPageVisible = false
            console.log(that.pageName, that.sortValue);
            if(that.addPageType=='add'){
                this.$router.push({path: '/lego_add', query: {pageName: that.pageName, sort:that.sortValue}})
            }else{
                console.log("copyPage")
            }
        },
        // 操作日志
        operateLog(){
            let that = this;
            that.logDatas = [{
                date: '2016-05-02',
                user: '王小虎',
                content: '新增了页面'
            }]
            that.logVisible = true;
        },
        // 下线
        offline(){
            let that = this;
        },
        // 分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    },
    destroyed() {}, 
    watch: {},
}
</script>

<style>
    .legoList .el-tabs{width: calc(100% - 135px);} 
    .legoList .el-tabs .el-tabs__header{margin-bottom: 0;}
    .legoList .el-tabs .el-tabs__header .el-tabs__nav-wrap::after{height: 0}
    .legoList .el-tabs .el-tabs__header .el-tabs__nav-next,
    .legoList .el-tabs .el-tabs__header .el-tabs__nav-prev{ line-height: 40px; }
    .legoList .searchBlock .el-form .el-form-item .el-date-editor--datetime input{ width: 200px; }
    .legoList .pushOfflineDialog .el-dialog .el-dialog__body{ padding: 0 20px; padding-top: 20px }
    .legoList .elDialog .el-dialog .el-dialog__body{ padding: 0 20px; }
    .nameAupdateTime .el-textarea textarea{padding: 4px 15px;}
</style>
<style lang='less' scoped>
    @import './legoList.less';
</style>