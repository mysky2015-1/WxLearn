import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import loadingInput from '../loading/loading02';
// ReactDOM.unmountComponentAtNode(document.getElementById('root'))
// reactDom与表单
// 不要为了不使用dom而避免使用dom操作

class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      data:[],
      loading: true
    }
  }
  render () {
    return (
      <div className="center-div">
        App
        {/* {this.state.loading && <Loading/>} */}
        {this.state.data.map(item=><p key={item.id}>{item.name}</p>)}
      </div>
    )
  }
  componentDidMount () {
    // setTimeout(() => {
      this.setState({
        data:[
          { name:'A',id:0},
          { name:'B',id:1},
          { name:'C',id:2},
          { name:'D',id:3}
        ]
      })
    // }, 3000);
    loadingInput.show({ 
      onOk:(value) =>{
        alert('hello:'+ value)
        let { data } = this.state
        data.push({
          name:value,
          id:value
        })
        this.setState({data})
        console.log(this.state.data)
      }
    })
  }
}


// ----------------


export default App;
