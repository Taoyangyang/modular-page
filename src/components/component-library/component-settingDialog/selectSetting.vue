<template>
    <div class="selectSetting">
        <el-form label-position="right" label-width="100px" :model="selectFormItem">
            <el-form-item label="占位文字">
                <el-input v-model="selectFormItem.placeholder" maxlength="20" placeholder="请输入占位文字"></el-input>
            </el-form-item>
            <el-form-item label="选择框尺寸">
                <el-select v-model="selectFormItem.selectSize" placeholder="请选择尺寸">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <!-- <el-button type="danger" @click="delet">删除</el-button> -->
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            selectFormItem: {
                placeholder: '',
                selectSize : 'medium',
            },
            options       : [
                {value: 'medium', label: '普通'},
                {value: 'small',  label: '中型'},
                {value: 'mini',   label: '小型'},
            ]
        };
    },
    props: {
        showData:{
            type: Object,
            default: ()=> {}
        },
    },
    mounted(){
        let that = this;
        that.selectFormItem = that.showData ? that.showData : that.selectFormItem;
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.selectFormItem)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        showData: {
            handler(newVal, oldVal) {
                this.selectFormItem = newVal;
    　　　　},
    　　　　deep: true
        },
    }
};
</script>
<style lang='less' scoped>
    .selectSetting{
        text-align: center;
    }
</style>