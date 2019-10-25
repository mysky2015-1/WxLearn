<template>
  <div class="about">
    <h1>{{msg}}</h1>
    <h2> 关于我们的页面，主要讲述一些自己的话 <br>路由参数是：{{agrs}}</h2>
  </div>
</template>

<script>
export default {
  name: 'about',
  props: ['agrs'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {

  }
}
</script>

<style>
</style>
