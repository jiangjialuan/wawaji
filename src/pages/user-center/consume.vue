<template>
  <div class="consume">
    <div class="consume-list" v-infinite-scroll="getlist" infinite-scroll-disabled="nonext" infinite-scroll-distance="10"
         infinite-scroll-immediate-check="false">
      <div class="consume-item flex" v-for="(item,index) in list" :key="index">
        <div class="content flex">
          <img :src="item.ware_image" class="img">
          <div class="desc">
            <p class="name">{{item.ware_name}}</p>
            <p class="date">{{item.created_at}}</p>
          </div>
        </div>
        <div class="status" v-if="item.operate_result==2">
          抓取娃娃失败
        </div>
        <div class="status success" v-if="item.operate_result==1">
          抓取娃娃成功
        </div>
      </div>
      <div class="noaddress" v-if="list.length==0">
        暂时还没有抓取记录！
      </div>
    </div>
  </div>
</template>
<script>
  import {InfiniteScroll} from 'mint-ui';
  import api from '@/assets/js/api';
  import mock from '@/util/mock';
export default {
  data: function() {
    return {
      status: 0,
      list: [],
      show_rule: false,
      statusBgColor: "#71C671",
      page:1,
      nonext:false,

    }
  },
  created: function() {
    auth.wechatConfig('hide');
    this.getlist();
  },
  methods: {
    getlist:function(){
      var smData={
        page:this.page,
        per_page:15,
      }
      api.fetch('/api/game-records',{params: smData}).then((res) => {
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
      })
    }
  }
}

</script>
<style scoped lang="less">
.consume {
  .noaddress {
    text-align: center;
    height: 1rem;
    line-height: 1rem;
    background: #f4f5f5;
  }
  .consume-list {
    .consume-item {
      justify-content: space-between;
      padding: .3rem .4rem;
      background: #fff;
      height: 1.4rem;
      margin: .2rem .2rem 0;
      border-radius: .18rem;
      .content {
        font-size: .3rem;
        color: #333;
        margin: .12rem 0;
        .img {
          width: .94rem;
          height: .8rem;
          margin-right: .4rem;
        }
        .desc {
          justify-content: flex-start;
          flex-direction: column;
        }
        .name {
          font-size: .28rem;
          color: #000;
          margin: .12rem 0;
        }
        .date {
          color: #a3a3a3;
          font-size: .24rem;
        }
      }
      .status {
        color: #a3a3a3;
        font-size: .24rem;
        &.success {
          color: #ec6564;
        }
      }
    }
  }
}

</style>
