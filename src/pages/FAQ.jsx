import React from "react";
import "../styles/FAQ.css";

const faqs = [
  {
    question: "¿Qué es FitJourney?",
    answer: "FitJourney es una innovadora plataforma web desarrollada por estudiantes apasionados por el ciclismo. A través de esta herramienta, podrás diseñar rutas personalizadas según tus preferencias y necesidades, además de consultar diferentes métricas relacionadas con tu recorrido. Nuestro objetivo es acompañarte en cada paso de tu viaje fitness."
  },
  {
    question: "¿Cómo puedo registrar mis entrenamientos?",
    answer: "Para registrar tus entrenamientos, dirígete a la pestaña de 'Crear Rutas' ubicada en la barra de navegación principal. Al hacer clic en esta opción, se desplegará un menú que te permitirá definir el nombre de la ruta, así como la cantidad de paradas o puntos que deseas incluir en ella. Es importante tener en cuenta que esta funcionalidad está disponible únicamente si tienes una sesión iniciada, ya que requiere el acceso a tu perfil personal para guardar los datos correctamente."
  },
  {
    question: "¿FitJourney es gratis?",
    answer: "Sí, actualmente FitJourney está disponible de forma totalmente gratuita para todos los usuarios. Nuestro propósito es brindar una herramienta accesible y útil para toda la comunidad ciclista. Sin embargo, en el futuro podríamos incorporar funciones adicionales más avanzadas que podrían requerir una suscripción o membresía premium, con el fin de mejorar y sostener el servicio."
  },
  {
    question: "¿Puedo usar FitJourney en mi móvil?",
    answer: "En este momento, te recomendamos utilizar FitJourney preferiblemente desde un navegador web en un dispositivo de escritorio o portátil, ya que la interfaz actual no está completamente optimizada para móviles. Somos conscientes de esta limitación y estamos trabajando para mejorar la experiencia en dispositivos móviles en futuras versiones de la plataforma."
  },
  {
    question: "¿Cómo protegen mi información?",
    answer: "Nos tomamos muy en serio la privacidad y la seguridad de tu información. Todos los datos que nos proporcionas se almacenan cuidadosamente en una base de datos protegida, con estrictas medidas de control y acceso restringido. Nuestro compromiso es garantizar altos niveles de seguridad para que tus datos personales y de entrenamiento estén siempre resguardados y seguros."
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