<template>
  <div class="room" id="roombox">
    <div class="videobox">
      <video id="remoteVideo" autoplay></video>
      <!--视角切换-->
      <div class="switchBtn"></div>
      <!--视角切换-->
      <!--用户头像-->
      <div class="userIcon">
        <div class="userName">{{userName}}{{isGameing}}</div>
        <div>
          <img :src="userIcon" width="100%" height="100%" alt="">
        </div>
      </div>
      <!--用户头像-->
      <!--倒计时-->
      <div v-if="isGameing" class="countDown">
        {{gametime}}
      </div>
      <!--倒计时-->
    </div>
    <div class="roomAction text-center">
      <div v-if="!isGameing" class="roomActionin">
        <div class="roomActionL"></div>
        <div class="roomActionM">
          <button class="playGame txt-center" @click="playGame">
            <div class="open">开始抓娃娃</div>
            <div class="price mt5">{{doll_coin}}币每次</div>
          </button>
        </div>
        <div class="roomActionR txt-center">
          <div class="fs20">
            我的娃娃币
          </div>
          <div class="fs30 mt10">
            {{coin}}
          </div>
          <div>
            <button class="rechangebtn mt15" @click="recharge">
              <div>
                <span></span>
                <i>充币</i>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="roomCtrl clearfix">
        <div class="fl roomCtrlL">
          <div v-if="isGameing" id="nipple" rel="nipple" class="nipple"></div>
        </div>
        <div class="fr roomCtrlR pt30">
          <span @touchstart="actionMove(5)"></span>
        </div>
      </div>
    </div>
    <!--充娃娃币模态框-->
    <mt-popup
      v-model="rechargeModal" modal=false>
      <div class="rechargeModal pd20">
        <div class="rechargeModalTit">充娃娃币</div>
        <div class="rechargeCon">
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix rechargeList">
            <div class="fl">
              <div class="rechargeL">
                <span class="rechargeLIcon mr20"></span>
                <span>
                <div>100</div>
                <div class="fs20">充50元返65币</div>
              </span>
              </div>
            </div>
            <div class="fr">
              <div class="rechargeR">
                <div class="payBtn fs36">
                  &yen;100.00
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="txt-center">
          <span @click="canecl" class="fs28 cancel">关闭</span>
        </div>
      </div>
    </mt-popup>
    <!--充娃娃币模态框-->
    <!--没抓到模态框-->
    <mt-popup
      v-model="failModal" modal=false closeOnClickModal=true>
      <div class="rechargeModal pd20">
        <div class="rechargeModalTit">没抓到</div>
        <div class="failCon txt-center">
          <div>
            <img src="../assets/images/dall.png" width="60%" alt="">
          </div>
          <div class="tis">您还有{{coin}}币，是否再来一局？</div>
        </div>
        <div class="txt-center clearfix failActive">
          <div class="fl">
            <span>稍后再试</span>
          </div>
          <div class="fr">
            <span @click="playGame">再来一局</span>
          </div>
        </div>
      </div>
    </mt-popup>
    <!--没抓到模态框-->
    <!--抓到模态框-->
    <mt-popup
      v-model="successModal" modal=false closeOnClickModal=true>
      <div class="rechargeModal pd20">
        <div class="rechargeModalTit">恭喜你</div>
        <div class="failCon txt-center">
          <div>
            <img src="../assets/images/success.png" width="50%" alt="">
          </div>
          <div class="tis">您还有{{coin}}币，是否再来一局？</div>
        </div>
        <div class="txt-center clearfix failActive">
          <div class="fl">
            <span>稍后再试</span>
          </div>
          <div class="fr">
            <span @click="playGame">再来一局</span>
          </div>
        </div>
      </div>
    </mt-popup>
    <!--抓到模态框-->
  </div>
