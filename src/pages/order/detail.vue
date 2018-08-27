<template>
  <div class="v-order-detail">
    <div class="log_detail">
      <div class="top">
        <img src="../../assets/images/ordericon.png" alt="">
        <p>{{setStatus(info.status)}}</p>
        <div class="log" v-if="info.status != 100">
          <router-link :to="'/delivery?id=' + info.id">
            <p>物流信息</p>
            <img src="../../assets/images/right.png" alt="">
          </router-link>
        </div>
        <span v-if="info.status != 20">下单时间：{{info.created_at}}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="icon"><img src="../../assets/images/addresslows.png" alt=""></div>
      <div class="detail">
        <p><label>{{info.extension.consignee}}</label><label>{{info.extension.phone}}</label></p>
        <p>
          地址：{{info.extension.province_id}}{{info.extension.city_id}}{{info.extension.district_id}}{{info.extension.address}}</p>
      </div>
    </div>
    <div class="content">
      <div class="list" :class="{last: index === info.ware - 1 }" v-for="(item, index) in info.ware" :key="index">
        <img :src="item.image" alt="">
        <div class="right">
          <p>{{item.name}}</p>
          <p class="total">共{{item.num}}件商品</p>
        </div>
        <div class="btn"><a href="tel:020-29177216">联系客服</a></div>
      </div>
      <div class=" bottoms">
        <p>订单编号：{{info.order_sn}}</p>
        <p>下单时间：{{info.created_at}}</p>
        <p>快递公司：{{info.extension.shipping_name}}</p>
        <p>快递单号：{{info.extension.shipping_no}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import {Toast} from 'mint-ui';
  import store from 'store';
  import data from '@/util/mock'

  export default {
    data() {
      return {
        orderId: this.$route.query.id,
        info: {
          extension: {}
        }
      };
    },
    created() {
      auth.wechatConfig('hide');
      this.getOrderDetail();
    },
    methods: {
      getOrderDetail() {
        api.fetch('/api/orders/'+this.orderId,{}).then((res)=>{
          this.info = res.data;
        }).catch();
      },
      setStatus(status) {
        let statusText = "";
        switch (status) {
          case '100':
            statusText = "待发货";
            break;
          case '200':
            statusText = "待收货";
            break;
          case '1000':
            statusText = "已完成";
        }
        return statusText;
      },
    }
  };
</script>
<style scoped lang="less">
  .v-order-detail {

    .log_detail {
      margin-bottom: 0.18rem;
      padding-left: 0.2rem;
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      position: relative;
    }
    .log_detail .top {
      padding: 0.2rem 0.3rem 0.2rem 0rem;
      color: #626567;
    }
    .log_detail .top p {
      font-size: 0.3rem;
      line-height: 1.5;
      display: inline-block;
      color: #ec6564;
    }
    .log_detail .top .log {
      padding-left: 0.4rem;
      position: relative;
    }
    .log_detail .top .log p {
      line-height: 0.48rem;
      color: #000;
      font-size: 0.28rem;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      width: 90%;
      vertical-align: middle;
    }
    .log_detail .top .log img {
      width: 0.2rem;
      height: 0.3rem;
      display: inline-block;
      position: absolute;
      margin-right: 0.1rem;
      top: 45%;
      right: 0rem;
    }
    .log_detail .top span {
      font-size: 0.26rem;
      line-height: 0.5rem;
      display: block;
      color: #949699;
      padding-left: 0.4rem;
    }
    .log_detail .top img {
      width: 0.3rem;
      height: 0.3rem;
      display: inline-block;
      vertical-align: middle;
    }
    .bottom {
      margin-bottom: 0.18rem;
      padding: 0.2rem 0.3rem 0.2rem 0.2rem;
      line-height: 1.6;
      color: #626567;
      font-size: 0.26rem;
      background: #fff;
      display: flex;
      flex-direction: row;
      .icon {
        width: 0.22rem;
        height: 0.28rem;
        margin-right: 0.2rem;
        display: flex;
        align-items: center;
        padding-top: 0.15rem;
      }
    }
    .bottom img {
      width: 0.22rem;
      height: 0.28rem;
      position: relative;

    }
    .bottom p:first-child {
      color: #000;
      font-size: 0.3rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      label:first-child {
        margin-right: 0.3rem;
      }
    }
    .bottom div {
      display: inline-block;
      width: 89%;
    }
    .content {
      width: 100%;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      overflow: hidden;
      margin-top: 0.2rem;
      padding-left: 0.2rem;
      background: #fff;
      .list {
        padding: 0.2rem 0.2rem 0.2rem 0.12rem;
        border-bottom: 0.01rem solid #e3e5e9;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        img {
          width: 1.4rem;
          height: 1.4rem;
          margin-right: 0.3rem;
        }
        .right {
          width: 3.7rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 1.4rem;
          padding: 0.2rem 0rem;
          p {
            height: 0.5rem;
            font-size: 0.3rem;
            color: #000;
          }
          p.total {
            font-size: 0.24rem;
            color: #858585;
          }
        }
        .btn {
          width: 1.5rem;
          height: 0.54rem;
          border-radius: 0.7rem;
          color: #3d4244;
          font-size: 0.26rem;
          border: 0.01rem solid #9d9d9d;
          text-align: center;
          line-height: 0.54rem;
          margin-right: 0.2rem;
        }
      }
    }

    .content .bottoms {
      height: auto !important;
      position: relative;
      color: #949699;
      line-height: 1.6rem;
      padding: 0.2rem 0.2rem 0.2rem 0rem;

    }
    .content .bottoms p {
      line-height: 1.8;
      font-size: 0.26rem;
    }
  }
</style>
