import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import InformacionPerfil from './pages/InformacionPerfil'
import './styles/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import NoEncontrado from './pages/NoEncontrado';
import { client } from './API/client';

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
        {/* Ruta raíz redirige según el estado de autenticación */}
        <Route
          path="/"
          element={estaAutenticado ? <Navigate to="/informacionPerfil" /> : <Navigate to="/login" />}
        />
        {/* Ruta para la información del perfil */}
        <Route
          path="/informacionPerfil"
          element={estaAutenticado ? <InformacionPerfil /> : <Navigate to="/login" />}
        />
        {/* Ruta para el login */}
        <Route
          path="/login"
          element={!estaAutenticado ? <Login /> : <Navigate to="/informacionPerfil" />}
        />
        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </div>
  );
}

export default App;