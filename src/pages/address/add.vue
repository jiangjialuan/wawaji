<template>
  <div class="add-address" id="add-address">
    <table>
      <tr>
        <td width="90%"><label>收货人  :</label><input type="text" name="name" v-model="consignee" placeholder="请输入收货人"
                                                    v-on:focus="inputfs"></td>
        <td width="10%"></td>
      </tr>
      <tr>
        <td><label>联系方式  :</label><input type="text" name="phone" v-model="phone" placeholder="请输入手机号码"
                                         v-on:focus="inputfs"></td>
        <td></td>
      </tr>
      <tr>
        <td id="sel_city" @click="slectaddr">
          <div class="classlong"><label>所在区域  :</label><span>{{district_name }}</span></div>
        </td>
        <td class="sel_city"></td>
      </tr>
      <tr>
        <td>
          <div class="classlong"><label>详细街道  :</label><input type="text" placeholder="街道、楼牌号等" name="detail"
                                                              v-model="address" v-on:focus="inputfs"></div>
        </td>
        <td></td>
      </tr>
    </table>
    <div class="order_hint_box">
      <div class="order_hint_content">
        <div class="order_hint_background">
          <div class="order_hint_tit"></div>
        </div>
      </div>
    </div>
    <div class="allget">
      <button @click="save">保存</button>
    </div>
    <div class="pickerbox" :class="{hidden:selectdisplay}">
      <div class="picker-btn"><label @click="selectdone">完成</label></div>
      <mt-picker :slots="addressSlots" class="picker" @change="onValuesChange" value-key="name"></mt-picker>
    </div>
  </div>
</template>
<script>
  import api from '@/assets/js/api'
  import auth from '@/assets/js/auth';
  import {Picker} from 'mint-ui';
  import {Toast} from 'mint-ui';
  import store from 'store';

  export default {
    data: function () {
      return {
        id: this.$route.query.id || '',
        cityData: '',
        consignee: '',
        phone: '',
        address: '',
        is_default: 0,
        district_name: '请选择省市区',
        district_id: '',
        selectdisplay: true,
        flag: this.$route.query.flag,
        addressSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot1'
          }, {
            flex: 1,
            values: [],
            className: 'slot',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot1'
          }, {
            flex: 1,
            values: [],
            className: 'slot',
            textAlign: 'center'
          }
        ],
        Shi: '',
        Xian: '',
        addressProvince: '省',
        addressCity: '市',
        addressXian: '区',
      }
    },
    components: {
      'mt-picker': Picker,
    },
    created: function () {
      auth.wechatConfig('hide');
      this.getCitys();
      if (this.flag == 'edit') {
        api.fetch('/api/addresses/' + this.$route.query.id).then((res) => {
          this.district_name = res.data.province.name + ' ' + res.data.city.name + ' ' + res.data.district.name;
          this.address = res.data.address;
          this.consignee = res.data.consignee;
          this.phone = res.data.phone;
          this.is_default = res.data.is_default;
          this.district_id = res.data.district.id;
        });
      }
    },
    methods: {
      getCitys: function () {
        api.fetch('api/addresses/regions').then((res) => {
          this.addressSlots[0].values = res.data;
        });
      },
      inputfs: function () {
        this.selectdisplay = true;
      },
      slectaddr: function () {
        document.querySelector('body').addEventListener('touchmove', function (ev) {
          ev.preventDefault();
        });
        this.selectdisplay = false;
      },
      selectdone: function () {
        document.querySelector('body').removeEventListener('touchmove', function (ev) {
          ev.preventDefault();
        });
        this.district_id = this.addressXian.id;
        this.selectdisplay = true;
        this.district_name = this.addressProvince.name + ' ' + this.addressCity.name + ' ' + this.addressXian.name;
      },
      save: function () {
        if (this.consignee == '') {
          Toast({
            message: '请输入收货人',
            iconClass: 'mint-toast-icon mintui mintui-field-warning'
          });
        } else if (this.phone == '' || !/^1[34578][0-9]{9}$/.test(this.phone)) {
          Toast({
            message: '请输入正确的手机号码',
            iconClass: 'mint-toast-icon mintui mintui-field-warning'
          });
        } else if (this.district_name == '请选择省市区') {
          Toast({
            message: '请选择省市区',
            iconClass: 'mint-toast-icon mintui mintui-field-warning'
          });
        } else if (this.address == '') {
          Toast({
            message: '请输入街道、楼牌号等',
            iconClass: 'mint-toast-icon mintui mintui-field-warning'
          });
        } else {
          var smData = {
            district_id: this.district_id,
            address: this.address,
            consignee: this.consignee,
            phone: this.phone,
            is_default: this.is_default
          }, postUrl;
          var config = {
            method: 'post',
            data: smData,
          };
          if (this.flag == 'edit') {
            postUrl = '/api/addresses/' + this.id;
            smData._method = 'put';
          } else {
            postUrl = '/api/addresses';
          }
          api.fetch(postUrl, config).then((res) => {
            Toast({
              message: '保存成功！',
              iconClass: 'mint-toast-icon mintui mintui-success'
            });
            this.$router.push("/address-list");
          }).catch();
        }
      },
      onValuesChange: function (picker, values) {
        if (values[0] != undefined && values[0].id != undefined) {
          picker.setSlotValues(1, values[0].children);
        }
        if (values[1] != undefined && values[1].id != undefined) {
          picker.setSlotValues(2, values[1].children);
        }
        this.addressProvince = values[0];
        this.addressCity = values[1];
        this.addressXian = values[2];
      },
    },
  }
