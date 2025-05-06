
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import './styles/App.css'
import {Routes} from 'react-router-dom'
import { Route } from 'react-router-dom'
function App() {
  
  return (
    
    <div className='App'>
    <Navbar/>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
  )
}

export default App
