import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CitasForm.css';

const CitasForm = () => {
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicioId, setServicioId] = useState('');
  
  // Estados de datos y UI
  const [servicios, setServicios] = useState([]); // Aquí guardaremos los servicios de la DB
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true); // Para mostrar "Cargando..."
  
  const navigate = useNavigate();

  // 1. Cargar los servicios REALES al abrir el formulario
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/servicios');
        setServicios(response.data);
        setCargando(false);
      } catch (err) {
        console.error('Error al cargar servicios', err);
        setError('No se pudieron cargar los servicios disponibles.');
        setCargando(false);
      }
    };

    fetchServicios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !email || !fecha || !servicioId) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setError('');

    try {
      // Enviamos la cita al backend
      await axios.post('http://localhost:4000/api/citas', {
        nombre,
        email,
        fecha,
        servicioId: parseInt(servicioId)
      });

      alert('¡Tu cita ha sido agendada exitosamente!');
      navigate('/'); 

    } catch (err) {
      console.error('Error al agendar:', err.response);
      
      // Manejo específico de errores del backend
      if (err.response) {
        // Error 409 Conflict - Hora ocupada
        if (err.response.status === 409) {
          setError(err.response.data.error || 'Esta hora ya está ocupada. Por favor, selecciona otra fecha y hora.');
        }
        // Error 400 Bad Request - Datos inválidos
        else if (err.response.status === 400) {
          setError(err.response.data.error || 'Los datos proporcionados no son válidos. Por favor, verifica la información.');
        }
        // Otros errores con mensaje del backend
        else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        }
        // Error sin mensaje específico
        else {
          setError(`Error del servidor (${err.response.status}). Por favor, intenta nuevamente.`);
        }
      } 
      // Error de conexión
      else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      }
      // Otro tipo de error
      else {
        setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="citas-form-container">
      <form onSubmit={handleSubmit} className="citas-form">
        <h2>Agendar una Cita</h2>
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input 
            type="text" id="nombre"
            value={nombre} onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" id="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha y Hora:</label>
          <input 
            type="datetime-local" id="fecha"
            value={fecha} onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="servicio">Servicio:</label>
          {cargando ? (
            <p>Cargando servicios...</p>
          ) : (
            <select
              id="servicio"
              value={servicioId}
              onChange={(e) => setServicioId(e.target.value)}
            >
              <option value="" disabled>Selecciona un servicio...</option>
              {/* Mapeamos los servicios REALES de la base de datos */}
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - ${servicio.precio}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-submit" disabled={cargando}>
          Confirmar Cita
        </button>
      </form>
    </div>
  );
};

export default CitasForm;