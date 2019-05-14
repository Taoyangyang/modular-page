<template>
    <div class="carouselSetting">
        <el-form label-position="right" label-width="80px" :model="carouselFormItem">
            <el-form-item label="高度">
                <el-input v-model="carouselFormItem.carouselHeight" placeholder="请输入高度"></el-input>
            </el-form-item>
            <el-form-item label="图片数量">
                <el-input v-model="carouselImagesLen" placeholder="请输入轮播图片数量"></el-input>
            </el-form-item>
            <el-form-item label="自动切换">
                <el-col :span="8">
                    <el-switch v-model="carouselFormItem.autoplay"></el-switch>
                </el-col>
                <el-col :span="16">
                    <el-input v-model.number="carouselFormItem.interval" :disabled="!carouselFormItem.autoplay" placeholder="切换间隔(毫秒数)"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button type="danger" @click="delet">删除</el-button>
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {
            carouselImagesLen: 0,
            carouselFormItem : {
                carouselImages : [
                    {img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', id: Math.random()},
                    {img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', id: Math.random()},
                ],
                carouselHeight : 150,
                autoplay       : true,
                interval       : 2000
            }
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
        if(that.showData.carouselImages){
            that.update(that.showData)
        }else{
            that.update(that.carouselFormItem)
        }
    },
    methods: {
        ...mapMutations([
            'updateData'
        ]),
        update(newVal){
            let that = this, carousImgs;
            that.carouselFormItem  = newVal;
            carousImgs = newVal.carouselImages;
            that.carouselImagesLen = carousImgs ? (carousImgs.length).toString() : 0;
        },
        cancel(){
            this.$emit('cancel')
        },
        confirm(){
            this.$emit('confirm', this.carouselFormItem)
        },
        delet(){
            this.$emit('delete')
        }
    },
    watch: {
        carouselImagesLen(newVal, oldVal){
            let that = this;
            let imagesNum = newVal;
            if(imagesNum){
                that.carouselImagesLen = (imagesNum.match(/^\d*/g)[0]) || null;
                if(imagesNum>10){
                    imagesNum = that.carouselImagesLen = '10'
                }
                that.carouselFormItem.carouselImages = [];
                for(let i=0; i<imagesNum; i++){
                    that.carouselFormItem.carouselImages.push({
                        img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',   
                        id : Math.random()
                    })
                }
            }
        },
        'carouselFormItem.carouselHeight':{
            handler(newVal, oldVal) {
                if(newVal){
                    this.$set(this.carouselFormItem, 'carouselHeight', (newVal.match(/^\d*/g)[0])||0)
                }
            }
        },
        showData(newVal, oldVal){
            this.update(newVal)
        }
    }
};
</script>
<style lang='less' scoped>
</style>