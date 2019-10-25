<template>
  <div class="bbs-div">
    <h1>{{msg}}</h1>
    <h2>这是个bbs论坛页面，我们可以获取到当前用户从url里传过来的ID{{ $route.params.id }}</h2>
  </div>
</template>

<script>
export default {
  name: 'BBs',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>
</style>
