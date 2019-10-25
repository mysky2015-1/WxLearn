/* eslint-disable react/jsx-pascal-case */
import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 思考题  兄弟组件之间的通信，通过改变父组件里的值而改变
class App extends Component{
  state = {
    msg: 'start'
  };
  transferMsg(msg) {
    this.setState({
    msg
  });
  }
  componentDidUpdate() {
    console.log('Parent update');
  }
  render() {
    return (
      <div>
      <Child_1 msg = {this.state.msg} transferMsg = {msg => this.transferMsg(msg)} />
      <Child_2 msg = {this.state.msg} />
      </div>
    )
  }
}
class Child_1 extends Component{
  componentDidMount() {
    setTimeout(() => {
      this.props.transferMsg('end')
    }, 1000);
  }
  componentDidUpdate() {
    console.log('Child_1 update');
  }
  render() {
    return <div>
    <p>child_1 component:{this.props.msg}</p>
    </div>
  }
}
class Child_2 extends Component{
  componentDidUpdate() {
    console.log('Child_2 update');
  }
  render() {
    return <div>
    <p>child_2 component: {this.props.msg}</p>
    <Child_2_1 {...this.props}/>
    </div>
  }
}
class Child_2_1 extends Component{
  componentDidUpdate() {
    console.log('Child_2_1 update');
  }
  render() {
    return <div>
    <p>child_2_1 component: {this.props.msg}</p>
    </div>
  }
} 
  
export default App;
