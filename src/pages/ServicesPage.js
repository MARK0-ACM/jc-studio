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
      } catch (error) {
        console.error('Error al cargar servicios', error);
      } finally {
        setCargando(false);
      }
    };
    fetchServicios();
  }, []);

  const formatDuracion = (min) => {
    if (min >= 60) {
      const h = Math.floor(min / 60);
      const m = min % 60;
      return `${h} ${h === 1 ? 'hora' : 'horas'}${m > 0 ? ` ${m} min` : ''}`;
    }
    return `${min} min`;
  };

  return (
    <div className="services-page">

      {/* Header */}
      <header className="services-header">
        <div className="services-eyebrow">Lo que ofrecemos</div>
        <h1>Nuestros Servicios</h1>
        <p>Calidad y estilo en cada detalle.</p>
      </header>

      {cargando ? (
        <p className="loading">Cargando catálogo...</p>
      ) : (
        <div className="services-grid">
          {servicios.length === 0 ? (
            <p style={{ color: 'var(--jc-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '60px' }}>
              No hay servicios disponibles por el momento.
            </p>
          ) : (
            servicios.map((servicio, index) => (
              <div
                key={servicio.id}
                className="service-card-full"
                data-index={String(index + 1).padStart(2, '0')}
              >
                <div className="service-info">
                  <h3>{servicio.nombre}</h3>
                  <p className="service-desc">{servicio.descripcion}</p>
                  <div className="service-meta">
                    <span className="duration">⏱ {formatDuracion(servicio.duracion_min)}</span>
                    <span className="price">${servicio.precio}</span>
                  </div>
                </div>
                <div className="service-action">
                  <Link to="/citas" className="btn-book">Agendar este servicio</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;