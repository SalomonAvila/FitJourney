import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {

  const navigate = useNavigate()
 
  return (
    <nav>
      <h1>FitJourney</h1>
      <ul>
        <li><a href="#Inicio" onClick={() => navigate("/")}>Inicio</a></li>
        <li><a href="#Perfil" onClick={() => navigate("/informacionPerfil")}>Perfil</a></li>
        <li><a href="#Crear rutas" onClick={() => navigate("/anadirRuta")}>Crear Rutas</a></li>
        <li><a href="#Ver rutas" onClick={() => navigate("/verRuta")}>Ver Rutas</a></li>
        <li><a href="#Preguntas frecuentes" onClick={() => navigate("/FAQ")}>FAQ</a></li>
        <li><a href="#Reporte" onClick={() => navigate("/reporte")}>Reportar Error</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;