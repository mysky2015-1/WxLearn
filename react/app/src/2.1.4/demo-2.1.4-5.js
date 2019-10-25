/* eslint-disable react/jsx-pascal-case */
import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 思考题  层级较深的组件通信
class App extends Component{
  state = {
    msg: 'start'
  };
  transferMsg(msg) {
    this.setState({
    msg
  })
  }
  render() {
    return(
      <div>
        <p>child msg: {this.state.msg}</p>
        <Child_1 transferMsg = {msg => this.transferMsg(msg)} />
      </div>
    )
  }
}
class Child_1 extends Component{
  componentDidMount() {
  setTimeout(() => {
    this.props.transferMsg('end')
  }, 1000)
  }
  render() {
    return (
      <div>
        <p>child_1 component</p>
        <Child_1_1 transferMsg = {msg => this.props.transferMsg(msg)} />
      </div>
    )
  }
}
class Child_1_1 extends Component{
  componentDidMount() {
  setTimeout(() => {
    this.props.transferMsg('Child_1_1_change')
    console.log(this.props)
  }, 3000)
  }
  render() {
    return (
      <div>
        <p>child_1_1 component</p>
      </div>
    )
  }
}
  
export default App;
