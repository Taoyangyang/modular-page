/*
 * @Author: TaoYe 
 * @Date: 2019-06-03 11:52:37 
 * @Last Modified by: TaoYe
 * @Last Modified time: 2019-06-21 14:55:48
 */

<template>
    <div class='listPageView legoList'>
        <div class="topBtns">
            <el-button type="primary" size="small" @click="newPage('add')">新建页面</el-button>
        </div>
        <!-- top块 -->
        <div class="tabsBlock flex_between_v">
            <el-tabs v-model="tabActiveId" @tab-click="tabsClick">
                <el-tab-pane v-for="(item,index) in tabsData" :key="index" :label="item.name" :name="item.id" ></el-tab-pane>
            </el-tabs>
            <div class="tabsTools">
                <el-dropdown v-if="showOpen" trigger="click" @command="tabsClick">
                    <span class="el-dropdown-link">
                        展开<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu class="tabsListBlock" slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in tabsData" :key="index" :command="item.id">{{item.name}}</el-dropdown-item>
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
                    <el-date-picker v-model="formData.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                </el-form-item>
                <el-form-item label="页面状态">
                    <el-select v-model="formData.state" placeholder="请选择状态">
                        <el-option label="未发布" value="1"></el-option>
                        <el-option label="已发布" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="getListData()">搜索</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 列表块 -->
        <div class="listBock" :style="{height: (windowHei-105)+'px'}">
            <div class="listItem" v-for="(item, index) in listData" :key="index">
                <div class="topImg">
                    <el-image :src="item.shareImageUrl" fit="cover" style="width: 100%; height: 200px"></el-image>
                    <div class="publishState vertical_v">
                        <span :style="{background: item.status==2 ? '#67C23A':'#D8D8D8'}"></span>
                        {{item.status==2?"已发布":"未发布"}}
                    </div>
                    <div v-if="item.imminentOperateStatus==1||item.imminentOperateStatus==2" class="timeInterval flex_between_v">
                        <span>{{item.imminentOperateTime}} {{item.status==2 ? '下线':'发布'}}</span>
                        <el-button type="text" style="padding: 7px 0; font-size: 13px;" @click="cancleTask(item)">取消</el-button>
                    </div>
                </div>
                <div class="bottomInfo">
                    <div class="nameAupdateTime">
                        <p v-if="reNameSwitch||reNameIndex!=index" :class="['name','overfloewEllipsis']" >{{item.name}}</p>
                        <el-input v-if="reNameIndex==index" type="textarea" placeholder="请输入" v-model.trim="reNameValue" @blur="submitNameModify" 
                            @keyup.enter.native="renameEnterKeyUp" maxlength="15" show-word-limit :ref="'pName_'+index" resize="none">
                        </el-input>
                        <p v-if="reNameSwitch||reNameIndex!=index" class="updateTime">{{formatDate(new Date(item.updatedDatetime), 'yyyy-MM-dd hh:mm')}} 更新</p>
                    </div>
                    <div class="funBtns flex_between_v">
                        <el-button size="mini" @click="editPage(item)">编辑</el-button>
                        <el-button size="mini" :disabled="item.status==2" @click="openPubOffDialog('1', item)">发布</el-button>
                        <el-button size="mini" @click="preview(item)">预览</el-button>
                        <el-dropdown placement="bottom" trigger="click">
                            <span class="el-dropdown-link">
                                <el-button size="mini" icon="el-icon-more"></el-button>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="rename(index,item)">重命名</el-dropdown-item>
                                <el-dropdown-item @click.native="channelLinks(item)">渠道链接</el-dropdown-item>
                                <el-dropdown-item @click.native="pageClassify(item)">页面分类</el-dropdown-item>
                                <el-dropdown-item @click.native="newPage('copy', item)">复制页面</el-dropdown-item>
                                <el-dropdown-item @click.native="operateLog(item)">操作日志</el-dropdown-item>
                                <el-dropdown-item v-if="item.status==2" divided @click.native="openPubOffDialog('0', item)">下线</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <!-- 预览 -->
        <div v-if="showPreview">
            <div class="previewModal" @click="closePreview"></div>
            <preview :componentsData="componentsList"></preview>
        </div>
        <!-- 分页 -->
        <div class="pageArea is-justify-end el-row--flex">
            <el-pagination class="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNo" :page-sizes="[20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalNum"> </el-pagination>
        </div>
        <!-- 发布-下线设置弹框 -->
        <publishOffline :visible="publishVisible" :publishData="publishData" @close="publishVisible=false" @reload="reloadData"></publishOffline>
        <!-- 渠道链接 -->
        <channelLink :visible="channelVisible" :channelData="channelData" @close="channelVisible=false"></channelLink>
        <!-- 页面分类 -->
        <pageClassify :visible="pageClassifyVisible" :classifyData="pageClassifyData" @close="pageClassifyVisible=false"></pageClassify>
        <!-- 分类弹框 -->
        <el-dialog class="elDialog sortDialog" title="分类管理" :visible.sync="sortVisible" :close-on-click-modal="false" width="40%">
            <div class="sortContent">
                <draggable tag="ul" :list="dynamicTags" class="list-group" handle=".handle">
                    <el-tag :key="tag.name" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)"> 
                        {{tag.name}} <i class="iconfont icon-tuozhuaijihuo handle"></i>
                    </el-tag>
                </draggable>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="addSortValue" ref="saveTagInput" size="small" maxLength="6" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" > </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加分类</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sortVisible=false" size="small">取 消</el-button>
                <el-button type="primary" @click="sortVisible=false" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加-复制页面 -->
        <el-dialog class="elDialog addCopyDialog" :title="addPageType=='add'?'新建页面':'复制页面'" :visible.sync="newPageVisible" :close-on-click-modal="false" width="30%">
            <div class="addCopyContent">
                <label for="">页面名称（上限15个中文字符）：</label>
                <el-input v-model="pageName" maxlength="15" placeholder="请输入内容"></el-input>
                <label for="">页面分类：</label>
                <el-select v-model="sortValue" multiple placeholder="请选择">
                    <el-option v-for="item in sortOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newPageVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitNewPage" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 操作日志 -->
        <el-dialog class="elDialog logDialog" title="操作日志" :visible.sync="logVisible" :close-on-click-modal="false" width="50%">
            <div class="logContent">
                <el-table :data="logDatas" height="450" style="width: 100%">
                    <el-table-column v-for="item in logDatasHead" :key="item.label" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                </el-table>
                <el-pagination layout="prev, pager, next" :current-page.sync="logQuery.pageNo" :page-size="logQuery.pageSize" :total="logTotalNum" @current-change="getLogData"> </el-pagination>
            </div>
        </el-dialog>
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
import '@/assets/less/list-page.less';
import draggable from "vuedraggable";

