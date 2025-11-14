import React, { useState } from 'react';
import axios from 'axios'; // 1. Importar axios
import { useNavigate } from 'react-router-dom'; // 2. Importar useNavigate
import './CitasForm.css'; 

const CitasForm = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [servicioId, setServicioId] = useState(''); 
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 3. Inicializar el hook

  // Simulación de servicios (¡Importante! deben coincidir con tu DB)
  const serviciosDisponibles = [
    { id: 1, nombre: 'Servicio de Prueba' }, // Asegúrate que este ID exista
    // { id: 2, nombre: 'Servicio 2' },
    // { id: 3, nombre: 'Servicio 3' },
  ];

  // 4. Esta será la función de envío (handleSubmit) MODIFICADA
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!nombre || !email || !fecha || !servicioId) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setError('');
    
    try {
      // 5. ¡LA LLAMADA A LA API!
      const response = await axios.post('http://localhost:4000/api/citas', {
        nombre: nombre,
        email: email,
        fecha: fecha,
        servicioId: parseInt(servicioId) // Aseguramos que sea un número
      });

      // 6. Si la cita se agenda con éxito
      console.log('Cita agendada:', response.data);
      alert('¡Tu cita ha sido agendada exitosamente!');
      
      // 7. Redirigimos a la página de inicio
      navigate('/'); 

    } catch (err) {
      // 8. Si falla la llamada
      console.error('Error al agendar la cita:', err.response);
      
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al conectar con el servidor.');
      }
    }
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
            type="datetime-local" 
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