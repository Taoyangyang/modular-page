import Vue from 'vue';
import Vuex from 'vuex';

/*模块*/
import INPUT from 'store/modules/input.js';
import IMAGE from 'store/modules/image.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        INPUT,
        IMAGE
    }
})