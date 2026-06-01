import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CitasForm.css';

const CitasForm = () => {
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState(''); // Fecha completa combinada (para enviar al backend)
  const [fechaInput, setFechaInput] = useState(''); // Solo fecha (YYYY-MM-DD)
  const [horaInput, setHoraInput] = useState(''); // Solo hora (HH:mm)
  const [servicioId, setServicioId] = useState('');
  
  // Estados de datos y UI
  const [servicios, setServicios] = useState([]); // Aquí guardaremos los servicios de la DB
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true); // Para mostrar "Cargando..."
  
  const navigate = useNavigate();

  // Configuración de horario laboral
  const HORA_INICIO = 11; // 11:00 AM
  const HORA_FIN = 18; // 6:00 PM

  // 1. Cargar los servicios y datos del usuario si está autenticado
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

    // Si el usuario está autenticado, pre-llenar nombre y email
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.nombre) setNombre(user.nombre);
        if (user.email) setEmail(user.email);
      } catch (e) {
        console.error('Error al parsear datos del usuario:', e);
      }
    }

    fetchServicios();
  }, []);

  // Efecto para revalidar cuando cambia el servicio
  useEffect(() => {
    if (servicioId && fechaInput && horaInput) {
      const fechaCompleta = combinarFechaHora(fechaInput, horaInput);
      const fechaObj = new Date(fechaCompleta);
      
      // Validar que la cita termine antes de las 6pm con el nuevo servicio
      const servicioSeleccionado = servicios.find(s => s.id === parseInt(servicioId));
      if (servicioSeleccionado) {
        const duracionMinutos = servicioSeleccionado.duracion_min || 120;
        const fechaFin = new Date(fechaObj.getTime() + duracionMinutos * 60000);
        const horaFin = fechaFin.getHours();
        const minutosFin = fechaFin.getMinutes();
        
        if (horaFin > HORA_FIN || (horaFin === HORA_FIN && minutosFin > 0)) {
          setError(`Con este servicio, la cita terminaría después de las ${HORA_FIN}:00 PM. Por favor, selecciona un horario más temprano.`);
          setHoraInput('');
          setFecha('');
        } else {
          setError('');
          setFecha(fechaCompleta);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicioId]);

  // Función para obtener la fecha mínima permitida (hoy)
  const getMinDate = () => {
    const ahora = new Date();
    const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    return hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  // Función para obtener la fecha máxima permitida (varias semanas adelante)
  const getMaxDate = () => {
    const ahora = new Date();
    const fechaMax = new Date(ahora);
    fechaMax.setDate(ahora.getDate() + 60); // Permitir hasta 60 días adelante
    return fechaMax.toISOString().split('T')[0];
  };

  // getMinTime / getMaxTime no se usan directamente.
  // (La generación real de horas disponibles se hace en generarHorasDisponibles().)
  // const getMinTime = () => {};



  // getMaxTime no se usa directamente; la generación real de horas se hace en generarHorasDisponibles().
  // const getMaxTime = () => {};


  // Función para combinar fecha y hora en formato datetime
  const combinarFechaHora = (fecha, hora) => {
    if (!fecha || !hora) return '';
    return `${fecha}T${hora}:00`;
  };

  // Función para generar horas disponibles en intervalos de 30 minutos
  const generarHorasDisponibles = () => {
    const horas = [];
    const servicioSeleccionado = servicios.find(s => s.id === parseInt(servicioId));
    const duracionMinutos = servicioSeleccionado?.duracion_min || 120;
    const duracionHoras = Math.ceil(duracionMinutos / 60);
    const horaMaximaInicio = HORA_FIN - duracionHoras;
    
    // Determinar hora y minuto mínimos
    let horaMin = HORA_INICIO;
    let empezarDesde30 = false;
    
    if (fechaInput === getMinDate()) {
      const ahora = new Date();
      if (ahora.getHours() >= HORA_INICIO) {
        const minutos = ahora.getMinutes();
        if (minutos < 30) {
          // Si estamos antes de :30, empezar desde :30 de esta hora
          horaMin = ahora.getHours();
          empezarDesde30 = true;
        } else {
          // Si ya pasamos :30, empezar desde :00 de la siguiente hora
          horaMin = ahora.getHours() + 1;
          empezarDesde30 = false;
        }
        if (horaMin < HORA_INICIO) {
          horaMin = HORA_INICIO;
          empezarDesde30 = false;
        }
      }
    }

    // Generar horas desde horaMin hasta horaMaximaInicio en intervalos de 30 min
    for (let hora = horaMin; hora <= horaMaximaInicio; hora++) {
      // Si es la primera hora y debemos empezar desde :30
      if (hora === horaMin && empezarDesde30) {
        horas.push({
          value: `${String(hora).padStart(2, '0')}:30`,
          label: `${hora === 12 ? 12 : hora > 12 ? hora - 12 : hora}:30 ${hora >= 12 ? 'PM' : 'AM'}`
        });
      } else {
        // Agregar :00
        horas.push({
          value: `${String(hora).padStart(2, '0')}:00`,
          label: `${hora === 12 ? 12 : hora > 12 ? hora - 12 : hora}:00 ${hora >= 12 ? 'PM' : 'AM'}`
        });
        
        // Agregar :30 solo si no es la última hora
        if (hora < horaMaximaInicio) {
          horas.push({
            value: `${String(hora).padStart(2, '0')}:30`,
            label: `${hora === 12 ? 12 : hora > 12 ? hora - 12 : hora}:30 ${hora >= 12 ? 'PM' : 'AM'}`
          });
        }
      }
    }

    return horas;
  };

  // Función para validar fecha seleccionada
  const handleFechaInputChange = (e) => {
    const fechaSeleccionada = e.target.value;
    setFechaInput(fechaSeleccionada);
    
    if (!fechaSeleccionada) {
      setFecha('');
      setError('');
      return;
    }

    const fechaObj = new Date(fechaSeleccionada + 'T12:00:00'); // Usar mediodía para evitar problemas de zona horaria
    const diaSemana = fechaObj.getDay();
    
    // Si es domingo (0), mostrar error y no permitir
    if (diaSemana === 0) {
      setError('No se pueden agendar citas los domingos. El horario de atención es de lunes a sábado.');
      setFechaInput('');
      setFecha('');
      return;
    }

    setError('');
    
    // Si ya hay hora seleccionada, combinar y validar
    if (horaInput) {
      const fechaCompleta = combinarFechaHora(fechaSeleccionada, horaInput);
      validarFechaHoraCompleta(fechaCompleta);
    }
  };

  // Función para validar hora seleccionada (ahora desde un select)
  const handleHoraInputChange = (e) => {
    const horaSeleccionada = e.target.value;
    setHoraInput(horaSeleccionada);
    
    if (!horaSeleccionada) {
      setFecha('');
      setError('');
      return;
    }

    // Si ya hay fecha seleccionada, combinar y validar
    if (fechaInput) {
      const fechaCompleta = combinarFechaHora(fechaInput, horaSeleccionada);
      validarFechaHoraCompleta(fechaCompleta);
    }
  };

  // Función para validar fecha y hora combinadas
  const validarFechaHoraCompleta = (fechaCompleta) => {
    if (!fechaCompleta) {
      setFecha('');
      return;
    }

    const fechaObj = new Date(fechaCompleta);
    const hora = fechaObj.getHours();
    // const minutos = fechaObj.getMinutes(); // no se usa (evita warning no-unused-vars)

    // Validar horario de atención
    if (hora < HORA_INICIO || hora >= HORA_FIN) {
      setError(`El horario de atención es de ${HORA_INICIO}:00 AM a ${HORA_FIN}:00 PM. Por favor, selecciona un horario dentro de este rango.`);
      setFecha('');
      return;
    }

    // Si hay servicio seleccionado, validar que termine antes de las 6pm
    if (servicioId) {
      const servicioSeleccionado = servicios.find(s => s.id === parseInt(servicioId));
      if (servicioSeleccionado) {
        const duracionMinutos = servicioSeleccionado.duracion_min || 120;
        const fechaFin = new Date(fechaObj.getTime() + duracionMinutos * 60000);
        const horaFin = fechaFin.getHours();
        const minutosFin = fechaFin.getMinutes();
        
        if (horaFin > HORA_FIN || (horaFin === HORA_FIN && minutosFin > 0)) {
          setError(`Esta cita terminaría después de las ${HORA_FIN}:00 PM. Por favor, selecciona un horario más temprano.`);
          setFecha('');
          return;
        }
      }
    }

    setError('');
    setFecha(fechaCompleta);
  };

  // Función para actualizar fecha cuando cambia el servicio (para validar duración)
  const handleServicioChange = (e) => {
    setServicioId(e.target.value);
    
    // Si ya hay fecha y hora seleccionadas, revalidar
    if (fechaInput && horaInput) {
      const fechaCompleta = combinarFechaHora(fechaInput, horaInput);
      validarFechaHoraCompleta(fechaCompleta);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combinar fecha y hora si están separadas
    if (fechaInput && horaInput && !fecha) {
      const fechaCompleta = combinarFechaHora(fechaInput, horaInput);
      validarFechaHoraCompleta(fechaCompleta);
      // validarFechaHoraCompleta ajusta "fecha" y "error"; si sigue vacío es porque no fue válido
      if (!fecha) {
        setError('Por favor, verifica que la fecha y hora sean válidas.');
        return;
      }
    }

    if (!nombre || !email || !fecha || !servicioId) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const servicioSeleccionado = servicios.find((s) => s.id === parseInt(servicioId));
      const servicioNombre = servicioSeleccionado?.nombre || 'Servicio';
      const duracionMin = servicioSeleccionado?.duracion_min || null;

      const response = await axios.post(
        'http://localhost:4000/api/citas',
        {
          nombre,
          email,
          fecha,
          servicioId: parseInt(servicioId)
        },
        { headers }
      );

      const citaCreada = response?.data;

      // Mensaje UX más claro (sin depender 100% del backend)
      const fechaTexto = fecha
        ? new Date(fecha).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : '';

      const estado = citaCreada?.estado || citaCreada?.status || 'pendiente';

      let mensaje;
      if (estado === 'confirmada') {
        mensaje = `✅ ¡Tu cita ha sido confirmada!\n\n📅 ${fechaTexto}\n🛠️ ${servicioNombre}`;
      } else if (estado === 'rechazada' || estado === 'cancelada') {
        mensaje = `❌ No fue posible agendar esta cita (${estado}).\n\nPuedes intentar con otra fecha.`;
      } else {
        // pendiente / en revisión
        const proximaAccion = 'te contactaremos por WhatsApp para confirmar detalles.';
        mensaje = `⏳ ¡Cita enviada!\n\n📅 ${fechaTexto}\n🛠️ ${servicioNombre}${duracionMin ? ` (${duracionMin} min)` : ''}\n\n${proximaAccion}`;
      }

      alert(mensaje);
      navigate('/');
    } catch (err) {
      console.error('Error al agendar:', err.response);

      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data.error || 'Esta hora ya está ocupada. Por favor, selecciona otra fecha y hora.');
        } else if (err.response.status === 400) {
          setError(err.response.data.error || 'Los datos proporcionados no son válidos. Por favor, verifica la información.');
        } else if (err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError(`Error del servidor (${err.response.status}). Por favor, intenta nuevamente.`);
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="citas-form-container">
      <form onSubmit={handleSubmit} className="citas-form">
        <h2>Agendar una Cita</h2>
        <div className="citas-form-divider"></div>
        
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input 
            type="text" id="nombre"
            value={nombre} onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" id="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!localStorage.getItem('token')}
            style={localStorage.getItem('token') ? { backgroundColor: 'rgba(255,255,255,0.04)', cursor: 'not-allowed' } : {}}
          />
          {localStorage.getItem('token') && (
            <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
              🔒 Usando tu email de cuenta (no editable)
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="servicio">Servicio:</label>
          {cargando ? (
            <p>Cargando servicios...</p>
          ) : (
            <select
              id="servicio"
              value={servicioId}
              onChange={handleServicioChange}
              required
            >
              <option value="" disabled>Selecciona un servicio...</option>
              {/* Mapeamos los servicios REALES de la base de datos */}
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - ${servicio.precio} 
                  {servicio.duracion_min ? (
                    servicio.duracion_min >= 60 
                      ? ` (${Math.floor(servicio.duracion_min / 60)} ${Math.floor(servicio.duracion_min / 60) === 1 ? 'hora' : 'horas'}${servicio.duracion_min % 60 > 0 ? ` ${servicio.duracion_min % 60} min` : ''})`
                      : ` (${servicio.duracion_min} min)`
                  ) : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha:</label>
          <input 
            type="date" 
            id="fecha"
            value={fechaInput} 
            onChange={handleFechaInputChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
          />
          <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
            📅 Solo días laborales (Lunes a Sábado)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="hora">Hora:</label>
          {!servicioId ? (
            <>
              <select 
                id="hora"
                value=""
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                <option value="">Selecciona primero un servicio</option>
              </select>
              <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                ⏰ Primero selecciona un servicio para ver los horarios disponibles
              </small>
            </>
          ) : !fechaInput ? (
            <>
              <select 
                id="hora"
                value=""
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              >
                <option value="">Selecciona primero una fecha</option>
              </select>
              <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                ⏰ Primero selecciona una fecha para ver los horarios disponibles
              </small>
            </>
          ) : (
            <>
              <select 
                id="hora"
                value={horaInput} 
                onChange={handleHoraInputChange}
                required
                className="time-select"
              >
                <option value="">Selecciona una hora</option>
                {generarHorasDisponibles().map((hora, index) => (
                  <option key={index} value={hora.value}>
                    {hora.label}
                  </option>
                ))}
              </select>
              <small style={{ color: '#666', fontSize: '0.85rem', display: 'block', marginTop: '5px' }}>
                ⏰ Horario: {HORA_INICIO}:00 AM - {HORA_FIN}:00 PM | 
                <strong> Intervalos de 30 min</strong> significa que solo puedes agendar a las :00 o :30 de cada hora 
                (ej: 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM, etc.)
              </small>
            </>
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