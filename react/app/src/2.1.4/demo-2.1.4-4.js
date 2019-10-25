import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 观察者模式来实现组件之间的通信，不推荐，但是实在没有办法的情况下可以使用实现业务需求
class App extends Component {

  render () {
    return (
      <div>
        <Action ref="action"/>
        <List ref="list"/>
      </div>
    )
  }
  componentDidMount(){
    let actionInstance = this.refs.action
    let listInstance = this.refs.list
    actionInstance.on('add',(name)=>{
      listInstance.add(name)
    })
    actionInstance.on('del',(name)=>{
      listInstance.del(name)
    })
  }
}
class EventComponent extends Component{
  cb = {}
  on(name,cb){
    this.cb[name] = cb
  }
  off(name) {
    delete this.cb[name]
  }
  trigger(name,arg){
    this.cb[name](arg)
  }
}

class List extends EventComponent {
  constructor (props) {
    super (props);
    this.state = {
      data:[
        { name:'A',id:0},
        { name:'B',id:1},
        { name:'C',id:2},
        { name:'D',id:3},
      ]
    }
  }
  render () {
    return (
      <div>
        {this.state.data.map(item=> <p key={item.id}>{item.name}</p>)}
      </div>
    )
  }
  add(name){
    let {
      data
    } = this.state
    data.push({
      name,
      id:name
    })
    this.setState({data})
  }
  del(name){
    console.log(name)
    let {
      data
    } = this.state
    console.log(data)
    data.splice(0, 1);
    console.log(data)
    this.setState({data})
  }
}
class Action extends EventComponent {
  constructor (props) {
    super (props);
    this.state = {
      value:''
    }
  }
  render () {
    return (
      <div>
        <input value={this.state.value} onChange={(e)=>{this.setState({value:e.target.value})}}/>
        <button onClick={(e)=>{
          this.trigger('add',this.state.value)
        }}>添加</button>
        <button onClick={(e)=>{
          this.trigger('del',this.state.value)
        }}>删除</button>
      </div>
    )
  }
}

// ----------------


export default App;
