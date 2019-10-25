import React from 'react'
const data =['a','b','c','d']
const datastring ='我是字符串？react可以渲染我~'
const datadiv =<div>我是dom,react可以渲染我~<ul><li>我是domli01</li><li>我是domli02</li></ul></div>
// const obj ={a:5,b:6}]
const showTitle = true
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez',
};

const element = <h1>Hello, {formatName(user)}!</h1>;

// ReactDOM.render(element, document.getElementById('root'));
const Test02List = () =>{
  return (
    <div>
      <h4>list</h4>
      {element}
      {data.map(item => <span key={item.toString()} className="tag">{item}</span>)}
      <h4>可以渲染数组？</h4>
      <div>{data}</div>
      <div><h4>可以渲染字符串</h4>{datastring}</div>
      <div><h4>可以渲染dom</h4>{datadiv}</div>
      <h4>不可以渲染obj</h4>
      <h4>条件渲染dom</h4>
      {data.map((item,index) => {
        if(index%2===1){
          return null
        }
        return (
          <span key={index} className="tag">{item}</span>
        )
      })}
      {showTitle && <h3>我是根据条件渲染出来的title01</h3>}
      {showTitle ? <h3>我是根据条件渲染出来的title02</h3>: <p>no title</p>}
    </div>
  )
}

export default Test02List