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