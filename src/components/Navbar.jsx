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
        <li><a href="#Rutas" onClick={() => navigate("/anadirRuta")}>Rutas</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;