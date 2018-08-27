<template>
  <div class="recharge-pop" v-show="showRecharge">
    <div class="content">
      <div class="title">充娃娃币</div>
      <div class="recharge-list">
        <div class="recharge-item flex" v-for="(item,index) in list" :key="index">
          <div class="recharge-sum flex">
            <div class="clearfix">
              <p class="sum">{{item.coin}}</p>
            </div>
          </div>
          <div class="buy-btn" @click="recharge(item.id)">
            <div class="sum">￥{{item.money}}</div>
            <img src="../assets/images/buy-btn.png">
          </div>
        </div>
      </div>
      <div class="cancel-btn" @click="hide">
        取消
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/assets/js/api';
  import mock from '@/util/mock';
  import {Toast} from 'mint-ui';
  export default {
    data() {
      return {
        show: this.showRecharge,
        list:[],
        interval:'',
      }
    },
    props: ['showRecharge'],
    created:function(){
      this.getlistCoin();
    },
    methods: {
      recharge(id){
        console.log(id);
        api.fetch('/api/payments',{
          method:'post',
          data:{
            coin_id:id,
          }
        }).then((res) => {
          console.log(res);
          if(res.data.trade_no){
            this.interval=setInterval(this.payresult(res.data.id),500);
          }

        });
      },
      payresult(id){
        api.fetch('/api/payments/'+id).then((resk)=>{
          if(resk.data.status=='paid'){
            clearInterval(this.interval);
            Toast({
              message: '充值成功！',
              iconClass: 'mint-toast-icon mintui mintui-success'
            });
            setTimeout(()=>{this.$emit('cancel',true);},1000);
          }
        });
      },
      getlistCoin(){
        api.fetch('/api/coins').then((res) => {
          console.log(res);
          this.list=res.data;
        });
      },
      hide() {
        this.$emit('cancel');
      }
    }
  }

</script>
<style lang="less">
  .recharge-pop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .3);
    .content {
      width: 6rem;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: .2rem;
      position: absolute;
      padding: 0 .2rem;
      .title {
        height: 1.02rem;
        line-height: 1.02rem;
        font-size: .36rem;
        color: #000;
        text-align: center;
        border-bottom: .01rem solid #ccc;
      }
      .recharge-list {
        .recharge-item {
          height: 1.1rem;
          padding: 0 .28rem 0 .2rem;
          border-bottom: .01rem solid #ccc;
          justify-content: space-between;

          .recharge-sum {
            color: #000;
            font-size: .2rem;
            .sum {
              font-size: .36rem;
              .plus {
                font-size: .2rem;
              }
            }
            &:before {
              content: '';
              background: url(../assets/images/recharge-icon.png) no-repeat;
              width: .44rem;
              height: .44rem;
              margin-right: .2rem;
              background-size: contain;
            }
          }
          .buy-btn {
            width: 1.6rem;
            font-size: .36rem;
            color: #fff;
            text-align: center;
            position: relative;
            .sum {
              position: absolute;
              line-height: .8rem;
              text-align: center;
              width: 100%;
            }
            img {
              width: 100%;
            }
          }
        }
      }
      .cancel-btn {
        height: .88rem;
        line-height: .88rem;
        font-size: .28rem;
        color: #555;
        text-align: center;
      }
    }
  }

</style>
