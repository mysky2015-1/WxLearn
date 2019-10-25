<template>
  <div class="home">
    <h1>这是home主页{{msg}}</h1>
    <h2>这里是网站的主要欢迎页</h2>
    <h2>{{testData}}</h2>
    <button @click="jump">编程式点击跳转到了about页面</button>
    <demo></demo>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      testData: []
    }
  },
  // created 钩子用来在一个实例被创建之后执行该方法
  created () {
    this.getData();
  },
  methods: {
    jump () {
      this.$router.push('/About/args')
    },
    getData () {
      // 通过axios 别名 
      // this是指向当前vue实例，千万不能丢掉，不然会报方法或对象undefined
      // this.$http.get('/api/api/test.json').then(response => {

      //     this.testData = response.data;
      //     console.log(response.data);
      //     console.log(response.status);
      //     console.log(response.statusText);
      //     console.log(response.headers);
      //     console.log(response.config);

      // }).catch(error => {
      //     console.log(error);
      // })
      // 通过axios API 
      this.$http({
        method: 'get',
        url: '/api/test.json'
      }).then(response => {
        // console.log(response.data);
        this.testData = response.data;
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
      }).catch(error => {
        console.log(error);
      })

      // 多个请求的做法
      // function getUserAccount() {
      //   return axios.get('/user/12345');
      // }

      // function getUserPermissions() {
      //   return axios.get('/user/12345/permissions');
      // }

      // axios.all([getUserAccount(), getUserPermissions()])
      //   .then(axios.spread(function (acct, perms) {
      //     // Both requests are now complete
      // }));
    }
  }
}

</script>

<style>
</style>