</script>
<style scoped lang="less">

  .add-address {
    height: 100%;
    overflow: hidden;
    .classlong {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      label {
        width: 1.5rem;
      }
      span {
        width: 5rem;
        height: 1.06rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .sel_city {
      position: relative;
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
    background: #fff;
    .pickerbox {
      .picker-btn {
        height: 0.5rem;
        padding: 0rem 0.3rem;
        text-align: right;
        font-size: 0.24rem;
        line-height: 0.5rem;
      }
      position: fixed;
      z-index: 999;
      bottom: 0rem;
      left: 0rem;
      right: 0rem;
      background: #fff;
      .picker {
        border-top: 0.01rem solid #ddd;
      }
    }
    ul {
      background: #fff;
      list-style-type: none;
      margin: 0px;
      padding: 0px;
    }
    p {
      margin: 0px;
    }
    a {
      text-decoration: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
    }
    td {
      padding: 0px;
    }
    input {
      width: 4.5rem;
      outline: none;
      border: 0px;
    }
    table {
      border-collapse: collapse;
      box-sizing: border-box;
      width: 100%;
      display: inline-block;
    }
    table tr td {
      border-bottom: 1px solid #ccc;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
      height: 1.06rem;
      line-height: 1.06rem;
      color: #000;
      font-size: 0.28rem;
    }
    table tr td label {
      padding-right: 0.2rem;
    }
    table tr:first-child td:last-child {
      padding-left: 0rem;
      padding-right: 0rem;
      box-sizing: border-box;
      font-size: 0.26rem;
      text-align: center;
    }
    table tr:first-child td:last-child img {
      width: 0.6rem;
      height: 0.6rem;
      display: block;
      position: relative;
      left: 0.45rem;
    }
    table tr:first-child td:first-child {
      width: 7.5rem;
    }
    table tr:nth-child(3) td:last-child img {
      width: 0.2rem;
      float: right;
    }
    table tr:nth-child(3) td:first-child a {
      color: #000;
      width: 4rem;
      display: inline-block;
    }
    footer {
      width: 100%;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      font-size: 0.32rem;
      position: fixed;
      bottom: 0px;
    }
    footer span {
      width: 4.18rem;
      height: 0.8rem;
      background: #f23030;
      border: 0.2rem;
      -webkit-border-radius: 0.2rem;
      text-align: center;
      line-height: 0.8rem;
      display: block;
      margin: 0.2rem auto;

    }
    .picker .picker-panel .picker-choose .confirm {
      color: #f47070 !important;
    }
    .picker .picker-panel .picker-choose .picker-title {
      font-size: 0.35rem !important;
    }
    .picker .picker-panel .wheel-wrapper .wheel {
      font-size: 0.3rem !important;
    }
    .order_hint_box {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, .5);
      display: none;
      z-index: 9998;
      transition: all .3s ease;
    }
    .order_hint_content {
      display: table-cell;
      vertical-align: middle;
    }
    .order_hint_content .order_hint_background {
      margin: 0 auto;
      width: 60%;
      background-color: #2d2c2c;
      border-radius: .06rem;
      overflow: hidden;
      color: #fff;
      z-index: 100;
    }
    .order_hint_content .order_hint_background .order_hint_tit {
      font-size: .3rem;
      padding: .4rem 0;
      text-align: center;
    }
    .allget {
      width: 100%;
      position: absolute;
      left: 0rem;
      right: 0rem;
      bottom: 0rem;
      height: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      button {
        background: #f23030;
        width: 4.18rem;
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
