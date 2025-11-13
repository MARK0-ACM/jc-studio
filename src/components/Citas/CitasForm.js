import React, { useState } from 'react';
import './CitasForm.css'; // Importamos los estilos

const CitasForm = () => {
  // 1. Estados para cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicioId, setServicioId] = useState(''); // Para el <select>
  const [error, setError] = useState('');

  // Simulación de servicios que vendrían de la API
  const serviciosDisponibles = [
    { id: 1, nombre: 'Servicio 1' },
    { id: 2, nombre: 'Servicio 2' },
    { id: 3, nombre: 'Servicio 3' },
  ];

  // 2. Función que se ejecuta al enviar
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue

    if (!nombre || !email || !fecha || !servicioId) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setError('');
    
    // --- Simulación de envío de API ---
    console.log('Enviando datos de Cita:', { nombre, email, fecha, servicioId });
    
    alert('¡Cita agendada (simulación)! Revisa la consola.');
    
    // Limpiar formulario
    setNombre('');
    setEmail('');
    setFecha('');
    setServicioId('');
  };

  return (
    <div className="citas-form-container">
      <form onSubmit={handleSubmit} className="citas-form">
        <h2>Agendar una Cita</h2>
        
        {/* Campo de Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input 
            type="text" 
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Campo de Fecha */}
        <div className="form-group">
          <label htmlFor="fecha">Fecha y Hora:</label>
          <input 
            type="datetime-local" // Input especial para fecha y hora
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {/* Selector de Servicio */}
        <div className="form-group">
          <label htmlFor="servicio">Servicio:</label>
          <select
            id="servicio"
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
          >
            <option value="" disabled>Selecciona un servicio...</option>
            {serviciosDisponibles.map(servicio => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-submit">
          Confirmar Cita
        </button>
      </form>
    </div>
  );
};

export default CitasForm;
