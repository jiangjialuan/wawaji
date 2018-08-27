<template>
  <div class="footer">
    <router-link class="tab" :class="active1" to="/">主页</router-link>
    <router-link class="tab" :class="active2" to="/mywawa">我的娃娃</router-link>
    <router-link class="tab" :class="active3" to="/user-center">个人中心</router-link>
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        active1: '',
        active2: '',
        active3: '',
      }
    },
    props: ['selected'],
    created: function () {
      switch (this.selected) {
        case 1: {
          this.active1 = 'active';
          break;
        };
        case 2: {
          this.active2 = 'active';
          break;
        };
        case 3: {
          this.active3 = 'active';
          break;
        };
      }
    },
    methods: {},
  }
</script>
<style lang="less" scoped>
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
</style>
