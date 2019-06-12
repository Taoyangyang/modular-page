<template>
    <div class="gridComponent">
        <div class="gridBox">
            <div v-for="(item, index) in setData.itemArray" :key="index" class="girdItem" 
                :style="girdItemStyle"
            >
                <img :src="item.imgUrl" alt="">
                <p v-if="setData.hasText">{{item.text}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState , mapGetters , mapMutations , mapActions } from 'vuex';
export default {
    components: {},
    data() {
        return {

        };
    },
    props: {
        setData:{
            type: Object,
            default: ()=> {}
        },
    },
    computed: {
        girdItemStyle(){
            let that = this;
            return {
                width  : 'calc('+100/that.setData.perRowNum+'% - 8px)',
                height : that.setData.perItemHieght!=0 ? `${that.setData.perItemHieght}px`:'',
                flexWrap : that.setData.perRowNum==1 ? 'nowrap':'wrap'
            }
        }
    },
};
</script>
<style lang='less' scoped>
    .gridComponent{
        width: 100%;
        .gridBox{
            margin-bottom:-1px;
            text-align: left;
            .girdItem{
                display: inline-block;
                padding: 8px 3px;
                border: 1px solid #ccc;
                margin:0px -1px -1px 0px;
                text-align: center;
                img{
                    display: inline-block;
                    width: 80%;
                }
                p{
                    margin: 2px 0;
                    width: 100%;
                    height: 20px;
                    line-height: 20px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    font-size: 14px;
                    text-align: center;
                }

            }
        }
    }
</style>