import React from 'react';
import './Servicios.css'; // Importamos los estilos

// 1. DATOS SIMULADOS (MOCK DATA)
// Más adelante, esto vendrá de tu API.
const servicios = [
  { id: 1, nombre: 'Servicio 1', desc: 'Descripción breve del servicio que ofrece JC Studio.' },
  { id: 2, nombre: 'Servicio 2', desc: 'Descripción breve del servicio que ofrece JC Studio.' },
  { id: 3, nombre: 'Servicio 3', desc: 'Descripción breve del servicio que ofrece JC Studio.' },
];

const ServiciosList = () => {
  return (
    <section id="servicios" className="servicios-section container">
      <h2>Nuestros Servicios</h2>
      
      <div className="servicios-grid">
        {/* 2. Mapeamos (recorremos) el array de servicios */}
        {servicios.map((servicio) => (
          
          // 3. Creamos una "tarjeta" (card) por cada servicio
          <div key={servicio.id} className="servicio-card">
            <h3>{servicio.nombre}</h3>
            <p>{servicio.desc}</p>
          </div>

        ))}
      </div>
    </section>
  );
};

export default ServiciosList;