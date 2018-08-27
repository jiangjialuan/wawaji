import Vue from 'vue'
import Router from 'vue-router'
import store from 'store';
import api from '@/assets/js/api'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    meta: {
      title: '奇艺果娃娃机'
    },
    component: function (resolve) {
      require(['@/pages/index'], resolve)
    }
  },
    {
      path: '/room/:device_id',
      meta: {
        title: '奇艺果娃娃机'
      },
      component: function (resolve) {
        require(['@/pages/room'], resolve)
      },
    },
    {
      path: '/order-list',
      meta: {
        title: '我的订单'
      },
      component: function (resolve) {
        require(['@/pages/order/list'], resolve)
      }
    },
    {
      path: '/order-detail',
      meta: {
        title: '订单详情'
      },
      component: function (resolve) {
        require(['@/pages/order/detail'], resolve)
      }
    },
    {
      path: '/delivery',
      meta: {
        title: '订单跟踪'
      },
      component: function (resolve) {
        require(['@/pages/order/delivery'], resolve)
      }
    },
    {
      path: '/user-center',
      meta: {
        title: '个人中心'
      },
      component: function (resolve) {
        require(['@/pages/user-center/index'], resolve)
      }
    }, {
      path: '/user-center/account',
      name: '/user-center/account',
      meta: {
        title: '我的娃娃币'
      },
      component: function (resolve) {
        require(['@/pages/user-center/account'], resolve)
      }
    }, {
      path: '/user-center/consume',
      name: '/user-center/consume',
      meta: {
        title: '我的抓取记录'
      },
      component: function (resolve) {
        require(['@/pages/user-center/consume'], resolve)
      }
    },
    {
      path: '/mywawa',
      meta: {
        title: '我的娃娃'
      },
      component: function (resolve) {
        require(['@/pages/mywawa/my.vue'], resolve)
      }
    },
    {
      path: '/address-list',
      meta: {
        title: '我的收货地址'
      },
      component: function (resolve) {
        require(['@/pages/address/list.vue'], resolve)
      }
    },
    {
      path: '/add-address',
      meta: {
        title: '新增地址'
      },
      component: function (resolve) {
        require(['@/pages/address/add.vue'], resolve)
      }
    },
  ]
});
router.beforeEach((to, from, next) => {
  if (to.query.api_token != '' && to.query.api_token != undefined) {
    store.set('apiToken', to.query.api_token)
  }
  if (store.get('apiToken') == undefined || store.get('apiToken') == '') {
    window.location.href = 'http://wwjmall.artqiyi.com/api/wechat/oauth?redirect_uri=' + window.location.href;
  } else {
    api.fetch('/api/account', {
      headers: {'Authorization': "Bearer " + store.get('apiToken')}
    }).then((res) => {
      if (!res.data.nickname) {
        store.remove('apiToken');
      } else {
        if (res.data.nickname != store.get('username')) {
          store.set('username', res.data.nickname);
          store.set('userid', res.data.id);
          store.set('avatar', res.data.avatar);
          store.set('live_openid', res.data.live_openid);
          store.set('qcloud_user_sig', res.data.qcloud_user_sig);
        }
      }
    });
  }
  window.document.title = to.meta.title;
  next()

});

export default router;
