<template>
  <div class="user-center">
    <div class="user-detail flex">
      <img :src="itemList.avatar" class="user-img">
      <div class="user-profile">
        <p class="user-name">{{itemList.nickname}}</p>
        <p class="user-id">ID：{{itemList.id}}</p>
      </div>
    </div>
    <div class="operate-panel">
      <router-link class="operate-item flex" to="/user-center/account">
        <div class="flex">
          <img src="../../assets/images/account.png">我的娃娃币
        </div>
      </router-link>
      <router-link class="operate-item flex" to="/user-center/consume">
        <div class="flex">
          <img src="../../assets/images/consume.png">我的抓取记录
        </div>
      </router-link>
      <router-link class="operate-item flex" to="/order-list">
        <div class="flex">
          <img src="../../assets/images/order.png">我的订单
        </div>
      </router-link>
      <router-link class="operate-item flex" to="/address-list">
        <div class="flex">
          <img src="../../assets/images/address.png">我的收货地址
        </div>
      </router-link>
      <div class="operate-item flex">
        <div class="flex"><img src="../../assets/images/service.png">客服</div>
        <a class="tel" href="tel:13228524101" style="color:#0096ff;">13228524101</a>
      </div>
    </div>
    <foot :selected="3"></foot>
  </div>
</template>
<script>
import foot from '@/components/tabfoot';
import api from '@/assets/js/api';
export default {
  data: function() {
    return {
      itemList: [],
      show_rule: false,
      statusBgColor: "#71C671",
    }
  },
  components: {
    'foot': foot,
  },
  created: function() {
    auth.wechatConfig('hide');
    api.fetch('/api/account').then((res) => {
      console.log(res);
      this.itemList = res.data;
    })
  },
  methods: {
  },
}

</script>
<style scoped lang="less">
.user-center {
  .user-detail {
    background: #ec6564;
    height: 2rem;
    padding: .5rem .3rem;
    .user-img {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: .03rem solid #c72626;
    }
    .user-profile {
      margin-left: .3rem;
      font-size: .24rem;
      flex-direction: column;
      color: #fff;
      .user-name {
        font-size: .32rem;
        margin-bottom: .08rem;
      }
    }
  }
  .operate-panel {
    .operate-item {
      height: .88rem;
      line-height: .88rem;
      padding: 0 .3rem;
      background: #fff;
      font-size: .32rem;
      color: #545458;
      position: relative;
      border-bottom: .01rem solid #eee;
      justify-content: space-between;
      img {
        vertical-align: middle;
        width: .4rem;
        height: .4rem;
        margin-right: .2rem;
      }
      .tel {
        margin-right: .2rem;
        color: #666;
        font-size: .28rem;
      }
      &:after {
        content: '';
        position: absolute;
        width: .24rem;
        height: .24rem;
        border-top: .03rem solid #ccc;
        right: .3rem;
        border-right: .03rem solid #ccc;
        top: 50%;
        transform: rotate(45deg) translate(-50%, -50%);
      }
    }
  }
}

</style>
