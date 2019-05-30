import Vue from 'vue';
import Vuex from 'vuex';

/*模块*/
// import INPUT from 'store/modules/input.js';
// import IMAGE from 'store/modules/image.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 页面
        componentsList  : [],
        clickComIndex   : null,           //当前点击的组件下标
        // input组件
        inputVal        : '',
        inputFormDatas  : {
            inputName  : "",
            inputPlshd : "",
        },
        // 图片组件
        
        // 轮播组件
        // carouselFormItem: {
        //     carouselImages : [
        //         {img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg', id: Math.random()},
        //         {img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg', id: Math.random()},
        //     ],
        //     carouselHeight : 150,
        //     autoplay       : true,
        //     interval       : 2000
        // }
        // 弹窗遮层
        showModal    : false,
    },
    mutations: {
        updateData(state, payload) {
            Object.assign(state, payload);
        }
    },
    actions: {

    },
    // modules: { INPUT, IMAGE }
})