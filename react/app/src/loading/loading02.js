import React ,{Component} from 'react';
import './loading.css';
import ReactDOM from 'react-dom';
let node = null
const loadingInput = {
  show (obj){
    node = document.createElement('div')
    document.body.appendChild(node)
    ReactDOM.render(<Input onOk={obj.onOk}/>,node)
  },
  hide (){
    if(node){
      ReactDOM.unmountComponentAtNode(node)
      document.body.removeChild(node)
    }
  }
}
class Input extends Component{
  constructor (props) {
    super (props);
    this.state = {
      value:''
    }
  }
  render () {
    const {
      onOk
    } = this.props
    return (
      <div className='loading'>
				<div className='loading__mask'></div>
				<div className='loading__content'>
					<input value={this.state.value}  onChange={(e)=>{this.setState({value:e.target.value})}}/>
          <button onClick ={(e)=> {
            let value = this.state.value
            onOk(value)
            this.setState({
              value:''
            })
            loadingInput.hide()
          }}>提交</button>
				</div>
			</div>
    )
  }
}
export default loadingInput;