<template>
  <div class="home" :style="{'-webkit-overflow-scrolling': scrollMode,height:sysH+'px'}">
    <div class="banner">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item, index) in imgs" :key="index"><img :src="item"/></mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="maincontent" v-infinite-scroll="loadList" infinite-scroll-disabled="nonext"
         infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="conitem" v-for="(item, index) in list" :key="index" :id="item.id"
           :game_time="item.game_time" v-if="item.device_status!=2" @click="goroom(item.id)">
        <div class="imgclass">
          <img :src="item.ware_image"/>
          <div class="imgtag" v-if="item.game_mode==2"><img src="../assets/images/Infiniteindex.png"/></div>
        </div>
        <div class="textclass">
          <p class="_title">{{item.name}}</p>
          <p class="_detail">
            <label>{{item.coin}}/次</label>
            <label v-if="item.device_status==0">空闲中</label>
            <label class="active" v-if="item.device_status==1">游戏中</label>
          </p>
        </div>
      </div>
    </div>
    <foot :selected="1"></foot>
  </div>
</template>

<script>
  import {InfiniteScroll} from 'mint-ui';
  import store from 'store';
  import foot from '@/components/tabfoot';
  import {Indicator} from 'mint-ui';
  import auth from '@/assets/js/auth';
  import api from '@/assets/js/api';
  import {Toast} from 'mint-ui';
  export default {
    data: function () {
      return {
        list: [],
        allLoaded: false,
        page: 1,
        scrollMode: "auto",
        sysH: '',
        imgs: [],
        nonext: false,
      }
    },
    components: {
      'InfiniteScroll': InfiniteScroll,
      'foot': foot,
      'Indicator': Indicator,
    },
    created: function () {
      this.loadList();
      auth.wechatConfig();
      this.getImg();
    },
    mounted: function () {
      this.sysH = document.documentElement.clientHeight;
    },
    methods: {
      goroom: function (id) {
        this.$router.push("/room/" + id);
      },
      getImg: function () {
        api.fetch('/api/banners').then((res) => {
          console.log(res);
          this.imgs = res.data;
        }).catch();
      },
      loadList: function () {
        Indicator.open('加载中...');
        var smData = {
          page: this.page,
          per_page: 15,
        };
        api.fetch('/api/machines', {params: smData}).then((res) => {
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
            this.$nextTick(() => {
              this.scrollMode = "touch";
            });
          }
          Indicator.close();
        }).catch(() => {
          Indicator.close();
        });
      },
    }
  }
</script>

<style lang="less" scoped>
  .home {
    overflow: scroll;
    .footer .tab img {
      width: 0.42rem;
      height: 0.42rem;
    }
    .picker-item {
      transform: translateZ(0) rotateX(0);
    }
    .footer .tab {
      text-align: center;
      font-size: 0.2rem;
      width: 33.33%;
      color: #626567;
      padding-top: 0.42rem;
      &.active {
        color: #ec6564;
      }
      &:first-child {
        background: url('../assets/images/tabindex.png') no-repeat top center;
        background-size: 0.42rem;
        &.active {
          background: url('../assets/images/tabindexh.png') no-repeat top center;
          background-size: 0.42rem;
        }
      }
      &:nth-child(2) {
        background: url('../assets/images/tabwawaji.png') no-repeat top center;
        background-size: 0.42rem;
        &.active {
          background: url('../assets/images/tabwawajih.png') no-repeat top center;
          background-size: 0.42rem;
        }
      }
      &:last-child {
        background: url('../assets/images/tabuser.png') no-repeat top center;
        background-size: 0.42rem;
        &.active {
          background: url('../assets/images/tabuserh.png') no-repeat top center;
          background-size: 0.42rem;
        }
      }
    }
    .footer {
      right: 0rem;
      height: 0.96rem;
      position: fixed;
      left: 0rem;
      bottom: 0rem;
      background: #fff;
      z-index: 9999;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .textclass {
      padding: 0.08rem 0.16rem;
      height: 0.9rem;
    }
    .textclass ._title {
      font-size: 0.30rem;
      color: #1a1a1a;
      margin-bottom: 0.1rem;
      height: 0.32rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 0.32rem;
      line-height: 0.32rem;
    }
    .textclass ._detail img {
      vertical-align: middle;
      margin-right: 0.08rem;
    }
    .textclass ._detail {
      font-size: 0.24rem;
      color: #9a999a;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      label {
        font-size: 0.24rem;
      }
      label:first-child {
        background: url('../assets/images/times.png') no-repeat left center;
        background-size: 0.2rem;
        padding-left: 0.3rem;
      }
      label:last-child {
        background: url('../assets/images/freemode.png') no-repeat left center;
        background-size: 0.2rem;
        padding-left: 0.3rem;
        &.active {
          background: url('../assets/images/hotmode.png') no-repeat left center;
          background-size: 0.2rem;
          padding-left: 0.3rem;
        }
      }
    }
    .imgclass, .imgclass img {
      width: 2.9rem;
      position: relative;
      height: 2.5rem;
      .imgtag {
        position: absolute;
        top: 0.14rem;
        width: 1.2rem;
        right: 0rem;
        height: 0.34rem;
        background: #ec6564;
        border-radius: 0.6rem 0rem 0rem 0.6rem;
        color: #fff;
        font-size: 0.2rem;
        text-align: center;
        i {
          background: url('../assets/images/infinite.png') no-repeat left center;
          display: inline-block;
          width: 0.2rem;
          height: 0.2rem;
          background-size: 0.2rem;
          vertical-align: middle;
          margin-right: 0.05rem;
        }
        img {
          width: 1.2rem;
          height: 0.34rem;
        }
      }
    }
    .conitem {
      width: 2.9rem;
      margin-bottom: 0.3rem;
      background: #fff;
      border-radius: 0.1rem;
      height: 3.4rem;
      margin-right: 0.5rem;
    }
    .maincontent {
      padding: 0.25rem 0.1rem 0.96rem 0.6rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .banner {
      width: 100%;
      height: 2.4rem;
    }
    .banner img {
      width: 100%;
      hegiht: 100%;
    }
    .header {
      height: 0.68rem;
      background: #ec6564;
      text-align: center;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0.1rem 0.28rem;
      align-items: center;
    }
    .header-title {
      color: #fff;
      font-size: 0.37rem;
      line-height: 0.68rem;
    }
    .header-left {
      width: 0.33rem;
      height: 0.40rem;
    }
    .header-left img, .header-right img {
      width: 100%;
      align-items: center;
    }
    .header-right {
      width: 0.36rem;
      height: 0.36rem;
    }
  }
</style>
