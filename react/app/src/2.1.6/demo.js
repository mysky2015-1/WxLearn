import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import loading from '../loading/loading';

// React与Es6
// 对象的解构与赋值

class App extends Component {
  constructor (props) {
    super (props);
    this.state = {
      user:{
        name:'zm',
        age:'18',
        lesson:'React'
      }
    }
  }
  render () {
    let {
      lesson,
      name,
      age
    } = this.state.user
    return (
      <div className="center-div">
        <User name={name} age={age} lesson={lesson} style={{color:'red'}} onClick={()=>{
          alert('hello react')
        }}/>
      </div>
    )
  }
  componentDidMount () {
    
  }
}
class User extends Component {
  render () {
    const {
      name,
      age,
      lesson,
      ...rest
    } = this.props
    return (
      <div {...rest}>
        {name}-{age}-{lesson}
      </div>
    )
  }
}


// ----------------


export default App;
