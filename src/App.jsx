import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import InformacionPerfil from './pages/InformacionPerfil'
import AnadirRuta from './pages/AnadirRuta';
import VerRuta from './pages/VerRuta';
import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import NoEncontrado from './pages/NoEncontrado';
import { client } from './API/client';
import PruebaMapa from './pages/PruebaMapa';

function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(null);

  useEffect(() => {
    const revisarAutenticacionSupabase = async () => {
      const { data: { user } } = await client.auth.getUser();
      setEstaAutenticado(!!user);
    };

    revisarAutenticacionSupabase();
  }, []);

  if (estaAutenticado === null) {
    return <div style={{ color: 'white' }}>Cargando...</div>;
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home estaAutenticado={estaAutenticado} />} 
        />
        <Route
          path="/informacionPerfil"
          element={estaAutenticado ? <InformacionPerfil /> : <Login />}
        />
        <Route
          path="/login"
          element={!estaAutenticado ? <Login /> : <InformacionPerfil />}
        />
        <Route
          path="/anadirRuta"
          element={estaAutenticado ? <AnadirRuta /> : <Login/>}/>
        <Route 
          path="/verRuta"
          element={estaAutenticado ? <VerRuta /> : <Login/>}/>
        <Route path="/mapa"element={<PruebaMapa/>}/>
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </div>
  );
}

export default App;