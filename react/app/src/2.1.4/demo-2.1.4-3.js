import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 组件间传值之父组件到子组件的通信，即父组件操作子组件里的数据
class App extends Component {

  render () {
    return (
      <div>
        <List ref="list"/>
      </div>
    )
  }
  componentDidMount(){
    window.app = this
    // console.log('父组件获取子组件中的值：',this.refs.list.state)
    // this.refs.list.clear()  清空列表
  }
}

class List extends Component {
  constructor (props) {
    super (props);
    this.state = {
      data:[
        { name:'A',id:0},
        { name:'B',id:1},
        { name:'C',id:2},
        { name:'D',id:3}
      ]
    }
  }
  render () {
    return (
      <div>
        {this.state.data.map(item => <p key={item.id}>{item.name}</p>)}
      </div>
    )
  }
  clear () {
    this.setState({
      data:[]
    })
  }
}

// ----------------


export default App;
