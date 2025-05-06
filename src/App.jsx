
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import './styles/App.css'
import {Routes} from 'react-router-dom'
import { Route } from 'react-router-dom'
import NoEncontrado from './pages/NoEncontrado'

function App() {
  
  return (
    
    <div className='App'>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<NoEncontrado/>}/>
      </Routes>
    </div>
  )
}

export default App
