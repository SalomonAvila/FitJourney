import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { client } from "../API/client";

function Home() {
  const [datosDeUsuario, establecerDatos] = useState(null);
  const navigate = useNavigate();

  const obtenerDatos = async () => {
    const { data, error } = await client.auth.getUser();
    if (error) {
      console.log("Error, revisa el codigo");
    } else {
      establecerDatos(data.user);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    try {
      await client.auth.signOut();
      establecerDatos(null);
    } catch (error) {
      console.log("Un error cerrando sesion");
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const logIn = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="home-bg">
      <header className="home-header">
        <div className="home-logo-anim">
          <span className="home-logo">🏃‍♂️</span>
          <div className="home-logo-shadow"></div>
        </div>
        <h1>
          Bienvenido a <span className="home-accent">FitJourney</span>
        </h1>
        <p>Tu plataforma para rutas deportivas personalizadas</p>
      </header>

      <div className="home-content-wrapper">
        <div className="home-main-container">
          <div className="home-info-extra">
            FitJourney te ayuda a planear, guardar y visualizar tus rutas
            deportivas favoritas.
            <br />
            ¡Empieza a registrar tus recorridos y lleva tu entrenamiento al
            siguiente nivel!
          </div>
          <div className="home-card fadeInUp">
            <h2 className="home-subtitle">
              {datosDeUsuario
                ? `¡Hola, ${datosDeUsuario.email || "usuario"}!`
                : "Inicia sesión para comenzar"}
            </h2>
            <div className="home-btn-group">
              {datosDeUsuario ? (
                <form onSubmit={logOut}>
                  <button className="home-btn home-btn-main">
                    Cerrar sesión
                  </button>
                </form>
              ) : (
                <form onSubmit={logIn}>
                  <button className="home-btn home-btn-main">
                    Iniciar sesión
                  </button>
                </form>
              )}
            </div>
          </div>
          <ul className="home-benefits">
            <li>✨ Guarda tus rutas favoritas</li>
            <li>📍 Visualiza tus recorridos en el mapa</li>
            <li>🏆 Lleva el control de tu progreso</li>
            <li>🔒 Tu información siempre segura</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;
