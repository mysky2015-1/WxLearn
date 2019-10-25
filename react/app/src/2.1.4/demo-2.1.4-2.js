import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 组件间传值之todolist 子组件到父组件的通信，老师推荐我们经常使用这个方式来写react，不要使用父到子或者子组件之间的通信
class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      data:[
        { name:'A',id:'0'},
        { name:'B',id:'1'},
        { name:'C',id:'2'},
        { name:'D',id:'3'},
      ],
      value:''
    }
  }
  render () {
    return (
      <div className="center-div">
        <Action addItem={(value)=>{
          let {data} = this.state
          data.push({
            name: value,
            id: value
          })
          this.setState({
            data
          })
        }}/>
        <List data={this.state.data}/>
      </div>
    )
  }
}

class List extends Component {
  render () {
    return (
      <div>
        {this.props.data.map(item=> <p key="item.id">{item.name}</p>)}
      </div>
    )
  }
}
class Action extends Component {
  constructor(props){
    super(props);
    this.state={
      value:''
    }
  }
  render () {
    return (
      <div>
        <input value={this.state.value}  onChange={(e)=>{
          this.setState({
            value:e.target.value
          })
        }}/> 
        <button  onClick={()=>{
          this.props.addItem(this.state.value)
          this.setState({
            value:''
          })
        }}>提交</button>
      </div>
    )
  }
}
// ----------------


export default App;
