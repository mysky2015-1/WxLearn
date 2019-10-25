/* eslint-disable react/jsx-pascal-case */
import eventProxy from 'lib/eventProxy'
import React ,{Component} from 'react';
// 观察者模式 调试有问题
class App extends Component{
  render() {
    return (
      <div>
        <Child_1 />
        <Child_2 />
      </div>
    )
  }
}
// componentDidUpdate 与 render 方法与上例一致
class Child_1 extends Component{
  componentDidMount() {
    setTimeout(() => {
      // 发布 msg 事件
      eventProxy.trigger('msg', 'end');
    }, 1000);
  }
}
// componentDidUpdate 方法与上例一致
class Child_2 extends Component{
  state = {
    msg: 'start'
  };
  componentDidMount() {
    // 监听 msg 事件
    eventProxy.on('msg', (msg) => {
      this.setState({
        msg
      });
    });
  }
  render() {
    return <div>
    <p>child_2 component: {this.state.msg}</p>
    </div>
  }
}
export default App;