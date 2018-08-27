/**
 * Created by Administrator on 2017/7/14.
 */
import axios from 'axios'
import auth from '@/assets/js/auth';
import { Toast } from 'mint-ui';
import store from 'store';
var config={
  method: 'get',
  baseURL:"http://wwjmall.artqiyi.com",
};


var httpAjax=axios.create(config);
/*
if(/artqiyi/.test(location.href)){
  httpAjax.defaults.headers.common["Authorization"]="Bearer "+store.get('apiToken');
}*/
httpAjax.defaults.headers.common["Authorization"]="Bearer "+store.get('apiToken');
httpAjax.interceptors.request.use((config)=>{
  if(config.headers.common. Authorization=="Bearer undefined"){
    config.headers.common. Authorization="Bearer "+store.get('apiToken');
  }
  return config;
},()=>{
  return config;
});
//返回状态判断// 添加响应拦截器
httpAjax.interceptors.response.use((res) =>{
  if((200 <= res.status && res.status < 300)&&res.status!=204){
    return res.data;
  }else if(res.status==401){
    //重新登录
    Toast({
      message: '登录超时，请重新登录',
      iconClass: 'mint-toast-icon mintui mintui-field-warning'
    });
  }else{
    Toast({
      message: res.data.message,
      iconClass: 'mint-toast-icon mintui mintui-field-error'
    });
    return Promise.reject(res.data);
  }
}, (error) => {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//接口列表
export default {
  fetch:(url,config)=> {
    return new Promise((resolve, reject) => {
      httpAjax(url,config)
        .then(response => {
          resolve(response);
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
