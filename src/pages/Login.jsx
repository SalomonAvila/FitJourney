import React, { useState } from 'react';
import { client } from "../API/client";
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.auth.signInWithOtp({ email });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-title">Inicia sesión</div>
        <div className="login-desc">
          Ingresa tu correo para recibir el enlace de acceso.<br />
          ¡Bienvenido de vuelta a <span style={{ color: "#a6e3e9", fontWeight: 700 }}>FitJourney</span>!
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="correo@site.com"
            id="espacioTexto"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button id="boton" type="submit">
            Enviar enlace
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;