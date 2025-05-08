
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import './styles/App.css'
import {Routes} from 'react-router-dom'
import { Route } from 'react-router-dom'
import NoEncontrado from './pages/NoEncontrado'
import { client } from './API/client'

function App() {

  const estaAutenticado = () => {
    const user = client.auth.getUser()
    return !!user;
  }


  return (
    
    <div className='App'>
    <Navbar/>
      <Routes>
        {/* Redirige al login si no está autenticado */}
        <Route
          path="/"
          element={isAuthenticated() ? <Home /> : <Navigate to="/login" />}
        />
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<NoEncontrado/>}/>
      </Routes>
    </div>
  )
}

export default App
