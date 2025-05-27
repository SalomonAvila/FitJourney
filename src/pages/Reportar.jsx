import React, { useState } from "react";
import { client } from "../API/client";
import "../styles/Reportar.css";

function Reportar() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data: authData, error: authError } = await client.auth.getUser();
      if (authError || !authData?.user) {
        setError("Debes iniciar sesión para enviar un reporte.");
        return;
      }
      const userId = authData.user.id;
      const { error: insertError } = await client
        .from("reportes_errores")
        .insert({
          idusuario: userId,
          asunto: asunto,
          descripcion: mensaje,
        });
      if (insertError) {
        setError("No se pudo enviar el reporte. Intenta de nuevo.");
        return;
      }
      setEnviado(true);
      setAsunto("");
      setMensaje("");
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="reportar-bg">
      <div className="reportar-header">
        <h1>Reportar <span className="reportar-accent">Error</span></h1>
        <p>¿Encontraste un problema? Cuéntanos para poder mejorar FitJourney.</p>
      </div>
      <div className="reportar-main-container">
        {enviado ? (
          <div className="reportar-exito">
            ¡Gracias por tu reporte! Lo revisaremos lo antes posible.
          </div>
        ) : (
          <form className="reportar-form" onSubmit={handleSubmit}>
            <label htmlFor="asunto" className="reportar-label">
              Asunto:
            </label>
            <input
              id="asunto"
              className="reportar-input"
              type="text"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
              maxLength={100}
              placeholder="Ejemplo: Error al guardar ruta"
            />
            <label htmlFor="mensaje" className="reportar-label">
              Descripción del error:
            </label>
            <textarea
              id="mensaje"
              className="reportar-textarea"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              maxLength={600}
              placeholder="Explica brevemente el error que encontraste..."
            />
            <button
              className="reportar-btn"
              type="submit"
              disabled={!asunto.trim() || !mensaje.trim()}
            >
              Enviar reporte
            </button>
            {error && <div className="reportar-error">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Reportar;