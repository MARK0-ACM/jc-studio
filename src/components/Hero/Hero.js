import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css'; // Importamos sus estilos

const Hero = () => {
  return (
    // Usamos <section> para semántica HTML
    <section id="inicio" className="hero-section">
      <div className="hero-content">
        <h1>Bienvenido a JC Studio</h1>
        <p>Tu visión, nuestro arte. Servicios profesionales para [Tu Servicio].</p>
        
        {/* Este es el botón "Call to Action" principal */}
        <Link to="/citas" className="btn-cta-main">
          Agenda tu cita ahora
        </Link>
      </div>
    </section>
  );
};

export default Hero;