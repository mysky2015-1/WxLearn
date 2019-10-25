import React ,{Component} from 'react';


// 函数式组件
let list = 
  <div className="list">
    <ul>
      <li>*1</li>
      <li>*2</li>
      <li>*3</li>
    </ul>
  </div>

// 练习实现react组件练习一
class App extends Component {
  render () {
    return (
      <div>
        App
        <Apptestlist name={'color-red'}/>
        <Apptestlist name={'color-green'}/>
        {list}
        {list}
      </div>
    )
  }
}
class Apptestlist extends Component {
  render () {
    return (
      <div className={this.props.name}>
        <ul>
          <li>{this.props.name}</li>
          <li>*2</li>
          <li>*3</li>
        </ul>
      </div>
    )
  }
  componentDidMount () {
    console.log('组件挂载--');
  }
  componentWillUpdate (nextProps,nextState) {
    console.log('组件即将被更新--');
  }
  componentWillUnmount () {
    console.log('组件即将被销毁-');
  }
}
// ----------------


export default App;
