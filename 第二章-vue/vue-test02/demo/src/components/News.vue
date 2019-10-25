<template>
  <div class="news">
    <h2>这是新闻列表页</h2>
    <ul>
      <li v-for="msg in msglist" v-bind:key="msg">{{msglist}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'news',
  data () {
    return {
      msglist: [
        'apple',
        'banana',
        'pear',
        'orange'
      ]
    }
  }
}
</script>

<style>
</style>