</template>
<script type="text/ecmascript-6">
  import api from '@/assets/js/api'
  import '../assets/js/WebRTCAPI.min' //直播依赖；
  import '../assets/js/nipplejs.min' //操作杆；
  import {Toast} from 'mint-ui'; //提示


  export default {
    data: function () {
      return {
        //用户信息
        userId: '', //用户ID
        userName: '', //用户名；
        userIcon: '', //用户头像；
        live_openid: '', //直播openid
        coin: '', //用户剩余币数
        qcloud_user_sig: '', //腾讯云签名；
        //娃娃机信息
        room_id: '', //房间ID
        doll_name: '', //产品名称；
        doll_id: '', //娃娃机ID；
        device_status: '', //设备状态
        game_mode: '', //游戏模式
        game_time: '', //游戏时间；（原始游戏时间）
        gametime:'', //应用游戏时间；
        doll_coin: '', //一次消耗币数；
        device_image: '', //设备图片；
        ware_image: '', //产品图片；
        cameras: {}, //摄像头参数
        //(备：cameras_id:摄像头ID,cameras_type:摄像头类型/角度（正面or反面）,cameras_live_openid://摄像头的直播 openid)

        //配置信息
        qcloud: {}, //配置信息；
        //（备app_id：应用的sdkappid，account_type：账户类型）
        fake_pay: '', //模拟支付；

        //开始游戏；
        game_id: '', //游戏游戏ID;
        log_id: '', //操作记录ID;
        ws: null,


        action: '',
        time: 20,
        angle: 0,
        nipple: null,
        quitRoom: false,
        showStreamVideo: false,
        hasCatched: true,

        isGameing: false, //是否操作中；
        rechargeModal: false,
        failModal: false,
        successModal: false
      }
    },
    mounted: function () {
      this.doll_id = this.$route.params.device_id; //娃娃机ID源于URL
      this.userInfo(); //用户信息；
      this.getDollInfo(); //娃娃机信息；
      this.initInfo(); //基础配置；
    },
    created: function () {
    },
    methods: {
      //模态框
      recharge() { //充值娃娃币；
        this.rechargeModal = true;
        api.fetch('/coins').then((res) => { //充值列表
        }).catch();
      },
      canecl() {
        this.rechargeModal = false;
      },
      userInfo() {
        api.fetch('/api/account').then((res) => {
          let userInfo = res.data;
          this.userId = userInfo.id; //用户ID
          this.userName = userInfo.nickname; //用户名；
          this.userIcon = userInfo.avatar; //用户头像；
          this.live_openid = userInfo.live_openid; //直播openid
          this.coin = userInfo.coin; //用户剩余币数
          this.qcloud_user_sig = userInfo.qcloud_user_sig; //腾讯云签名；
        }).catch();
      },
      getDollInfo() { //娃娃机详情
        api.fetch('/api/machines/' + this.doll_id).then((res) => {
          let dollInfo = res.data;
          this.cameras = res.data.cameras; //摄像头参数
          this.doll_id = dollInfo.id; //娃娃机ID；
          this.room_id = dollInfo.room_id; //房间ID；
          this.doll_name = dollInfo.name; //产品名称；
          this.device_status = dollInfo.device_status; //设备状态
          this.game_mode = dollInfo.game_mode; //游戏模式
          this.game_time = dollInfo.game_time; //游戏时间；
          this.doll_coin = dollInfo.coin; //一次消耗币数；
          this.device_image = dollInfo.device_image; //设备图片；
          this.ware_image = dollInfo.ware_image; //产品图片；
          //video样式处理
          if (this.device_image == null || this.device_image == undefined || this.device_image == "") {
            document.getElementById("remoteVideo").className = 'initVideo';
          } else {
            document.getElementById("remoteVideo").style.backgroundImage = 'url(' + this.device_image + ')';
          }
        }).catch();
      },
      initInfo() { //基础配置；
        api.fetch('/api/config').then((res) => {
          this.qcloud = res.data.qcloud; //腾讯云相关配置
          this.fake_pay = res.data.fake_pay; //模拟支付
        }).catch();
      },
      initWebRTC() { //直播就绪；
        var self = this;
        //video样式处理
        document.getElementById("remoteVideo").style.background = 'none';
        let h = document.getElementById("roombox").clientHeight;
        let w = document.getElementById("roombox").clientWidth;
        let wh = w / h;
        let proportion = 0.6;
        if (wh > proportion) {
          document.getElementById("remoteVideo").style.transform = "scale(1.34, 1.26) rotate(90deg)";
        } else {
          document.getElementById("remoteVideo").style.transform = "scale(1.34, 1.43) rotate(90deg)";
        }
        var rtclistener = { //RTC回调；
          onKickout: self.onKickout, //被踢下线
          onInitResult: self.onInitResult, //初始化成功回调；
          onLocalStreamAdd: self.onLocalStreamAdd, //新增本地视频流
          onRemoteStreamAdd: self.onRemoteStreamAdd, //新增远端视频流
          onWebSocketClose: self.onWebSocketClose, //信令断开
          onRemoteStreamRemove: self.onRemoteStreamRemove, //远端视频流断开
          onUpdateRemoteStream: self.onUpdateRemoteStream, //远端视频流更新
          onRelayTimeout: self.onRelayTimeout, //超时
          onIceConnectionClose: self.onIceConnectionClose, //ICE连接断开
          onChangeRemoteStreamState: self.onChangeRemoteStreamState, //主路辅路状态更新通知
          onCreateRoomResult: self.onCreateRoomResult //创建房间结果；
        }
        WebRTCAPI.init(rtclistener, {
          sdkAppId: this.qcloud.app_id,          //应用的sdkappid
          openid: this.live_openid,              //直播openid
          userSig: this.qcloud_user_sig,         //腾讯云签名；
          accountType: this.qcloud.account_type, //账户类型
          closeLocalMedia: true
        });
      },
      onKickout: function () {
      },
      onInitResult: function (result) {
        var self = this;
        if (result !== 0) {
          var errorStr = "";
          if (result === -10001) {
            errorStr = "WebRTCJSAPI初始化参数不正确";
          } else if (result === -10002) {
            errorStr = "浏览器版本不正确";
          } else if (result === -10003) {
            errorStr = "sig校验失败";
          } else if (result === -10006) {
            errorStr = "WebSocket 初始化失败";
          } else {
            errorStr = "初始化错误";
          }
          self.Toast(errorStr);
        } else {
          //创建房间
          WebRTCAPI.createRoom({
            roomid: self.room_id,
          }, function (result) {
            if (result !== 0) {
              sdkLog.error("create room failed!!!");
              return;
            }
            self.gameStart();
          });
        }
      },
      onLocalStreamAdd: function () {
      },
      onRemoteStreamAdd: function (stream, videoId) {
        const videoElement = document.getElementById("remoteVideo");
        videoElement.srcObject = stream;
      },
      onWebSocketClose: function () {
        // this.initWebRTC();
      },
      onRemoteStreamRemove: function () {
      },
      onUpdateRemoteStream: function (stream, videoId) {
        //这里调用remotestreamadd的回调函数
        this.onRemoteStreamAdd(stream, videoId);
      },
      onRelayTimeout: function () {
      },
      onIceConnectionClose: function () {
      },
      onChangeRemoteStreamState: function () {
      },
      onCreateRoomResult: function () {
      },
      playGame: function () { //点击开始
        this.gametime=this.game_time;
        this.failModal = false
        this.successModal = false;
        if (!this.isGameing) { //游戏中
          if (this.coin >= this.doll_id) { //是否足够娃娃币
            setTimeout(() => { //游戏时间
              this.isGameing = false;
            }, this.gametime);
            api.fetch('/api/game-records', {method: 'POST', data: {'machine_id': this.doll_id}}).then((res) => {
              console.log(res.data.assign_info.ws_url);
              let gameStartInfo = res.data;
              this.game_id = gameStartInfo.id; //游戏记录ID
              this.log_id = gameStartInfo.log_id; //操作记录ID；
              this.initWebRTC(); //直播就绪
            }).catch(function (res) { //错误信息抓取
              Toast("有人在玩！");
              WebRTCAPI.quit();
            });
          } else {
            Toast("您的娃娃币不足，请充值！");
          }
        }
      },
      gameStart() {//开始游戏
        this.isGameing = true;
        Toast('Ready Go !!!');
        this.countdown(); //倒计时开始；
      },
      countdown() {
        clearInterval(countdown);
        let countdown = setInterval(() => {
          this.gametime--;
          if (this.gametime == 0) {
            this.gametime=  0;
            clearInterval(countdown);
            this.gameOver()
          }
        }, 1000)
      },
      actionMove: function (action, e) {
        this.action = action;
        if (action == 5) {
          setTimeout(() => {
            this.hasCatched = true;
            this.action = 0;
          }, 200)
        }
        api.fetch('/api/game-records/doll-operate?machine_id=' + this.doll_id + '&action=' + action).then((res) => {
          if (action == 5) {
            this.gameOver();
          }
          console.log(res)
        }).catch();
      },
      gameOver: function () {
        setTimeout(() => {
         this.isGameing = false;
          this.$loading("正在查询结果");
          this.checkResult();
          WebRTCAPI.quit();
        }, 7000);
      },
      checkResult: function () {
        api.fetch('/api/game-records/' + this.game_id).then((res) => {
          console.log(res.data)
          switch (res.data.operate_result) {
            case "-1":
              this.checkResult();
              break;
            case "1":
              this.coin = this.coin - res.data.coin;
              this.$loading.close();
              this.successModal = true;
              break;
            case "2":
              this.coin = this.coin - res.data.coin;
              this.$loading.close();
              this.failModal = true;
              break;
          }
        }).catch();
      },
    },
    watch: {
      isGameing(val) {
        if (val) {
          var self = this;
          if (this.nipple) {
            this.nippleDestroy()
          }
          setTimeout(() => {
            self.nipple = nipplejs.create({
              zone: document.getElementById('nipple'),
              mode: 'static',
              position: {left: '50%', top: '50%'},
              color: 'red',
              maxNumberOfNipples: 1,
              multitouch: false,
            });
            self.nipple.on('start end', function (evt, data) {
              if (evt.type === 'end') {
                self.actionMove(55);
              }
            }).on('dir:up dir:left dir:down dir:right',
              function (evt, data) {
                if (evt.type.indexOf('dir') !== -1) {
                  var dir = evt.type.replace("dir:", "");
                  if (self.position == 'front') {
                    if (dir == 'up') {
                      self.actionMove(2);
                    } else if (dir == 'down') {
                      self.actionMove(1);
                    } else if (dir == 'left') {
                      self.actionMove(3);
                    } else if (dir == 'right') {
                      self.actionMove(4);
                    }
                  } else {
                    if (dir == 'up') {
                      self.actionMove(3);
                    } else if (dir == 'down') {
                      self.actionMove(4);
                    } else if (dir == 'left') {
                      self.actionMove(1);
                    } else if (dir == 'right') {
                      self.actionMove(2);
                    }
                  }
                }
              });
          }, 50)
        } else {
          if (this.nipple) {
            this.nippleDestroy()
          }
        }
      }
    },
  }
