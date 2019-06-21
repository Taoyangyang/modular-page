import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { path:'*', redirect: '/lego_list' }, 
    { 
        path: '/lego_list',
        component: resolve => require(['@/components/component-library/pages/legoList/legoList.vue'], resolve),
        meta: { keepAlive: true },
        children: [{
            path: '/lego_module',
            component: resolve => require(['@/components/component-library/legoModule.vue'], resolve),
            meta: { keepAlive: true },
            children: [{
                path: '/lego_add',
                component: resolve => require(['@/components/component-library/pages/legoAdd/legoAdd.vue'], resolve),
                meta: { keepAlive: true },
            },{
                path: '/lego_backup',
                component: resolve => require(['@/components/component-library/pages/legoBackup/legoBackup.vue'], resolve),
                meta: { keepAlive: true },
            }]
        }] 
    },
  ]
})