import publishverify from "../../publishVerify";
import publishOffline from "../page_components/publishOffline";
import preview from "../page_components/preview";
import channelLink from "../page_components/channelLink";
import pageClassify from "../page_components/pageClassify";

export default {
    components: {},
    data() {
        return {
            pageNo     : 1,
            pageSize   : 20,
            totalNum   : 0,

            tabsData   : [{name: '全部'}],
            tabActiveId: '0',                       //tab的默认选中
            showOpen   : false,                     //展开的展示开关
            formData   : {                          //表单数据
                name  : "",
                time  : [],
                state : "",
            },

            listData   : [],                         //列表数据
            showPreview: false,                     //展示预览窗
            windowHei  : 0,                         //浏览器窗口高度
            componentsList: [],                     //组件数据

            publishVisible: false,
            publishData   : {},

            reNameIndex   : null,
            reNameSwitch  : true,                   //name 超出隐藏开关
            reNameId      : '',
            reNameValue   : '',

            channelVisible: false,                  //渠道弹框开关
            channelData   : {},
            pageClassifyVisible: false,             //页面分类管理
            pageClassifyData   : {},                //页面分类数据     

            sortVisible   : false,                  //分类弹框开关
            dynamicTags   : [],
            inputVisible  : false,
            addSortValue  : '',

            newPageVisible: false,                  //添加 复制页面
            addPageType   : 'add',                  //新增页面类型
            pageName      : '',                     //新增页面名称
            pageCopyId    : '',                     //复制的页面的id
            sortValue     : '',                     //页面分类
            sortOptions   : [],

            logVisible    : false,                  //操作日志
            logDatasHead  : [                       //操作日志表头
                {label: '操作日期', prop: 'createdTime', width: '150' },
                {label: '操作人',   prop: 'createdUserName', width: '150' },
                {label: '操作内容', prop: 'operFieldDesc', width: '' },
            ],
            logQuery      : {
                id      : '',
                pageNo  : 1,
                pageSize: 20
            },
            logTotalNum   : 0,
            logDatas      : [],                     //操作日志数据
        }
    },
    components: { draggable, publishOffline, preview, channelLink, pageClassify },
    computed: {
        ...mapState({
            showModal : state => state.lego.showModal,
        }),
    },
    created() {
        let that = this;
        that.getSortData();
        that.getListData();
    },
    mounted() {
        let that = this;
        that.spreadBtnControl();
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        // 获取分类数据==============================================
        getSortData(){
            let that = this;
            that.axios.get('/v2/activity/category/listAll', {
                params: { containsAll: true }
            }).then(res=>{
                if(res.data && res.data.ret==0){
                    that.tabsData = res.data.result;
                    that.tabsData.forEach(item=>{
                        if(item.id===null) item.id='0';
                        item.id = isNaN(item.id) ? item.id : String(item.id);
                    })
                }
            }).catch(err=>{})
        },
        // 获取列表数据
        getListData(){
            let that = this;
            let searchTime= that.formData.time;
            let beginDate = searchTime && searchTime[0] ? that.formatDate(new Date(searchTime[0]), "yyyy-MM-dd"):'', 
                endDate   = searchTime && searchTime[1] ? that.formatDate(new Date(searchTime[1]), "yyyy-MM-dd"):'';

            that.axios.post('/v2/activity/diy/page', {
                name      : that.formData.name, 
                beginDate : beginDate, 
                endDate   : endDate,
                status    : that.formData.state, 
                categoryId: that.tabActiveId,
                pageNo    : that.pageNo, 
                pageSize  : that.pageSize,
            }).then(res=>{
                if(res.data && res.data.ret==0){
                    that.listData = res.data.rows;
                    that.totalNum = res.data.total;
                }
            }).catch(err=>{})
        },
        // 重新加载数据
        reloadData(){
            setTimeout(()=>{
                this.getListData()
            }, 100)
        },
        // 分类管理==============================================
        classify(){
            let that = this;
            that.dynamicTags = that.tabsData;
            that.sortVisible = true;
        },
        // 分类添加功能
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 添加 分类
        handleInputConfirm() {
            let that = this;
            let addSortValue = that.addSortValue;
            if (addSortValue) {
                that.axios.post('/v2/activity/category/add', {
                    name: addSortValue
                }).then(res=>{
                    if(res.data && res.data.ret==0){
                        res.data.result.id = String(res.data.result.id)
                        that.dynamicTags.push(res.data.result);
                        that.inputVisible = false;
                        that.addSortValue = '';
                        that.$message.success("添加成功")
                    }
                }).catch(err=>{
                    that.$message.error("添加失败")
                })
            }
        },
        // 删除分类
        handleClose(tag) {
            let that = this;
            that.$confirm(`是否删除分类-${tag.name}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText : '取消',
                type : 'warning'
            }).then(()=>{
                that.axios.post(`/v2/activity/category/${tag.id}/delete`).then(res=>{
                    if(res.data && res.data.result){
                        that.dynamicTags.splice(that.dynamicTags.indexOf(tag), 1);
                        that.$message.success("删除成功")
                    }
                }).catch(err=>{
                    that.$message.error("删除失败")
                })
            })
        },
        // tab点击 分类
        tabsClick(item){
            let that = this;
            if(that.$typeof(item)!='Object') that.tabActiveId=item;
            that.getListData();
        },
        // 重置==============================================
        resetForm() {
            let that = this;
            for(let key in that.formData){
                that.$set(that.formData, key, "")
            }
            that.getListData();
        },
        // 发布-下线弹框
        openPubOffDialog(type, item){
            let that = this;
            if(type=='1'){          // 发布
                publishverify(item.content, {
                    id         : item.id,
                    shareTitle : item.title,
                    desc       : item.description,
                    dynamicTags: item.keyWords ? item.keyWords.split(','):[],
                    shareImg   : item.shareImageUrl,
                    absoluteUrl: item.shareImagePath,
                    bgColor    : item.backgroundColor,
                }).then(_=>{
                    that.publishVisible   = true; 
                    that.publishData.type = type;
                    that.publishData.id   = item.id;
                }).catch(err=>{
                    that.$message.error(err.msg)
                })
            }else{                  // 下线
                that.publishVisible   = true; 
                that.publishData.type = type;
                that.publishData.id   = item.id;
            }
        },
        //取消定时任务
        cancleTask(item){
            let that = this;
            let operateStatus = item.imminentOperateStatus;
            that.$confirm(`定时${operateStatus==2?'发布':'下线'}时间：${item.imminentOperateTime}`,`确定取消定时${operateStatus==2?'发布':'下线'}？`, {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.axios.post('/v2/activity/diy/quartz/cancel', {
                    id: item.id,  
                    imminentOperateStatus: operateStatus
                }).then(res=>{
                    if(res.data.ret==0){
                        that.getListData();
                        that.$message.success(res.data.msg);
                    }else{
                        that.$message.error(res.data.msg);
                    }
                })
            }).catch(() => {});
        },
        // 编辑 添加
        editPage(item){
            this.$router.push({path: '/lego_add', query: {pageName: item.name, id: item.id}})
        },
        // 预览
        preview(item){
            let that = this;
            that.componentsList = eval ("("+ item.content +")");
            that.updateData({ showModal: false });
            that.showPreview = true;
        },
        // 关闭预览
        closePreview(){
            let that = this;
            that.showPreview = false;
            that.updateData({ showModal: false });
        },
        // 重命名
        rename(index, item){
            let that = this;
            that.reNameIndex  = index;
            that.reNameId     = item.id;
            that.reNameValue  = item.name;
            that.reNameSwitch = false;
            that.$nextTick(()=>{
                that.$refs['pName_'+index][0].select();
                // that.$refs['pName_'+index][0].focus();
                // that.po_Last(that.$refs['pName_'+index][0]);
            })
        },
        // 失焦提交数据
        renameEnterKeyUp(){
            let that = this;
            that.$refs['pName_'+that.reNameIndex][0].blur();
        },
        submitNameModify(){
            let that = this;
            if(that.reNameIndex || that.reNameIndex==0){
                if(that.reNameValue != that.listData[that.reNameIndex].name){
                    that.$confirm('是否保存重命名?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.axios.post('/v2/activity/diy/name/update', {
                            id  : that.reNameId,
                            name: that.reNameValue
                        }).then(res=>{
                            if(res.data && res.data.ret==0){
                                that.$set(that.listData[that.reNameIndex], 'name', that.reNameValue);
                                that.$message.success('操作成功!');
                            }else{
                                that.$message.error(res.data.msg);
                            }
                            resetName()
                        })
                    }).catch(() => {
                        resetName()
                    });
                }else{
                    resetName()
                }
            }
            function resetName(){
                that.reNameIndex  = null;
                that.reNameSwitch = true;
                that.reNameId     = '';
                that.reNameValue  = '';
            }
        },
        // 渠道链接===============================================
        channelLinks(item){
            let that = this;
            that.channelData.id = item.id;
            that.channelVisible = true;
        },
        // 页面分类
        pageClassify(item){
            let that = this;
            that.pageClassifyData.id = item.id;
            that.pageClassifyData.categoryList = item.categoryList;
            that.pageClassifyVisible = true;
        },
        // 添加-复制页面
        newPage(type, item={}){
            let that = this;
            that.addPageType = type;
            that.pageCopyId  = type=='copy'? item.id:'';
            that.pageName    = type=='copy'? `${item.name}-副本` :'';
            that.sortValue   = '';
            that.sortOptions = that.tabsData.filter(it=>it.id!=='0');
            that.newPageVisible = true;
        },
        submitNewPage(){
            let that = this;
            if(!that.pageName){
                that.$message.error('请输入页面名称');
                return false;
            }
            if(!that.sortValue){
                that.$message.error('请选择页面分类');
                return false;
            }

            that.newPageVisible = false
            that.addPage({
                id       : that.addPageType=='copy' ? that.pageCopyId : null, 
                name     : that.pageName, 
                categorys: that.sortValue.join(',')
            })
        },
        addPage({id,name,categorys}){
            let that = this;
            let reqUrl = id ? '/v2/activity/diy/copy' : '/v2/activity/diy/add';

            that.axios.post(reqUrl, {
                id        : id,
                name      : name,
                categorys : categorys,
            }).then(res=>{
                console.log(res)
                if(res.data && res.data.ret==0){
                    that.$message.success(`页面${id?'复制':'添加'}成功`);
                    if(id){         // 复制
                        that.getListData();
                    }else{          // 添加
                        that.$router.push({path: '/lego_add', query: {
                            id   : res.data.result.id,
                            sort : that.sortValue.join(','),
                            pageName: res.data.result.name,
                        }})
                    }
                }else{
                    that.$message.error(res.data.msg)
                }
            })
        },
        // 操作日志====================================================
        operateLog(item){
            let that = this;
            that.logQuery.id = item.id;
            that.getLogData().then(res=>{
                that.logVisible = true;
            })
        },
        getLogData(){
            let that = this;
            return new Promise((resolve, reject)=>{
                that.axios.get('/v2/operationLog/selectByList', {
                    params: {
                        operType : 5001,
                        bsId     : that.logQuery.id,
                        pageNo   : that.logQuery.pageNo,
                        pageSize : that.logQuery.pageSize,
                    }
                }).then(res=>{
                    if(res.data && res.data.ret==0){
                        that.logTotalNum = res.data.total;
                        that.logDatas    = res.data.rows;
                        that.logDatas.forEach(item=>{
                            item.createdTime = that.formatDate(new Date(item.createdDatetime), "yyyy-MM-dd hh:mm:ss")
                        })
                        resolve(that.logDatas)
                    }else{
                        that.$message.error(res.data.msg)
                    }
                })
            })
        },
        // 分页============================================
        handleSizeChange(val) {
            let that = this;
            that.pageNo = 1;
            that.pageSize = val;
            that.getListData()
        },
        handleCurrentChange(val) {
            let that = this;
            that.pageNo = val;
            that.getListData()
        },
        // 展开按钮控制=====================================
        spreadBtnControl(){
            let that = this;
            that.$nextTick(()=>{
                setTimeout(()=>{
                    that.showOpen = document.querySelector(".legoList .el-tabs .is-scrollable") && true;
                }, 100)
            })
        },
    },
    beforeRouteUpdate(to, from, next){
        to.path=='/lego_list' && this.getListData();
        next();
    },
    destroyed() {}, 
    watch: {
        tabsData: {
            handler(newVal){
                this.spreadBtnControl();
            },
            deep: true
        },
    },
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
    .legoList .logDialog .el-dialog .el-dialog__body .el-pagination{
        padding: 10px 0;
        text-align: right;
    }
    .nameAupdateTime .el-textarea textarea{padding: 4px 15px;}
</style>
<style lang='less' scoped>
    @import './legoList.less';
</style>