<template>
  <div class="delivery">
    <div class="top">
      <p>订单编号：{{info.shipping_no}}</p>
    </div>
    <ul class="content">
      <li class="list" v-for="(item, index) in delivery.data" :key="index">
        <div class="sign">
          <div></div>
          <img v-if="index === 0" src="../../assets/images/log1.png" alt="">
          <img src="../../assets/images/delivery.png" alt="" v-else>
          <div></div>
        </div>
        <div class="detail">
          <span>{{item.context}}</span>
          <p>{{item.time}}</p>
        </div>
      </li>
      <li class="noaddress" v-if="delivery.state==0">
        暂时还没有记录！
      </li>
    </ul>
  </div>
</template>
<script>
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import {Toast} from 'mint-ui';
  import store from 'store';

  export default {
    data() {
      return {
        orderId: this.$route.query.id,
        info: {},
        delivery: {},
      }
    },
    created() {
      auth.wechatConfig('hide');
      this.getDeliveryInfo();
    },
    methods: {
      getDeliveryInfo() {
        api.fetch('/api/orders/'+this.orderId+'/logistics').then((res) => {
          console.log(res);
          this.info = res.data;
          this.delivery = res.data.logistics;
          this.orderSn = res.data.order_id;
        });
      }
    }
  };
</script>
<style scoped>
  .top {
    height: 0.84rem;
    line-height: 0.84rem;
    color: #626567;
    font-size: 0.3rem;
    background: #fff;
    padding-left: 0.24rem;
    padding-right: 0.24rem;
    width: 100%;
    box-sizing: border-box;
  }

  .content {
    margin-top: 0.2rem;
    padding-left: 0.24rem;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
  }

  .content .list {
    display: flex;
  }

  .content .list .sign {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .content .list:first-child .sign img {
    width: 0.38rem;
    height: 0.38rem;
  }

  .content .list:first-child .sign {
    position: relative;
    left: -0.12rem;
  }

  .content .list:first-child .detail span {
    color: #ec6564;
    font-size: 0.28rem;
  }

  .content .list .sign img {
    width: 0.15rem;
    height: 0.15rem;
  }

  .content .list .sign div {
    width: 1px;
    background: #ddd;
    flex: 1;
    height: 100%;
  }

  .content .list:first-child .sign div:first-child {
    background: transparent;
  }

  .content .list:last-child .sign div:last-child {
    background: transparent;
  }

  .list .detail {
    padding: 0.3rem 0.24rem 0.3rem 0rem;
    margin-left: 0.45rem;
    border-bottom: 1px solid #ccc;
    color: #949699;
    flex: 1;
  }

  .list:last-child .detail {
    border-bottom: 0px;
  }

  .detail p {
    font-size: 0.26rem;
    line-height: 1.8;
  }

  .detail span {
    font-size: 0.28rem;
    line-height: 1.8;
  }
</style>
