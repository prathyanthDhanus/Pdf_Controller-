
import Home from './Pages/home'
import ViewSinglePdf from './Pages/viewsinglepdf'
import {BrowserRouter, Routes,Route  } from 'react-router-dom'
import View from './Pages/view'
import './App.css'




function App() {
  

  return (
    <>
     
<BrowserRouter>
<Routes>
<Route path='/' element={<Home />}/>
<Route path='/view' element={<View />}/>
<Route path='/view/single/pdf/:id' element={<ViewSinglePdf />}/>

</Routes>
</BrowserRouter>

      


    </>
  )
}

export default App
