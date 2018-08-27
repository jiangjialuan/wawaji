<template>
    <div class="room">
        <div style="text-align: center;position: relative;">
            <canvas id="room-video" style="width: 6.4rem;height: 8.64rem;border-radius: 0.2rem;background-color: #ffffff;"></canvas>
            <img class="video-camera" src="../assets/images/camera.png" @click="checkoutVision">
            <div v-if="isPlaying" style="position: absolute;top: 0.1rem;right: 0.6rem;font-size:1rem;">{{time}}</div>
        </div>
        <div v-if="!isPlaying" style="">
            <div class="playGame_btn" @click="playGame">
                开始游戏
            </div>
        </div>
        <div v-else style="overflow: hidden;">
            <div class="direction_btn_area">
                <div class="up_btn" @touchstart="actionMove('2')" @touchend="actionMove('6')">
                    <img v-if="action=='1'" src="../assets/images/up_btn_click.png">
                    <img v-else src="../assets/images/up_btn.png">
                </div>
                <div class="down_btn" @touchstart="actionMove('1')" @touchend="actionMove('7')">
                    <img v-if="action=='2'" src="../assets/images/down_btn_click.png">
                    <img v-else src="../assets/images/down_btn.png">
                </div>
                <div class="left_btn" @touchstart="actionMove('3')" @touchend="actionMove('8')">
                    <img v-if="action=='3'" src="../assets/images/left_btn_click.png">
                    <img v-else src="../assets/images/left_btn.png">
                </div>
                <div class="right_btn" @touchstart="actionMove('4')" @touchend="actionMove('9')">
                    <img v-if="action=='4'" src="../assets/images/right_btn_click.png">
                    <img v-else src="../assets/images/right_btn.png">
                </div>
            </div>
            <div style="float: right;margin-right: 0.9rem;margin-top:0.3rem;" @touchstart="actionMove('5')" @touchend="catchEnd">
                <img v-if="action=='5'" src="../assets/images/confirm_btn_click.png" style="width:1.6rem;height: 1.6rem;">
                <img v-else src="../assets/images/comfirm_btn.png" style="width:1.6rem;height: 1.6rem;">
            </div>
        </div>
    </div>
</template>
<script>
import socket from '../assets/js/im';
export default {
    data: function() {
        return {
            device_id: '',
            action: '',
            isPlaying: false,
            time: 20,
            angle: 0
        }
    },
    created: function() {
        this.device_id = this.$route.params.device_id;
        this.userid = "420808";
        this.platform = "qyguo";
        this.sign = "007a2dd95e63f1c9c67cfdea36137c2f";
        this.ts = "1509703625";
    },
    mounted: function() {
        var canvas = document.getElementById('room-video');
        var ctx = canvas.getContext("2d");

        let userInfo = {
            userid: 10000,
            username: 'test'
        };
        this.setSocket(ctx);
        socket.onMsg('connect', socket.connectSocket(userInfo.userid, userInfo.username, 1));
        socket.onMsg('image_stream', data => {
            // var imgUrl = data.filename;
            // var img = new Image();
            // img.src = imgUrl;
            var blob = new Blob([data], { "type": "image\/jpeg" });
            var src = window.URL.createObjectURL(blob);
            var img = document.createElement('img');
            img.src = src;
            console.log(src)
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 300, 150);
            }
        });
    },
    beforeDestroy() {
        console.log('destroyed');
        socket.onMsg('disconnect');
    },
    methods: {
        setSocket(ctx) {
            socket.onMsg('image_stream', data => {
                var blob = new Blob([data], { "type": "image\/jpeg" });
                var src = window.URL.createObjectURL(blob);
                var img = document.createElement('img');
                img.src = src;
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, 300, 150);
                }
            });
        },
        playGame: function() {
            var that = this;
            this.$http.get('/api/index.php?app=doll&act=assign&device_id=' + this.device_id + '&platform=' + this.platform +
                '&user_id=' + this.userid + '&sign=' + this.sign + '&ts=' + this.ts).then(function(response) {
                if (response.status == 200 && response.data.done) {
                    var data = response.data.retval;
                    var canvas = document.getElementById('room-video');
                    var ctx = canvas.getContext("2d");
                    let userInfo = {
                        userid: 10000,
                        username: 'test'
                    };
                    that.time = data.time;
                    that.log_id = data.log_id;
                    that.isPlaying = true;
                    that.$toast('Ready Go !!!');
                    socket.emitMsg('start_game', { angle: that.angle });
                    that.setSocket(ctx);
                    setTimeout(function() {
                        that.timeCountDown();
                    }, 2000);
                } else {
                    that.$toast('有人在玩');
                }
            })
        },
        timeCountDown: function() {
            setTimeout(() => {
                var time = this.time;
                if (time == 0) {
                    this.actionMove(5);
                } else {
                    this.time = this.time - 1;
                    this.timeCountDown();
                }
            }, 1000)
        },
        actionMove: function(action) {
            this.action = action;
            var that = this;
            this.$http.get('/api/index.php?app=doll&act=operate&device_id=' + this.device_id + '&action=' + action +
                '&platform=' + this.platform + '&user_id=' + this.userid + '&sign=' + this.sign).then(response => {
                if (response.status == 200 && action == 5) {
                    this.isPlaying = false;
                    this.catchEnd();
                    setTimeout(() => {
                        this.$loading("正在查询结果");
                        this.checkResult();
                    }, 6000);
                }
            })
        },
        catchEnd: function() {
            this.action = '';
        },
        checkResult: function() {
            this.$http.get('/api/index.php?app=doll&act=operate_result&log_id=' + this.log_id +
                '&platform=' + this.platform + '&user_id=' + this.userid + '&sign=' + this.sign).then(response => {
                if (response.status == 200 && response.data.done) {
                    var data = response.data.retval;
                    var msg = "";
                    if (data.operate_result == '1') {
                        msg = '抓取成功';
                    } else {
                        msg = '抓取失败';
                    }
                    this.$loading.close();
                    this.$toast(msg)
                } else {
                    setTimeout(() => {
                        this.checkResult();
                    }, 1000)
                }
            })
        },
        checkoutVision: function() {
            this.angle = this.angle == 90 ? 0 : 90;
            console.log('切换视角' + this.angle);
            socket.emitMsg('switch_angle', { angle: this.angle }, {
                success: () => {
                    console.log('切换视角success');
                },
                error: () => {
                    console.log('切换视角error');
                },
            });
        }
    }
}
</script>
<style>
.room {
    width: 100%;
    min-height: 100%;
    background-color: #EC6564;
    padding-top: 0.5rem;
}

.video-camera {
    position: absolute;
    right: 0.14rem;
    bottom: 1.7rem;
    width: 0.95rem;
    height: 1.04rem;
}

.playGame_btn {
    width: 2rem;
    margin: 0.1rem auto 0;
    padding: 0.1rem;
    text-align: center;
    font-size: 0.4rem;
    color: #000000;
    background-color: #6cdd73;
    border: 0.1rem solid #ffffff;
    border-radius: 0.1rem;
}

.direction_btn_area {
    float: left;
    margin-left: 0.9rem;
    margin-top: 0.1rem;
    position: relative;
    width: 3rem;
    height: 2.5rem;
}

.direction_btn_area img {
    width: 100%;
    height: 100%;
}

.up_btn {
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0;
    left: 1rem;
}

.down_btn {
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 1.26rem;
    left: 1rem;
}

.left_btn {
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0.6rem;
    left: 0;
}

.right_btn {
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 0.6rem;
    left: 2rem;
}
</style>