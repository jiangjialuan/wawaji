import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';


Vue.use(Mint);
Vue.use(Toast, {
  defaultType: 'center',
  duration: 2000,
  wordWrap: false,
  width: '150px'
});
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})

//ajax默认配置
axios.defaults.baseURL = "http://testdoll.artqiyi.com/";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


//响应拦截器
axios.interceptors.response.use((res) => {
  console.log(res);
  if (res.data.code === 10401) {
    router.push({path: '/login', query: {currentUrl: router.currentRoute.fullPath}})
  }
  return res
}, (err) => {
  return Promise.reject(err)
});

Vue.prototype.$http = axios;

