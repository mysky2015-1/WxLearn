import React from 'react';
import Test02List from '../test02/list';
import Test02Filter from '../test02/filter';

// 函数式组件
const App = () =>{
  return (
    <div>
      <h2>Apptest02</h2>
      <Test02List />
      <Test02Filter />
    </div>
  )
}


export default App;
