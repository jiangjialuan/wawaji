<template>
  <div class="address-list">
    <ul class="address" v-infinite-scroll="getList" infinite-scroll-disabled="nonext" infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false">
      <li class="addressitem" v-for="(item,index) in list" :key="index" :id="item.id">
        <div class="up">
          <p class="name"><label>{{item.consignee}}</label><label>{{item.phone}}</label></p>
          <p class="detail">{{item.province.name}}{{item.city.name}}{{item.district.name}}{{item.address}}</p>
        </div>
        <div class="down">
          <div class="left">
            <label :class=" {active:radioSelect==item.id}" @click="setAddress(item.id,index)">默认地址</label>
          </div>
          <div class="right">
            <router-link class="edit" :to="'/add-address?flag=edit&id='+item.id">编辑</router-link>
            <label class="del" @click="delAddress(item.id,index)">删除</label>
          </div>
        </div>
      </li>
      <li class="noaddress" v-if="list.length==0">
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
    <router-link to="/add-address" class="allget">
      <button>+ 新建地址</button>
    </router-link>
  </div>
</template>
<script>
  import {InfiniteScroll} from 'mint-ui';
  import store from 'store';
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import {Toast} from 'mint-ui';

  export default {
    data: function () {
      return {
        radioSelect: '',
        page: 1,
        list: [],
        nonext: false
      }
    },
    components: {},
    created: function () {
      auth.wechatConfig('hide');
      this.getList();
    },
    methods: {
      setAddress: function (id, index) {
        this.radioSelect = id;
        var config = {
          method: 'post',
          data: {
            id: id,
            district_id: this.list[index].district.id,
            address: this.list[index].address,
            consignee: this.list[index].consignee,
            phone: this.list[index].phone,
            is_default: 1,
            _method: 'put'
          }
        }
        api.fetch('/api/addresses/' + id, config).then((res) => {
          console.log(res);
          Toast({
            message: '保存成功！',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
        }).catch();
      },
      delAddress: function (id, index) {
        api.fetch('/api/addresses/' + id, {
          method: 'post',
          data: {
            _method: 'delete'
          }
        }).then((res) => {
          this.list.splice(index, 1);
          Toast({
            message: '删除成功！',
            iconClass: 'mint-toast-icon mintui mintui-success'
          });
        }).catch();
      },
      getList: function () {
        var smData = {
          page: this.page,
          per_page: 15,
        }
        api.fetch('/api/addresses').then((res) => {
          if (res.meta.pagination.count > 0) {
            if (res.meta.pagination.per_page > res.meta.pagination.count) {
              this.nonext = true;
            }
            if (this.length == 0) {
              this.list = res.data;
              this.page = this.page + 1;
            } else {
              this.list = this.list.concat(res.data);
              this.page = this.page + 1;
            }
            for (var i = 0; i < this.list.length; i++) {
              if (this.list[i].is_default == 1) {
                this.radioSelect = this.list[i].id;
                break;
              }
            }
          }
        }).catch();
      }
    },
  }
</script>
<style scoped lang="less">
  .address-list {
    padding-bottom: 1.3rem;
    .noaddress {
      text-align: center;
      height: 1rem;
      line-height: 1rem;
      background: #f4f5f5;
    }
    .addressitem {
      height: 2.5rem;
      width: 100%;
      background: #fff;
      padding: 0.2rem;
      margin-bottom: 0.2rem;
      .up {
        margin-bottom: 0.2rem;
        .name {
          font-size: 0.3rem;
          color: #010101;
          height: 0.5rem;
          line-height: 0.5rem;
          margin-bottom: 0.06rem;
          overflow: hidden;
          label:first-child {
            margin-right: 0.3rem;
          }
        }
        .detail {
          font-size: 0.26rem;
          color: #686868;
          height: 0.72rem;
          line-height: 0.36rem;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }
      .down {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 0.81rem;
        border-top: 0.01rem solid #e1e1e1;
        font-size: 0.26rem;
        color: #686868;
        .left {

          /*input + label {
            padding-left: 0.46rem;
            display: inline-block;
            background: url('../../assets/images/noselect.png') no-repeat left center;
            background-size: 0.36rem;
            height:0.38rem;
          }
          input:checked +label{
              background: url('../../assets/images/select.png') no-repeat left center;
              background-size: 0.36rem;
          }*/
          label {
            padding-left: 0.46rem;
            display: inline-block;
            background: url('../../assets/images/noselect.png') no-repeat left center;
            background-size: 0.36rem;
            height: 0.38rem;
            &.active {
              background: url('../../assets/images/select.png') no-repeat left center;
              background-size: 0.36rem;
            }
          }

        }
        .edit {
          padding-left: 0.46rem;
          background: url('../../assets/images/edit.png') no-repeat left center;
          background-size: 0.36rem;
          margin-right: 0.3rem;
        }
        .del {
          padding-left: 0.46rem;
          background: url('../../assets/images/del.png') no-repeat left center;
          background-size: 0.36rem;
          line-height: 0.36rem;
          height: 0.36rem;
        }
      }
    }
    .allget {
      width: 100%;
      position: fixed;
      background: #f4f4f4;
      left: 0rem;
      right: 0rem;
      bottom: 0rem;
      height: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        background: #f23030;
        width: 6.58rem;
        height: 0.8rem;
        text-align: center;
        font-size: 0.32rem;
        color: #fff;
        border: none;
        border-radius: 0.08rem;
      }
    }
  }
</style>
