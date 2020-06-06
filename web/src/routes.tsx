import React from 'react'
import { Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'


const Routes = ()=>{
  return (
    <BrowserRouter>
      <Route exact component={Home} path="/"  ></Route>
      <Route component={CreatePoint} path="/create-point" ></Route>
    </BrowserRouter>
  )
}

export default Routes;