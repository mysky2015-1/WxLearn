import React ,{Component} from 'react';
import './loading.css';
import ReactDOM from 'react-dom';
let node = null
const loading = {
  show (){
    node = document.createElement('div')
    document.body.appendChild(node)
    ReactDOM.render(<Loading/>,node)
  },
  hide (){
    if(node){
      ReactDOM.unmountComponentAtNode(node)
      document.body.removeChild(node)
    }
  }
}
class Loading extends Component {
  render () {
    return (
      <div className='loading'>
				<div className='loading__mask'></div>
				<div className='loading__content'>
					loading...
				</div>
			</div>
    )
  }
}
export default loading;