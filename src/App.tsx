
import './App.css'
import {  BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MemViewer from './pages/MemViewer';
import About from './pages/About';

import PrivateWrapper from './components/PrivateWrapper';

import Navbar from './components/Navbar';


// const username = signal(user_id)
// console.log(username)

function App() {

  // const username = signal(user_id)
  // console.log(username.value)


  return (
      // <HashRouter> use when upload to netlify

    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/memviewer' element={(
              <PrivateWrapper><MemViewer /></PrivateWrapper>)} /> 
          <Route path='/about' element={ <About />} />
          </Routes>
       </BrowserRouter>

  
  )
}

export default App