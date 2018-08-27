 import store from 'store';
import api from '@/assets/js/api';
export default{
  //转发分享
  wechatConfig:(item)=> {
    if (!(navigator.userAgent.indexOf('MicroMessenger') > -1)) return;
      var smData = {
        url:window.location.href,
      };
      api.fetch('/api/wechat/js', {params: smData}).then((res) => {
        store.set('isconfig',true)
         wx.config({
           debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
           appId: res.data.appId, // 必填，公众号的唯一标识
           timestamp: res.data.timestamp, // 必填，生成签名的时间戳
           nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
           signature: res.data.signature, // 必填，签名，见附录1
           url:res.data.url,
           jsApiList: [
             'onMenuShareTimeline',
             'onMenuShareAppMessage',
             'onMenuShareQQ',
             'onMenuShareWeibo',
             'onMenuShareQZone'
           ]
         });
        wx.error(function (res) {
          console.log(res);
        });
         wx.ready(() => {
           if(item=='hide'){
             wx.hideOptionMenu();
           }else {
             wx.showOptionMenu();
             var smConfig = {
               title: '云+物娱在线娃娃机',
               desc: '来抓娃啦！抓到免费包邮到家，机不可失，云+物娱在线娃娃机全网体验最佳',
               link: window.location.href,
               imgUrl: 'http://testdoll.artqiyi.com/data_focus/device/device_Z3B3KRNsRpuHD3h27T8qQy/201712051756462826.png',
               //imgUrl: window.location.host + 'src/assets/images/share.jpg',
               success: function () {
                 // 用户确认分享后执行的回调函数
               },
               cancel: function () {
                 // 用户取消分享后执行的回调函数
               }
             };
             //分享给朋友
             wx.onMenuShareTimeline(smConfig);
             //分享到好友
             wx.onMenuShareAppMessage(smConfig);
           }
         });

      });

  },
};

