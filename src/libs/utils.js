import Vue from 'vue'
import axios from 'axios';

Vue.prototype.dataInterchange = function(arr, index1, index2){
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}
Vue.prototype.IsEmptyObj = function(data){
    if(Object.prototype.toString.call(data).includes("Object")){
        return Object.keys(data).length==0 || false;
    }else{
        throw new Error("data is not Object !")
    }
}
Vue.prototype.deepCopy = function (origin, copyObj){
	copyObj = copyObj || {}; 
	for(let key in origin){
		if(origin.hasOwnProperty(key)){
			let keyIsObj = Object.prototype.toString.call(origin[key])=='[object Object]'
			if(keyIsObj){
				copyObj[key] = (origin[key].constructor===Array)?[]:{};
				deepCopy(origin[key], copyObj[key])
			}else{
				copyObj[key] = origin[key]
			}
		}
	}
	return copyObj
}
Vue.prototype.axios = (() => {
    const instance = axios.create({
        timeout: 60000 * 10, // 设置10分钟为超时
        headers: {'Cache-Control': 'no-cache, must-revalidate','If-Modified-Since': '0','Pragma':'No-cache'}
    });

    // 设置请求拦截器
    instance.interceptors.request.use(config => {
        // 开发环境 加上请求头测试字段 testLoginToken
        const token = localStorage.getItem('goujia-ges-token');
        if (token) {
            config.headers['testLoginToken'] = token;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // 设置响应拦截器
    instance.interceptors.response.use(res => {
        return res;
    }, error => {
        return Promise.reject(error);
    });

    // 返回自定义实例
    return instance;
})();