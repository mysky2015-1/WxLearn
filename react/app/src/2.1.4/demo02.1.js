import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 生命周期
// 练习实现react组件练习一
class App extends Component {
  getChildContext() {
		return {color: "purple"};
	}
  constructor (props) {
    // 当数据发生变化的时候
    super (props)
    this.state ={
      name:'zm-react'
    }
  }
  render () {
    console.log('App--render--');
    return (
      <div>
        App
        <Test01 name={this.state.name + '-test'}/>
      </div>
    )
  }
  componentDidMount () {
    console.log('App组件挂载--');
    window.app = this
  }
  componentWillUpdate (nextProps,nextState) {
    console.log('App组件即将被更新--');
  }
  componentDidUpdate (nextProps,nextState) {
    console.log('App--componentDidUpdate--');
  }
  componentWillUnmount () {
    console.log('App组件即将被销毁-');
  }
}
App.childContextTypes = {
	color: PropTypes.string
}
class Test01 extends Component {
  render () {
    return (
      <div>
        <ul>
          <li>{this.props.name}</li>
          <li>*2</li>
          <li>*3</li>
          {this.props.name && <Test02 name={this.props.name + '-zmgrand'}/>}
          
        </ul>
      </div>
    )
  }
  componentDidMount () {
    console.log('test01组件挂载--');
  }
  componentWillUpdate(prevProps, prevState) {
		console.log('test01 will update')
	}
	componentDidUpdate(prevProps, prevState) {
		console.log('test01 did update')
	}
	componentWillUnmount() {
		console.log('test01 unmount')
	}
}

class Test02 extends Component {
  render () {
    console.log('Test02--render--');
    return (
      <div>
        {this.props.name}--{this.context.color}
      </div>
    )
  }
  componentDidMount () {
    console.log('test02组件挂载--');
  }
  componentWillUpdate(prevProps, prevState) {
		console.log('test02 will update')
	}
	componentDidUpdate(prevProps, prevState) {
		console.log('test02 did update')
	}
	componentWillUnmount() {
		console.log('test02 unmount')
	}
}
Test02.contextTypes = {
	color: PropTypes.string
};
// ----------------


export default App;
