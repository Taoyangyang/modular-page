<template>
    <div class='settingSlot'>
        <p class="flex_between_v title">
            <slot name="dialogTitle">标题</slot>
            <i class="icon el-icon-close" @click="$emit('cancel')"></i>
        </p>
        <div class="content">
            <div class="hintTxt">
                <slot name="hint">
                    <p>说明<span style="color:red">*</span></p>
                    <p>此处为说明文本</p>
                </slot>
            </div>
            <slot name="mainContent"></slot>
        </div>
        <div class="footerBtns">
            <slot name="btns">
                <el-button size="small" @click="$emit('cancel')">关 闭</el-button>
                <el-button size="small" type="primary" @click="$emit('confirm')">确 定</el-button>
            </slot>
        </div>
    </div>
</template>

<script>

export default {
    components: {},
    data() {
        return {
            
        };
    },
    computed: {},
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        
    },
    watch: {},
}
</script>
<style lang='less' scoped>
    .settingSlot{
        padding: 12px 16px;
        width: 380px;
        .title{
            padding-bottom: 10px;
            font-size: 14px;
            height: 17px;
            line-height: 17px;
            color: #606266;
            border-bottom: 1px solid #E4E7ED;
            .icon{
                cursor: pointer;
                &:hover{
                    color: #409EFF;
                }
            }
        }
        .content{
            padding: 10px 0;
            max-height: 640px;
            overflow-y: auto;
            &::-webkit-scrollbar {/*滚动条整体样式*/
                width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 4px;
            }
            &::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background-color: #d6d6d6;
            }
            .hintTxt{
                margin-bottom: 20px;
                font-size: 14px;
                color: #606266;
                p{
                    line-height: 18px;
                }
            }
        }
        .footerBtns{
            text-align: right;
        }
    }
</style>