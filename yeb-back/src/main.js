import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "@/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css'

import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from "@/utils/download";

Vue.config.productionTip = false
Vue.use(ElementUI);
//插件形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

router.beforeEach((to, from, next) => {
    if (window.sessionStorage.getItem('tokenStr')) {
        initMenu(router, store);
        if (!window.sessionStorage.getItem('user')) {
            //判断用户信息是否存在
            return getRequest('/admin/info').then(resp => {
                if (resp) {
                    //存入用户信息
                    window.sessionStorage.setItem('user', JSON.stringify(resp));
                    next();
                }
            })
        }
        next();
    } else {
        if (to.path == '/') {
            next();
        } else {
            next('/?redirect=' + to.path)
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
