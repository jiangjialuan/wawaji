<template>
  <div class="account">
    <div class="remain-coin flex">
      <p class="tips">余额</p>
      <p class="coin-count"><label><i>{{total_money}}</i>币</label><label @click="goCoins()">充值</label></p>
    </div>
    <div class="consume-list" v-infinite-scroll="getlist" infinite-scroll-disabled="nonext" infinite-scroll-distance="10"
         infinite-scroll-immediate-check="false">
      <div class="consume-item flex" v-for="(item,index) in list" :key="index">
        <div>
          <p class="content" v-if="item.recordable_type=='game_record'&&item.coin>0">游戏赚取：{{item.coin}}</p>
          <p class="content" v-if="item.recordable_type=='game_record'&&item.coin<0">游戏消费：{{item.coin}}</p>
          <p class="content" v-if="item.recordable_type=='payment'">手机充值：{{item.coin}}</p>
          <p class="date">{{item.created_at}}</p>
        </div>
        <div class="sum sup" v-if="item.coin>0">+{{item.coin}}</div>
        <div class="sum sub" v-if="item.coin<0">-{{item.coin}}</div>
      </div>
      <div class="noaddress" v-if="list.length==0">
        暂时还没有充值记录！
      </div>
    </div>
    <recharge :show-recharge="showRecharge" v-on:cancel="hiderechare"></recharge>
  </div>
</template>
<script>
  import {InfiniteScroll} from 'mint-ui';
  import api from '@/assets/js/api';
  import mock from '@/util/mock';
  import recharge from '@/components/recharge';
export default {
  data: function() {
    return {
      list: [],
      show_rule: false,
      statusBgColor: "#71C671",
      page:1,
      nonext:false,
      total_money:'',
      showRecharge: false
    }
  },
  components: {
    recharge
  },
  created: function() {
    auth.wechatConfig('hide');
    this.getlist();
    api.fetch('/api/account').then((res) => {
      console.log(res);
      this.total_money = res.data.coin;
    })
  },
  methods: {
    hiderechare:function(item){
      this.showRecharge=false;
      if(item){
        window.location.reload();
      }
    },
    goCoins:function(){
      this.showRecharge = true;
    },
    getlist:function(){
      var smData={
        page:this.page,
        per_page:15,
      }
      api.fetch('api/coin-records',{params: smData}).then((res) => {
      //api.fetch('http://jjl.cn/').then((res) => {
        if (res.meta.pagination.count > 0) {
          if (res.meta.pagination.per_page > res.meta.pagination.count) {
            this.nonext = true;
          }
          if (this.list.length == 0) {
            this.list = res.data;
            this.page = this.page + 1;
          } else {
            this.list = this.list.concat(res.data);
            this.page = this.page + 1;
          }
        }
      });
    }
  }
}

</script>
<style scoped lang="less">
.account {
  .noaddress {
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    background: #f4f5f5;
  }
  .remain-coin {
    text-align: center;
    font-size: .24rem;
    height: 2rem;
    color: #999;
    background: #fefefe;
    justify-content: center;
    flex-direction: column;
    .coin-count {
      label:first-child{
        margin-right:0.3rem;
      }
      label:last-child{
        color:#0096ff;
      }
      i {
        font-size: .56rem;
        margin: 0 .06rem;
        font-weight: 600;
      }
      margin-top:.12rem;
      color:#ec6564;
    }
  }
  .consume-list {
    .consume-item {
      justify-content: space-between;
      padding: .12rem .2rem;
      background: #fff;
      border-top: .01rem solid #eee;
      .content {
        font-size: .3rem;
        color: #333;
        margin: .12rem 0;
      }
      .date {
        font-size: .12rem;
        color: #999;
      }
      .sum {
        font-size: .3rem;
      }
      .sup {
        color: #ec6564;
      }
      .sub {
        color: green;
      }
    }
  }
}

</style>
