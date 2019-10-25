import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import News from '@/components/News'
import BBs from '@/components/BBs'
import About from '@/components/About'
import Login from '@/components/Login'
import Regist from '@/components/Regist'

Vue.use(Router)

export default new Router({
  // 路由地址都是以"#" 形式展示的，但有些时候，我们希望路由地址中不出现”#“，那该怎么办呢
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/News',
      name: 'News',
      component: News
    },
    {
      path: '/BBs/:id',
      name: 'BBs',
      component: BBs
    },
    {
      path: '/About/:agrs',
      name: 'About',
      props: true,
      component: About
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Regist',
      name: 'Regist',
      component: Regist
    }
  ]
})
