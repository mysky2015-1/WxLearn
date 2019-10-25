import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

// React与Es6
// @ 装饰器的用法 
// 定义一个装饰器
let loading = (Component) =>{
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
  return LoadingComponent
}

// 使用装饰器，相当于继承装饰器内部的组件
// npm install @babel/plugin-proposal-decorators  
// 这里装饰器一开始可能不被支持，需要安装以上命令，然后修改配置package.json

// "babel": {
//   "plugins": [
//     [
//       "@babel/plugin-proposal-decorators",
//       {
//         "legacy": true
//       }
//     ]
//   ],
//   "presets": [
//     "react-app"
//   ]
// },

@loading
class App extends Component {
  render () {
    return (
      <div>
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

export default App;
