<template>
    <div class="inputSetting">
        <el-form :model="formDatas">
            <el-form-item label="输入框的标签" :label-width="formLabelWidth">
                <el-input v-model="formDatas.inputName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入框的占位符" :label-width="formLabelWidth">
                <el-input v-model="formDatas.inputPlshd" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button type="danger" @click="delet">删除</el-button>
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
            // formDatas : {
            //     inputName   : "",
            //     inputPlshd  : "",
            // },
            formLabelWidth: "120px"
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
            formDatas : state => state.formDatas,				
        }),
        getData(){
            let that = this;
            // that.formDatas = this.showData
            that.updateData({formDatas: that.showData})
            return that.formDatas;
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
            this.$emit('confirm', this.formDatas)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {}
};
</script>
<style lang='less' scoped>
</style>