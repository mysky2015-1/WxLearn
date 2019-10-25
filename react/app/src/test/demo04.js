import React ,{Component} from 'react';
class App extends Component{
  state = {
      num: 1
  }
  render() {
      return (
          <div>
              sss
          </div>
      );
  }
  componentDidUpdate(prevProps, prevState) {
      console.log(this.state.num)
  }
  componentDidMount() {
      let { num } = this.state
      this.setState({
          num: ++num
      })
      this.setState({
          num: ++num
      })
  }
}
export default App;