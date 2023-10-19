import { useState } from 'react'
import Home from './Pages/home'
import CopyHome from './Pages/copyHome'
import {BrowserRouter, Routes,Route  } from 'react-router-dom'

import './App.css'


function App() {
  

  return (
    <>
     
<BrowserRouter>
<Routes>
<Route path='/' element={<Home />}/>
<Route path='/copy' element={<CopyHome />}/>


</Routes>
</BrowserRouter>

      


    </>
  )
}

export default App
