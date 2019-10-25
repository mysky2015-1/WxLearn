<template>
  <div id="app">
    <appnav></appnav>
     <img src="./assets/logo.png">
    <!-- 路由匹配的组件讲渲染在这里 -->
    <!-- <keep-alive> 标签内置组件用来缓存路由的 -->
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import appnav from './components/Appnav'

export default {
  name: 'App',
  components: {
    appnav
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.fade-enter-active,.fade-leave-active{
  transition:all .3s
}
.fade-enter,.fade-leave-to{
  opacity: 0;
}
</style>
