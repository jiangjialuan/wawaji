<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'app'
  }

</script>
<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  @charset "UTF-8";
  body,
  div,
  dl,
  dt,
  dd,
  ul,
  ol,
  li,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  pre,
  form,
  fieldset,
  input,
  textarea,
  figure,
  p,
  blockquote,
  th,
  td {
    margin: 0;
    padding: 0;
  }

  ol,
  ul {
    list-style: none;
  }

  ul,
  ol {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }

  input {
    -webkit-appearance: none;
    font-size: inherit;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .flex-item {
    justify-content: center;
  }

  a,
  textarea,
  input {
    outline: none;
  }

  body {
    margin: 0;
    font-family: "Helvetica Neue", Helvetica, Microsoft Yahei, Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
    background-color: transparent;
    font-size: 0.28rem;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

  }

  /*
  750px 设计图
  750px => 1rem = 100px
  750px => 750px = 100vw
  750px => 1px = 100/750 vw = 0.1333333 vw
  750px => 1rem = 100px = 0.138889*100 vw = 13.33333vw
  因：480px, 320px 等 都是由 720px 推导出来的
  故：1rem = 13.8889vw 是通用的
  不应无限缩小放大
  */

  html {
    -webkit-tap-highlight-color: transparent;
    font-size: 13.333333vw;
  }

  @media (min-width: 750px) {
    html {
      font-size: 100px;
    }
  }

  /* 320px => 1rem = 44.444444px */

  @media (max-width: 320px) {
    html {
      font-size: 42.666666px;
    }
  }

  /* set border-box */

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  i {
    font-style: normal;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .hidden {
    display: none !important;
  }

  nav {
    display: flex;
    width: 100%;
    overflow: hidden;
    height: .88rem;
    background: #fff;
    .nav-item {
      flex: 1;
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      a {
        font-size: .3rem;
        color: #333;
        padding: .12rem 0 .2rem;
        outline: none;
        &.active {
          color: #ec6564;
          border-bottom: .03rem solid #ec6564;
        }
      }
    }
  }

</style>
