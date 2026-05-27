import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section id="inicio" className="hero-section">

      {/* Ornamentos decorativos circulares */}
      <div className="hero-ornament"></div>
      <div className="hero-ornament hero-ornament-2"></div>

      <div className="hero-content">

        {/* Etiqueta superior */}
        <div className="hero-eyebrow">Estudio de Estética & Belleza</div>

        {/* Título */}
        <h1>
          <span className="hero-brand">JC Studio</span>
          <em>Tu estilo, nuestra pasión.</em>
        </h1>

        {/* Descripción */}
        <p>
          Especialistas en micropigmentación, botox y tratamientos estéticos de alta gama.
          Cada servicio, una obra de arte.
        </p>

        {/* Botones */}
        <div className="hero-actions">
          <Link to="/citas" className="btn-cta-main">
            Agendar Cita Ahora
          </Link>
          <Link to="/galeria" className="btn-cta-secondary">
            Ver Galería
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">500+</span>
            <span className="hero-stat-label">Clientes</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">8+</span>
            <span className="hero-stat-label">Servicios</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">5★</span>
            <span className="hero-stat-label">Calificación</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;