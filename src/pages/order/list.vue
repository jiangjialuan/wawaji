<template>
  <div class="v-order-list">
    <nav>
      <div class="nav-item"><a href="javascript:;" :class="{active: status == 0}" @click="checkOrderList(0)">全部</a>
      </div>
      <div class="nav-item"><a href="javascript:;" :class="{active: status == 100}" @click="checkOrderList(100)">待发货</a>
      </div>
      <div class="nav-item"><a href="javascript:;" :class="{active: status == 200}" @click="checkOrderList(200)">已发货</a>
      </div>
      <div class="nav-item"><a href="javascript:;" :class="{active: status == 1000}"
                               @click="checkOrderList(1000)">已完成</a>
      </div>
    </nav>
    <ul class="content" v-infinite-scroll="getOrderList" infinite-scroll-disabled="nonext" infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
      <li class="list" v-for="(item, index) in orders" :key="index" :id="item.id">
        <div class="top">
          <div class="time">{{item.created_at}}</div>
          <div class="t_status" :class="{high: item.status == 100}">{{setStatus(item.status)}}</div>
        </div>
        <main :class="{last: i === item.wares.length - 1}" v-for="(good, i) in item.wares" :key="i" :id="good.ware_id">
          <img :src="good.image">
          <div class="right">
            <p>{{good.name}}</p>
            <p class="total">共{{good.num}}件商品</p>
          </div>
        </main>
        <div class="down">
          <router-link class="btn" :to="'/delivery?id=' + item.id" v-if="item.status==200">订单跟踪</router-link>
          <router-link class="btn" :to="'/order-detail?id=' + item.id">订单详情</router-link>
          <div class="btn" @click="delOrder(item.id,index)" v-if="item.status==1000">删除订单</div>
          <div class="btn comfirm" @click="comfirmOrder(item.id,index)" v-if="item.status==200">确认收货</div>
        </div>
      </li>
      <li class="noaddress" v-if="orders.length==0">
        暂时还没有记录！
      </li>
    </ul>
    <div class="order_hint_box">
      <div class="order_hint_content">
        <div class="order_hint_background">
          <div class="order_hint_tit"></div>
        </div>
      </div>
    </div>
    <!--<div class="loadmore" v-if="page < total" @click="loadMore">加载更多</div>-->
  </div>
</template>
<script>
  import {Indicator} from 'mint-ui';
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import {Toast} from 'mint-ui';
  import {InfiniteScroll} from 'mint-ui';
  import store from 'store';
  import data from '@/util/mock'

  export default {
    data() {
      return {
        status: 0,
        orders: [],
        page: 1,
        total: 0,
        nonext: false
      };
    },
    created() {
      auth.wechatConfig('hide');
      this.getOrderList(0);
    },
    components: {
      'Indicator': Indicator,
    },
    methods: {
      getOrderList(status) {
        Indicator.open('加载中...');
        if (this.page == 1) {
          this.orders = [];
          this.nonext = false;
        }
        var smData = {
          status: this.status,
          page: this.page,
        };
        api.fetch('/api/orders',{params: smData}).then((res)=>{
          if (res.meta.pagination.count > 0) {
            if (res.meta.pagination.per_page > res.meta.pagination.count) {
              this.nonext = true;
            }
            if (this.orders.length == 0) {
              this.orders = res.data;
              this.page = this.page + 1;
            } else {
              this.orders = this.list.concat(res.data);
              this.page = this.page + 1;
            }
          }
          Indicator.close();
        }).catch();
      },
      checkOrderList(status) {
        this.status = status;
        this.page = 1;
        this.getOrderList(status);
      },
      setStatus(status) {
        let statusText = "";
        switch (status) {
          case "100":
            statusText = "待发货";
            break;
          case "200":
            statusText = "已发货";
            break;
          case "1000":
            statusText = "已完成";
        }
        return statusText;
      },
      comfirmOrder(id, index) {
        api.fetch('/api/orders/'+id+'/confirm', {
          method: 'post',
          data: {
            _method: 'put',
          }
        }).then((res) => {
          Toast({
            message: '收货完成！',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          this.orders[index].status='1000';
        }).catch();
      },
      delOrder(id, index) {
        api.fetch('/api/orders/' + id, {
          method: 'post',
          data: {
            _method: 'delete',
          }
        }).then((res) => {
          Toast({
            message: '删除成功！',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
          this.orders.splice(index,1);
        }).catch();
      }
    }
  };

</script>
<style scoped lang="less">
  .v-order-list {
    .noaddress {
      text-align: center;
      height: 1rem;
      line-height: 1rem;
      background: #f4f5f5;
    }
    nav {
      height: 0.84rem;
      .nav-item {
        font-size: 0.28rem;
        color: #686868;
        &.active {
          color: #ec6564;
        }
      }
    }
    .content {
      padding-top: 0.18rem;
      .list {
        background: #fff;
        padding-left: 0.2rem;
        margin-bottom: 0.18rem;
        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 0.76rem;
          padding-right: 0.2rem;
          .time {
            font-size: 0.28rem;
            color: #686868;
          }
          .t_status {
            font-size: 0.28rem;
            color: #a5a5a5;
            &.high {
              color: #ec6564;
            }
          }
        }
        main {
          padding: 0.2rem 0.2rem 0.2rem 0.12rem;
          display: flex;
          justify-content: flex-start;
          border-bottom: 0.01rem solid #e3e5e9;
          img {
            width: 1.4rem;
            height: 1.4rem;
            margin-right: 0.3rem;
          }
          .right {
            width: 5.26rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            height: 1.4rem;
            padding: 0.2rem 0rem;
            p {
              height: 0.5rem;
              font-size: 0.3rem;
              color: #000;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            p.total {
              font-size: 0.24rem;
              color: #858585;
            }
          }
        }
        .down {
          display: flex;
          justify-content: flex-end;
          padding: 0.13rem 0rem 0.13rem 0rem;
          hegiht: 0.8rem;
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
            &.comfirm {
              background: #ec6564;
              border: 0.01rem solid #ec6564;
              color: #fff;
            }
          }
        }
      }
    }

    .order_hint_box {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 9998;
      transition: all 0.3s ease;
    }

    .order_hint_content {
      display: table-cell;
      vertical-align: middle;
    }

    .order_hint_content .order_hint_background {
      margin: 0 auto;
      width: 60%;
      background-color: #2d2c2c;
      border-radius: 0.06rem;
      overflow: hidden;
      color: #fff;
      z-index: 100;
    }

    .order_hint_content .order_hint_background .order_hint_tit {
      font-size: 0.3rem;
      padding: 0.4rem 0;
      text-align: center;
    }

    .loadmore {
      height: 0.8rem;
      text-align: center;
      line-height: 0.8rem;
    }
  }
</style>
