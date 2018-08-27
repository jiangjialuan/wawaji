<template>
  <div class="mywawa">
    <router-link class="address yes" to="/address-list" v-if="defaultAddress.id">
      <div class="icon"><img src="../../assets/images/addresslow.png"/></div>
      <div class="text">
        <div><label>{{defaultAddress.consignee}}</label><label>{{defaultAddress.phone}}</label></div>
        <div class="addressde">
          {{defaultAddress.province.name}}{{defaultAddress.city.name}}{{defaultAddress.district.name}}{{defaultAddress.address}}
        </div>
      </div>
    </router-link>
    <router-link class="address no" to="/add-address" v-else>
      <div class="icon"><img src="../../assets/images/addresslow.png"/></div>
      <div class="text">点击添加收获地址</div>
    </router-link>
    <div class="mylist" v-infinite-scroll="getlist" infinite-scroll-disabled="nonext" infinite-scroll-distance="10"
         infinite-scroll-immediate-check="false">
      <div class="myitem" v-for="(item,index) in list" :id="item.id" v-if="item.ware_status!=0" :key="index">
        <div class="imgclass"><img :src="item.ware_image"/></div>
        <div class="textclass">
          <p class="title">{{item.ware_name}}</p>
          <p class="time">抓取时间 {{item.created_at}}</p>
        </div>
        <div class="btn">
          <button v-if="item.ware_status==1">待领取</button>
          <img src="../../assets/images/areadyget.png" class="tag" v-if="item.ware_status==2"/>
        </div>
      </div>
      <div class="noaddress" v-if="list.length==0">
        暂时还没有记录！
      </div>
    </div>
    <div class="allget">
      <button @click="getwawa" class="disabled" v-if="list.length==0">一键领取（{{idsArr.length}}）</button>
      <button @click="getwawa" v-else>一键领取（{{idsArr.length}}）</button>
    </div>
    <foot :selected="2"></foot>
  </div>
</template>
<script>
  import {InfiniteScroll} from 'mint-ui';
  import foot from '@/components/tabfoot';
  import {MessageBox} from 'mint-ui';
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import store from 'store';

  export default {
    data: function () {
      return {
        list: [],
        page: 1,
        nonext: false,
        game_record_ids: '',
        address_id: '',
        idsArr: [],
        defaultAddress: {}
      }
    },
    components: {
      'foot': foot,
      'MessageBox': MessageBox,
    },
    created: function () {
      auth.wechatConfig('hide');
      this.getlist();
      api.fetch('/api/addresses/default').then((res) => {
        if (res) {
          this.defaultAddress = res.data;
          this.address_id = res.data.id;
        }
      });
    },
    methods: {
      getlist: function () {
        var smData = {
          page: this.page,
          per_page: 15,
        };
        api.fetch('/api/doll-records', {
          params: smData,
        }).then((res) => {
          if (res.meta.pagination.count > 0) {
            if (res.meta.pagination.per_page > res.meta.pagination.count) {
              this.nonext = true;
            }
            if (this.list.length == 0) {
              this.list = res.data;
              this.page = this.page + 1;
              console.log(this.list);
            } else {
              this.list = this.list.concat(res.data);
              this.page = this.page + 1;
            }
            this.getNum(this.list);
          }
        }).catch();
      },
      getNum: function (arr) {
        var newlist = [], j = 0, idStr;
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].ware_status == 1) {
            newlist[j] = i;
            j++;
            if (idStr == undefined) {
              idStr = this.list[i].id;
            } else {
              idStr += ',' + this.list[i].id;
            }
          }
          if (i == this.list.length - 1) {
            this.idsArr = newlist;
            this.game_record_ids = idStr;
          }
        }
      },
      getwawa: function () {
        var that = this;
        var smData = {
          game_record_ids: this.game_record_ids,
          address_id: this.address_id
        };
        api.fetch('/api/orders', {
          method: 'post',
          data: smData,
        }).then((res) => {
          for (var i = 0; i < this.idsArr.length; i++) {
            this.list[this.idsArr[i]].ware_status = 2;
          }
          MessageBox({
            title: '提示',
            message: '领取完成，你可以',
            showCancelButton: true,
            confirmButtonText: '查看订单',
            confirmButtonClass: 'f-28',
            cancelButtonClass: 'f-28'
          }).then(action => {
            that.$router.push('/order-list');
          }, action => {
          });
        }).catch();
      }
    },
  }
</script>
<style lang="less" scoped>

  .address {
    display: flex !important;
    flex-direction: row;
    padding: 0.3rem 0.4rem;
    justify-content: flex-start;
    position: relative;
    background: #fff url('../../assets/images/borderstyle.png') repeat-x left bottom;
    background-size: 0.67rem 0.05rem;
    .icon {
      margin-right: 0.07rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
    .text {
      width: 6.2rem;
      margin-right: 0.13rem;
      line-height: 0.5rem;
      label {
        font-weight: bold;
        font-size: 0.3rem;
        &:first-child {
          margin-right: 0.3rem;
        }
      }
      .addressde {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-size: 0.26rem;
        color: #949699;
      }
    }
    &.no {
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    &.yes:after {
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

  .mywawa {
    .noaddress {
      text-align: center;
      height: 1rem;
      line-height: 1rem;
      background: #f4f5f5;
    }
    padding-bottom: 2.26rem;
    .allget {
      width: 100%;
      position: fixed;
      left: 0rem;
      right: 0rem;
      bottom: 0.96rem;
      height: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f4f4f4;
      button {
        background: #f23030;
        width: 6.58rem;
        width: 6.58rem;
        height: 0.8rem;
        text-align: center;
        font-size: 0.32rem;
        color: #fff;
        border: none;
        border-radius: 0.08rem;
      }
    }
    .mylist {
      padding: 0.2rem;
      .myitem {
        background: #fff;
        border-radius: 0.08rem;
        width: 100%;
        height: 1.4rem;
        margin-bottom: 0.2rem;
        padding: 0.3rem 0.4rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .imgclass {
          width: 0.94rem;
          height: 0.8rem;
          margin-right: 0.3rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .textclass {
          .title {
            color: #000;
            font-size: 0.28rem;
            width: 4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .time {
            font-size: 0.24rem;
            color: #a3a3a3;
          }
        }
        .btn {
          position: relative;
          width: 1.3rem;
          display: flex;
          justify-content: flex-end;
          button {

            height: 0.8rem;
            color: #ec6564;
            border-radius: 0.04rem;
            background: #fff;
            border: none;
            font-size: 0.24rem;
          }
          .tag {
            width: 1.14rem;
            height: 1.2rem;
            position: absolute;
            top: -0.3rem;
            right: -0.4rem;
          }
        }
      }

    }
  }
</style>
