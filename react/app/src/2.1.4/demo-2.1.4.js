import React ,{Component} from 'react';
import PropTypes from 'prop-types'
// 组件间传值之小闹钟，
// 老师留了一个小作业，即自己设计一个业务，自由实现当闹钟响起时，使另外一个组件实现某种操作
class App extends Component {
  render () {
    return (
      <div>
        <Clock time={12} onWeekUp ={()=>{ alert('起床啦~')}} onSleepUp ={()=>{ alert('睡觉啦~')}} />
      </div>
    )
  }
}

class Clock extends Component {
  render () {
    let {
      time,
      onWeekUp,
      onSleepUp
    } = this.props
    if(time === 9){
      onWeekUp()
    }
    if(time === 21){
      onSleepUp()
    }
    return (
      <div>
        clock
      </div>
    )
  }
}
// ----------------


export default App;
