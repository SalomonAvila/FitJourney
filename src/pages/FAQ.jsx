import React from "react";
import "../styles/FAQ.CSS";

const faqs = [
  {
    question: "¿Qué es FitJourney?",
    answer: "FitJourney es una plataforma para ayudarte a llevar un seguimiento de tus rutinas, progresos y hábitos saludables de manera sencilla y visual."
  },
  {
    question: "¿Cómo puedo registrar mis entrenamientos?",
    answer: "Puedes registrar tus entrenamientos desde el panel principal, seleccionando el tipo de actividad, duración y notas adicionales."
  },
  {
    question: "¿FitJourney es gratis?",
    answer: "Sí, puedes usar FitJourney de forma gratuita. Algunas funciones avanzadas pueden requerir una suscripción en el futuro."
  },
  {
    question: "¿Puedo usar FitJourney en mi móvil?",
    answer: "¡Por supuesto! FitJourney está optimizado para dispositivos móviles y de escritorio."
  },
  {
    question: "¿Cómo protegen mi información?",
    answer: "Tu privacidad es importante. Toda tu información se almacena de forma segura y nunca se comparte con terceros sin tu consentimiento."
  }
];

function FAQ() {
  return (
    <div className="faq-bg">
      <div className="faq-header">
        <h1>Preguntas Frecuentes <span className="faq-accent">FitJourney</span></h1>
        <p>Resuelve tus dudas sobre cómo aprovechar al máximo la plataforma.</p>
      </div>
      <div className="faq-content">
        {faqs.map((faq, idx) => (
          <div className="faq-card" key={idx}>
            <h2 className="faq-question">{faq.question}</h2>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;