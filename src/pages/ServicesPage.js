import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/servicios');
        setServicios(response.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar servicios', error);
        setCargando(false);
      }
    };
    fetchServicios();
  }, []);

  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Nuestros Servicios</h1>
        <p>Calidad y estilo en cada detalle.</p>
      </header>

      {cargando ? (
        <p className="loading">Cargando catálogo...</p>
      ) : (
        <div className="services-grid">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="service-card-full">
              <div className="service-info">
                <h3>{servicio.nombre}</h3>
                <p className="service-desc">{servicio.descripcion}</p>
                <div className="service-meta">
                  <span className="duration">⏱ {servicio.duracion_min} min</span>
                  <span className="price">${servicio.precio}</span>
                </div>
              </div>
              <div className="service-action">
                <Link to="/citas" className="btn-book">Agendar este servicio</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;