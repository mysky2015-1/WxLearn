import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import loadingInput from '../loading/loading02';
// todolist自定义组件练习
// 需要自己完成编辑的操作

class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      data:[],
      loading:false
    }
  }
  render () {
    return (
      <div className="center-div">
        <Action onAdd ={(name) => {
          let data = this.state.data
          data.push(name)
          this.setState({data})
        }}/>
        <TodoList data={this.state.data} 
        onDelete = {(index) => {
          let data = this.state.data
          data.splice(index,1)
          this.setState({data})
        }}
        onEdit = {(index) => {
          let data = this.state.data
          // 显示对应编辑框
          this.setState({data})
        }}
        onEditSure ={(index,value) => {
          let data = this.state.data
          // 把index对应的data值放到编辑区域，修改后提交
         
          this.setState({data})
        }}
        />
      </div>
    )
  }
  componentDidMount () {
    
  }
}
class Action extends Component {
  constructor (props) {
    super (props);
    this.state = {
      value:''
    }
  }
  render () {
    const { onAdd } = this.props
    return (
      <div>
        <input value={this.state.value} onChange={(e)=>{this.setState({value:e.target.value})}}/>
        <button onClick={(e)=>onAdd(this.state.value)}>提交</button>
      </div>
    )
  }
}
class TodoList extends Component {
  render () {
    const { data,onDelete,onEdit,onEditSure} = this.props
    return (
      <div>
        {
          data.map((item,index)=>(
            <ol>
            <li>
              <p key={index}>{item}</p>

              <div>
                <input key={index} value={item} />
                <button onClick={(e)=>onEditSure(index,item)}>确定修改</button>
              </div>
              <button onClick={(e)=>onDelete(index)}>删除</button>
              <button onClick={(e)=>onEdit(index)}>编辑</button>
            </li>  
            </ol>
          ))
        }
      </div>
    )
  }
}


// ----------------


export default App;