</script>


<style lang="less" scoped>
  @import "../style/public";
  @import "../style/setLess";

  .room {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #ec6564;
  }

  .videobox {
    font-size: 0;
    position: absolute;
    background-color: #ec6564;
    padding: .14rem;
    font-size: 0;
    width: 100%;
    top: 0;
    bottom: 2.46rem;
    #remoteVideo {
      height: 100%;
      width: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .initVideo {
      .bis('../assets/images/videobg.png')
    }
    .switchBtn {
      .wh(.95rem, 1.04rem);
      display: block;
      padding: .05rem .1rem;
      .bis('../assets/images/camera.png');
      right: .10rem;
      bottom: 1.7rem;
      position: absolute;
    }
    .userIcon {
      display: block;
      position: absolute;
      .wh(1.83rem, 2.23rem);
      border: 0.03rem solid #ec6564;
      border-radius: 0 0 .1rem 0;
      top: .11rem;
      left: .11rem;
      overflow: hidden;
      .userName {
        .font(.28rem, #fff);
        line-height: .5rem;
        text-align: center;
        background: #a54747;
      }
    }
    .countDown {
      position: absolute;
      right: .14rem;
      top: .14rem;
      text-align: center;
      line-height: .8rem;
      font-size: .36rem;
      font-weight: bold;
      color: #fff;
      background: #a54747;
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
    }
  }

  .roomAction {
    position: absolute;
    width: 100%;
    height: 2.46rem;
    bottom: 0;
    left: 0;
    .roomActionin {
      display: flex;
      justify-content: space-around;
      padding-top: .5rem;
      .roomActionL {
        flex-shrink: 1;
        width: 20%;
      }
      .roomActionM {
        flex-shrink: 2;
        -webkit-box-flex: 1;
        .playGame {
          vertical-align: middle;
          display: table-cell;
          .wh(3rem, 1.12rem);
          border: none;
          background: none;
          .bis('../assets/images/play-game.png');
          outline: none;
          .open {
            .font(.34rem, #fff);
          }
          .price {
            .font(.2rem, #fff);
          }
        }
      }
      .roomActionR {
        flex-shrink: 1;
        width: 20%;
        color: #fff;
        .rechangebtn {
          background: #fff;
          .wh(1.2rem, .4rem);
          border-radius: .4rem;
          border: none;
          .settxt(.26rem, .26rem, '../assets/images/rechangebtn.png');
          outline: none;
          .font(.24rem, #783918);
        }
      }
    }
  }

  .roomCtrl {
    position: relative;
    padding: 0 0.9rem;
    .roomCtrlL, roomCtrR {
      width: 50%;
    }
    .roomCtrlL {
      text-align: right;
      .ctrlBox {
        position: relative;
        width: 3rem;
        height: 2.25rem;
        margin-top: 0.01rem;
        span {
          display: block;
          position: absolute;
          .wh(1rem, 1rem);
        }
        .left {
          .bis('../assets/images/left_btn.png');
          left: 0;
          top: 50%;
          margin-top: -.5rem;
        }
        .left_btn_click {
          .bis('../assets/images/left_btn_click.png');
        }
        .up {
          .bis('../assets/images/up_btn.png');
          top: 0;
          left: 50%;
          margin-left: -.5rem;
        }
        .up_btn_click {
          .bis('../assets/images/up_btn_click.png');
        }
        .right {
          .bis('../assets/images/right_btn.png');
          right: 0;
          top: 50%;
          margin-top: -.5rem;
        }
        .right_btn_click {
          .bis('../assets/images/right_btn_click.png');
        }
        .down {
          .bis('../assets/images/down_btn.png');
          bottom: 0;
          left: 50%;
          margin-left: -.5rem;
        }
        .down_btn_click {
          .bis('../assets/images/down_btn_click.png');
        }
      }
    }
    .roomCtrlR {
      text-align: right;
      span {
        display: inline-block;
        .wh(1.6rem, 1.6rem);
        .bis('../assets/images/comfirm_btn.png');
      }
    }
  }

  //充娃娃币模态框
  .mint-popup {
    border-radius: .1rem;
  }

  .rechargeModal {

    overflow: hidden;
    .rechargeModalTit {
      .font(.37rem, #000);
      line-height: .63rem;
      paddint-bottom: .2rem;
      text-align: center;
    }
    .rechargeCon {
      max-height: 5.6rem;
      overflow: hidden;
      overflow-y: scroll;
      .rechargeList {
        width: 5.6rem;
        border-top: 1px solid #c8c7cc;
        padding: .15rem .28rem .15rem .2rem;
        &:last-child {
          border-bottom: 1px solid #c8c7cc;
        }
        .rechargeL {
          span {
            display: inline-block;
            vertical-align: middle;
            font-size: .36rem;
            color: #000;
          }
          .rechargeLIcon {
            .wh(.44rem, .3rem);
            .bis("../assets/images/recharge-l-icon.png");
          }
        }
        .rechargeR {
          .payBtn {
            .wh(1.6rem, .81rem);
            .bis("../assets/images/buy-btn.png");
            text-align: center;
            line-height: .81rem;
            color: #fff;
          }
        }
      }
    }
    /*.rechargeCon::-webkit-scrollbar{*/
    /*display:none;*/
    /*}*/
    .cancel {
      .font(.28rem, #555);
      line-height: .68rem;
    }
  }

  .failCon {
    width: 6rem;
    img {
      margin-top: .38rem;
      margin-bottom: 1rem;
    }
    .tis {
      .font(.32rem, #555);
      text-align: center;
      line-height: .6rem;
      margin-bottom: .38rem;
    }
  }

  .failActive {
    div {
      width: 50%;
      text-align: center;
      height: .88rem;
      line-height: .88rem;
      &:first-child {
        span {
          .font(.28rem, #555);
        }
      }
      &:last-child {
        position: relative;
        span {
          .font(.28rem, #ec6564);
        }
      }
      &:last-child:after {
        content: "";
        display: block;
        width: .02rem;
        height: .3rem;
        left: 0;
        top: 50%;
        margin-top: -0.15rem;
        background: #6d6d6d;
        position: absolute;
      }
    }
  }

  .nipple {
    position: relative;
    top: 0;
    left: 0;
  }


</style>



