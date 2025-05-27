import React, { useState } from "react";
import "../styles/Reportar.css";

function Reportar() {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    /**
     * Para hacer despues, integrar con la base de datos cuando
     * esté terminada
     */
    setEnviado(true);
    setAsunto("");
    setMensaje("");
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
          </form>
        )}
      </div>
    </div>
  );
}

export default Reportar;