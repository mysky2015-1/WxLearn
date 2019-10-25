<template>
 <div class="header">
   <header>
    <ul>
      <li>
        <router-link to="/">首页</router-link>
      </li>
      <li>
        <router-link to="/News">新闻</router-link>
      </li>
      <li>
        <router-link to="/BBs">社区</router-link>
      </li>
      <li>
        <router-link to="/About/args">关于我们</router-link>
      </li>
      <li>
        <router-link to="/Login">登录</router-link>
      </li>
      <li>
        <router-link to="/Regist">注册</router-link>
      </li>
    </ul>
   </header>
 </div>
</template>
<script>
export default {
  name: 'appnav'
}
</script>
<style scoped>
ul li{
  list-style: none;
  float:left;
  padding:10px;
}
header{
  background-color:#666;
  height:45px;
}
a{
  color:#fff
}
</style>
