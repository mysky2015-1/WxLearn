import React ,{Component} from 'react';
import Icon from './react-ui/Icon/index'
import Button from './react-ui/Button/index'
import Input from './react-ui/Input/index'
import Table from './react-ui/Table/index'
// React与Es6
// 对象的解构与赋值
let dataSource=[
	{
		name:'ryan',age:'30',sex:'man',
	},
	{
		name:'ryan2',age:'31',sex:'man',
	},
	{
		name:'ryan3',age:'32',sex:'man',
	}
]
class Person { 
  constructor(name,age){
    this.name = name;
    this.age = age;
  }  
  getName(){
    return `my name is ${this.name}`
  }
  getAge(){
    return `my age is ${this.age}`
  }
}
let ppp01 = new Person('native',18)
console.log(ppp01.getAge(),ppp01.getName())

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value:'1'
    }
  }
  value = '1'

  render () {
    return (
      <div className="center-div">
        <Icon name="cheliangyiban" style={{color: 'blue' }} onClick={() => {alert('开心吗？')}} />
        <Icon name="cheliangzhihui"/>
        <Icon name="pandianshenqing"/>
        <Icon name="qingjiashenqing"/>
        <Icon name="hetongdaiban"/>
        <Icon name="shoucang"/>
        <Icon name="tongzhigonggao"/>
        <Icon name="richengguanli"/>
        <Icon name="banwenweituo"/>
        <Icon name="caigoushenqing"/>
        <Icon name="gongwenchuli"/>
        <Button type="primary" icon="shoucang" style={{color: 'yellow' }} onClick={() => {alert('快乐吗？')}} >提交</Button>
        <Input size="large" />  
        <Input  size="small" 
                value={this.state.value}
                onChange={(e)=>{
                  this.setState({
                    value: e.target.value
                  })
                }}
              />  
        <Input size="small"
               rule={/\d/}
               message="只允许输入数字"
               defalutValue={this.value}
               onChange={(e)=>{
                 this.value = e.target.value
               }}
         />  
        <Table 
          columns={[
            {title: '姓名', dataIndex:"name",key: 'name', render(text, item, index){
              return <div><a href='#'>{text} ? {item.age} + {index}</a></div>
            }},
            {title: '年龄', dataIndex:"age",key: 'age'},
            {title: '性别', dataIndex:"sex",key: 'sex'},
          ]}
          dataSource={dataSource}
        ></Table>

      </div>
    )
  }
  componentDidMount () {
    
  }
}
// ----------------


export default App;
