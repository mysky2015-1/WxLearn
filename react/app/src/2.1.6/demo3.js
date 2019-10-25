import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import loading from '../loading/loading';

// React与Es6
// 老师说这样写很优雅，其实就是把东西藏起来了，就像整理家一样，把该藏的收起来，家里有干净了

class LoadingComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }
  render() {
    const {
      loading
    } = this.state
    return (
      <div>
        {loading?'loading...':''}
      </div>
    )
  }
  showLoading(){
    this.setState({
      loading:true
    })
  }
  hideLoading(){
    this.setState({
      loading:false
    })
  }
}
class App extends LoadingComponent {
  render () {
    return (
      <div>
        {super.render()}
        app
      </div>
    )
  }
  componentDidMount(){
    this.showLoading()
    // 用继承的方式，子类中可获取父类中的方法
    setTimeout(() => {
      this.hideLoading()
    }, 3000)
  }
}
// ----------------

// 拦截器，get获取最新的状态，set来设置,主要用来掩饰拦截器是如何工作的
let obj = new Proxy(
  {
    a:10,b:20
  },
  {
    get:function(target,key){
      console.log('get',key)
      return target[key]* 10
    },
    set:function(target,key,value){
      // Reflect 相当于ES6里的Object，es6d的新方法它都有
      return Reflect.set(target,key,value)
    }
  }
)
// window.obj = obj
// 可以在控制台尝试
// --------------------------


export default App;
