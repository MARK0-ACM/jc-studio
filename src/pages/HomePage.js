import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import { apiUrl } from '../api';

const HomePage = () => {
  const [fotosRecientes, setFotosRecientes] = useState([]);
  const [serviciosDestacados, setServiciosDestacados] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resFotos = await axios.get(apiUrl('api/portafolio'));
        setFotosRecientes(resFotos.data.slice(0, 3));

        const resServicios = await axios.get(apiUrl('api/servicios'));
        setServiciosDestacados(resServicios.data.slice(0, 3));
      } catch (error) {
        console.error('Error cargando datos del home', error);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="homepage">

      {/* ── HERO ── */}
      <section className="hero">
        {/* Anillos decorativos */}
        <div className="hero-ring hero-ring-1"></div>
        <div className="hero-ring hero-ring-2"></div>
        <div className="hero-ring hero-ring-3"></div>

        <div className="hero-body">
          <div className="hero-eyebrow">Estudio de Estética &amp; Belleza</div>

          <h1>
            <span className="hero-brand">JC Studio</span>
            <span className="hero-subtitle-text">Tu estilo, nuestra pasión.</span>
          </h1>

          <p className="hero-desc">
            Especialistas en micropigmentación, botox y tratamientos estéticos de alta gama.
            Cada servicio, una obra de arte.
          </p>

          <div className="hero-actions">
            <Link to="/citas" className="btn-primary">Agendar Cita Ahora</Link>
            <Link to="/galeria" className="btn-outline">Ver Galería</Link>
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-number">Zamora</span>
              <span className="hero-stat-label">Michoacán</span>
            </div>
            <div>
              <span className="hero-stat-number">8+</span>
              <span className="hero-stat-label">Servicios</span>
            </div>
            <div>
              <span className="hero-stat-number">4.5★</span>
              <span className="hero-stat-label">Calificación</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section className="services-preview-section">
        <span className="section-eyebrow">Lo que ofrecemos</span>
        <h2>Servicios Destacados</h2>
        <p className="section-lead">Lo mejor para tu imagen.</p>

        <div className="services-preview-grid">
          {serviciosDestacados.map(servicio => (
            <div key={servicio.id} className="service-preview-card">
              <h3>{servicio.nombre}</h3>
              <span className="price">${servicio.precio}</span>
              <Link to="/citas" className="btn-text">Reservar</Link>
            </div>
          ))}
        </div>

        <Link to="/servicios" className="btn-secondary">Ver Todos los Servicios</Link>
      </section>

      {/* ── GALERÍA ── */}
      <section className="portfolio-preview-section">
        <span className="section-eyebrow">Nuestro trabajo</span>
        <h2>Galería Reciente</h2>
        <p className="section-lead">Un vistazo a nuestro arte.</p>

        <div className="preview-grid">
          {fotosRecientes.map(foto => (
            <div key={foto.id} className="preview-card">
              <img
                src={apiUrl(`uploads/${foto.imagen_url}`)}
                alt={foto.titulo}
              />
            </div>
          ))}
        </div>

        <div className="view-more-container">
          <Link to="/galeria" className="btn-secondary">Ver Galería Completa</Link>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS / INFO RELEVANTE ── */}
      <section className="about-preview-section">
        <span className="section-eyebrow">Quiénes somos</span>
        <h2>about-subtitleTu confianza, nuestro compromiso</h2>
        <p className="section-lead">
          En JC Studio combinamos técnica, asesoría personalizada y productos de alta calidad para ayudarte a lograr el look que buscas.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>✅ Asesoría antes de agendar</h3>
            <p>
              Te recomendamos el servicio ideal según tu objetivo: micropigmentación, botox o tratamientos estéticos.
            </p>
          </div>
          <div className="about-card">
            <h3>✨ Resultados consistentes</h3>
            <p>
              Trabajamos con procesos claros y seguimiento para que el resultado se vea natural y duradero.
            </p>
          </div>
          <div className="about-card">
            <h3>🕒 Agenda en minutos</h3>
            <p>
              Elige tu servicio y horario. Si tienes dudas, siempre puedes escribirnos para orientarte.
            </p>
          </div>
        </div>

        <div className="about-cta-row">
          <Link to="/citas" className="btn-primary">Agendar cita</Link>
          <Link to="/servicios" className="btn-outline">Ver servicios</Link>
        </div>
      </section>

      {/* ── FAQ / SUGERENCIAS ── */}
      <section className="faq-preview-section">
        <span className="section-eyebrow">Recomendaciones</span>
        <h2>¿Qué servicio te conviene?</h2>
        <p className="section-lead">Preguntas rápidas para que tomes la mejor decisión.</p>

        <div className="faq-grid">
          <details className="faq-item">
            <summary>¿Para quién es la micropigmentación?</summary>
            <p>Ideal si buscas definir o corregir cejas/labios con un resultado natural y personalizado.</p>
          </details>
          <details className="faq-item">
            <summary>¿Cuándo se recomienda botox?</summary>
            <p>Se sugiere para minimizar líneas de expresión y lograr un aspecto más descansado.</p>
          </details>
          <details className="faq-item">
            <summary>¿Muchos servicios se parecen… y no sé cuál elegir?</summary>
            <p>Elige el que más se acerque a tu objetivo. Nuestro equipo te orienta para ajustar el plan.</p>
          </details>
        </div>
      </section>

    </div>
  );
};

export default HomePage;