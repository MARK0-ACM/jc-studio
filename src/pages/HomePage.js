import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const [fotosRecientes, setFotosRecientes] = useState([]);
  const [serviciosDestacados, setServiciosDestacados] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargar Fotos
        const resFotos = await axios.get('http://localhost:4000/api/portafolio');
        setFotosRecientes(resFotos.data.slice(0, 3)); // Solo 3 fotos

        // 2. Cargar Servicios (¡Recuperamos esto!)
        const resServicios = await axios.get('http://localhost:4000/api/servicios');
        setServiciosDestacados(resServicios.data.slice(0, 3)); // Solo 3 servicios
      } catch (error) {
        console.error('Error cargando datos del home', error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="homepage">
      {/* --- HERO SECTION --- */}
      <section className="hero">
        <h1>JC Studio</h1>
        <p>Tu estilo, nuestra pasión.</p>
        <Link to="/citas" className="btn-primary">Agendar Cita Ahora</Link>
      </section>

      {/* --- SECCIÓN DE SERVICIOS (RESUMEN) --- */}
      <section className="services-preview-section">
        <h2>Servicios Destacados</h2>
        <p>Lo mejor para tu imagen.</p>

        <div className="services-preview-grid">
          {serviciosDestacados.map(servicio => (
            <div key={servicio.id} className="service-preview-card">
              <h3>{servicio.nombre}</h3>
              <p className="price">${servicio.precio}</p>
              <Link to="/citas" className="btn-text">Reservar ›</Link>
            </div>
          ))}
        </div>
        
        <div className="view-more-container">
          <Link to="/servicios" className="btn-secondary">Ver Todos los Servicios</Link>
        </div>
      </section>

      {/* --- SECCIÓN DE PORTAFOLIO (RESUMEN) --- */}
      <section className="portfolio-preview-section">
        <h2>Galería Reciente</h2>
        <p>Un vistazo a nuestro trabajo.</p>

        <div className="preview-grid">
          {fotosRecientes.map(foto => (
            <div key={foto.id} className="preview-card">
              <img 
                src={`http://localhost:4000/uploads/${foto.imagen_url}`} 
                alt={foto.titulo} 
              />
            </div>
          ))}
        </div>

        <div className="view-more-container">
          <Link to="/galeria" className="btn-secondary">Ver Galería Completa</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;