<template>
  <div class="login">
    <h1>{{msg}}</h1>
    <h2>这是个login页面</h2>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      msg: '注册需要加一下用户，密码等信息'
    }
  }
}
</script>
