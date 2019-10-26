import React,{Component} from 'react'
import ReactDOM from 'react-dom';
// 请写一个满足以下要求的confirm方法组件：
// （1）能在任意组件(示例如下)的componentDidMount生命周期中挂载，并返回一个promise；
// （2）能通过该promise返回的结果判断confirm组件是否成功挂载。
// async componentDidMount() {
//   let res = await confirm("确定删除吗")
//   if(res) {
//       console.log("是")
//   } else {
//       console.log("否")
//   }
// }
class Confirm extends Component{
  constructor(props) {
    super(props);
    this.state = { status: null };
  }
  render() {
		return (
			<div className="confirm">
        这是confirm~
        <p>{this.props.message}</p>
			</div>
		);
	}
  componentDidMount(){
    this.setState({ status: 'DidMount' }); 
    console.log('Confirm挂载成功~',this.props.message)
  }
  componentWillUnmount() {
    this.setState({ status: 'WillUnmount' });
  }
}
const confirm = message=> {
  return new Promise(resolve => {
      setTimeout(() => {
        resolve(ReactDOM.render(
          <Confirm message={message}/>,
          document.getElementById('root')
        ))
      },3000)
  })
}

class App extends Component{
  render() {
		return (
			<div>
				app
			</div>
		);
	}
  async componentDidMount() {
    let res = await confirm("确定删除吗")
    console.log('confirm组件是否挂载成功返回值',res)
    if(res) {
        console.log('confirm组件是否挂载成功: 是')
    } else {
        console.log('confirm组件是否挂载成功: 否')
    }
  }
}

export default App
