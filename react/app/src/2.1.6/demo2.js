import React ,{Component} from 'react';
import PropTypes from 'prop-types'
import loading from '../loading/loading';

// React与Es6
// 老师说这样写很优雅，其实就是把东西藏起来了，就像整理家一样，把该藏的收起来，家里有干净了

class LogComponent extends Component {
  componentWillUnmount (){
    console.log('app','unmount')
  }
}
class App extends LogComponent {
  render () {
    return (
      <div>
        app
      </div>
    )
  }
}
// ----------------


export default App;
