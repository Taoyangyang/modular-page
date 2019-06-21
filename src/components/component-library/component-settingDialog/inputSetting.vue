<template>
    <div class="inputSetting">
        <el-form :model="inputFormDatas">
            <el-form-item label="输入框的标签" label-width="120px">
                <el-input v-model="inputFormDatas.inputName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入框的占位符" label-width="120px">
                <el-input v-model="inputFormDatas.inputPlshd" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- <el-button type="danger" @click="delet">删除</el-button> -->
        </div>
        <!-- test -->
        <p style="display:none">{{getData}}</p>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            // inputFormDatas : {
            //     inputName   : "",
            //     inputPlshd  : "",
            // },
        };
    },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        ...mapState({
            inputFormDatas : state => state.inputFormDatas,				
        }),
        getData(){
            let that = this;
            // that.inputFormDatas = this.showData
            that.updateData({inputFormDatas: that.showData})
            return that.inputFormDatas;
        }
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.inputFormDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {}
};
</script>
<style lang='less' scoped>
    .inputSetting{
        text-align: center;
    }
</style>