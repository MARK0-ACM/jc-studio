import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CitasManager.css';

const CitasManager = () => {
  const [citas, setCitas] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    fecha: '',
    servicioId: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('todas'); // 'todas', 'pendiente', 'confirmada', 'rechazada'

  // Cargar citas y servicios al iniciar
  useEffect(() => {
    fetchCitas();
    fetchServicios();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/citas');
      console.log('Citas recibidas del backend:', response.data); // Debug
      if (response.data && response.data.length > 0) {
        console.log('Primera cita completa:', response.data[0]); // Debug - ver estructura
        console.log('Campos disponibles en primera cita:', Object.keys(response.data[0])); // Debug - ver todas las keys
      }
      setCitas(response.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('Error al cargar las citas');
      setCargando(false);
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/servicios');
      setServicios(response.data);
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Solo modo crear (sin editar)
      await axios.post('http://localhost:4000/api/citas', {
        ...form,
        servicioId: parseInt(form.servicioId)
      });
      alert('Cita creada exitosamente');
      
      // Limpiar y recargar
      setForm({ nombre: '', email: '', fecha: '', servicioId: '' });
      fetchCitas();

    } catch (err) {
      console.error(err);
      if (err.response) {
        if (err.response.status === 409) {
          setError(err.response.data.error || 'Esta hora ya está ocupada. Selecciona otra fecha y hora.');
        } else {
          setError(err.response.data.error || 'Error al guardar la cita');
        }
      } else {
        setError('Error al guardar la cita');
      }
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta cita?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/citas/${id}`);
      fetchCitas();
      alert('Cita eliminada exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la cita');
    }
  };

  // Funciones para cambiar el estado de la cita
  const handleCambiarEstado = async (id, nuevoEstado) => {
    console.log(`Intentando cambiar estado de cita ${id} a: ${nuevoEstado}`);
    
    try {
      // Intentar primero con PATCH
      console.log(`Haciendo PATCH a: http://localhost:4000/api/citas/${id}/estado`);
      const response = await axios.patch(`http://localhost:4000/api/citas/${id}/estado`, {
        estado: nuevoEstado
      });
      console.log('Respuesta del servidor:', response.data);
      fetchCitas();
      const mensaje = nuevoEstado === 'confirmada' 
        ? 'Cita confirmada exitosamente' 
        : nuevoEstado === 'rechazada' 
        ? 'Cita rechazada exitosamente'
        : `Cita actualizada a: ${nuevoEstado}`;
      alert(mensaje);
    } catch (err) {
      console.error('Error con PATCH:', err);
      console.error('Detalles del error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      // Si PATCH falla, intentar con PUT en el endpoint de estado
      try {
        console.log(`Intentando PUT a: http://localhost:4000/api/citas/${id}/estado`);
        const response = await axios.put(`http://localhost:4000/api/citas/${id}/estado`, {
          estado: nuevoEstado
        });
        console.log('Respuesta del servidor (PUT):', response.data);
        fetchCitas();
        const mensaje = nuevoEstado === 'confirmada' 
          ? 'Cita confirmada exitosamente' 
          : nuevoEstado === 'rechazada' 
          ? 'Cita rechazada exitosamente'
          : `Cita actualizada a: ${nuevoEstado}`;
        alert(mensaje);
      } catch (err2) {
        console.error('Error con PUT:', err2);
        console.error('Detalles del error PUT:', {
          message: err2.message,
          response: err2.response?.data,
          status: err2.response?.status,
          statusText: err2.response?.statusText
        });
        
        // Mostrar error más detallado
        const errorMsg = err2.response?.data?.error || err2.response?.data?.message || err2.message || 'Error desconocido';
        const statusCode = err2.response?.status || 'N/A';
        alert(`Error al cambiar el estado de la cita (${statusCode}): ${errorMsg}\n\nRevisa la consola para más detalles.`);
      }
    }
  };


  // Función para formatear fecha para mostrar
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    
    try {
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
      }
      
      return fecha.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha para mostrar:', error);
      return 'Error al formatear fecha';
    }
  };

  // Función para obtener el nombre del servicio
  const obtenerNombreServicio = (cita) => {
    // Primero intentar obtener el nombre directamente si viene en la respuesta (caso más común)
    if (cita.servicio_nombre) {
      return cita.servicio_nombre;
    }
    if (cita.servicio && cita.servicio.nombre) {
      return cita.servicio.nombre;
    }
    if (cita.nombre_servicio) {
      return cita.nombre_servicio;
    }
    
    // Si no viene el nombre directamente, intentar buscar por ID
    const servicioId = cita.servicio_id || cita.servicioId || cita.id_servicio || cita.servicio_id_cita || (cita.servicio && cita.servicio.id);
    
    if (servicioId || servicioId === 0) {
      // Buscar el servicio en el array
      const servicio = servicios.find(s => {
        const match = s.id === servicioId || 
                      s.id === parseInt(servicioId) || 
                      String(s.id) === String(servicioId) ||
                      Number(s.id) === Number(servicioId);
        return match;
      });
      
      if (servicio) {
        return servicio.nombre;
      }
    }
    
    // Si no se encontró nada
    return 'Servicio no especificado';
  };

  // Función para obtener el estado de la cita
  const obtenerEstado = (cita) => {
    return cita.estado || cita.status || 'pendiente';
  };

  // Filtrar citas por estado
  const citasFiltradas = filtroEstado === 'todas' 
    ? citas 
    : citas.filter(cita => obtenerEstado(cita) === filtroEstado);

  // Contadores
  const contadores = {
    todas: citas.length,
    pendiente: citas.filter(c => obtenerEstado(c) === 'pendiente').length,
    confirmada: citas.filter(c => obtenerEstado(c) === 'confirmada').length,
    rechazada: citas.filter(c => obtenerEstado(c) === 'rechazada').length
  };

  if (cargando) {
    return <div className="citas-manager"><p>Cargando citas...</p></div>;
  }

  return (
    <div className="citas-manager">
      <h3>Gestión de Citas</h3>

      {/* FORMULARIO - Solo para crear nuevas citas manualmente */}
      <details className="admin-form-container">
        <summary className="form-summary">➕ Agregar Nueva Cita Manualmente</summary>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <input 
              type="text" name="nombre" placeholder="Nombre del Cliente" 
              value={form.nombre} onChange={handleChange} required 
            />
            <input 
              type="email" name="email" placeholder="Email del Cliente" 
              value={form.email} onChange={handleChange} required 
            />
          </div>
          <div className="form-row">
            <input 
              type="datetime-local" name="fecha" 
              value={form.fecha} onChange={handleChange} required 
            />
            <select 
              name="servicioId" 
              value={form.servicioId} onChange={handleChange} required
            >
              <option value="">Selecciona un servicio...</option>
              {servicios.map(servicio => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - ${servicio.precio}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-create">
              Agregar Cita
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
        </form>
      </details>

      {/* FILTROS POR ESTADO */}
      <div className="citas-filtros">
        <button 
          className={`filtro-btn ${filtroEstado === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('todas')}
        >
          Todas ({contadores.todas})
        </button>
        <button 
          className={`filtro-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('pendiente')}
        >
          En Espera ({contadores.pendiente})
        </button>
        <button 
          className={`filtro-btn ${filtroEstado === 'confirmada' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('confirmada')}
        >
          Confirmadas ({contadores.confirmada})
        </button>
        <button 
          className={`filtro-btn ${filtroEstado === 'rechazada' ? 'active' : ''}`}
          onClick={() => setFiltroEstado('rechazada')}
        >
          Rechazadas ({contadores.rechazada})
        </button>
      </div>

      {/* LISTA DE CITAS */}
      <div className="citas-list">
        <h4>
          {filtroEstado === 'todas' && `Todas las Citas (${citas.length})`}
          {filtroEstado === 'pendiente' && `Citas en Espera (${contadores.pendiente})`}
          {filtroEstado === 'confirmada' && `Citas Confirmadas (${contadores.confirmada})`}
          {filtroEstado === 'rechazada' && `Citas Rechazadas (${contadores.rechazada})`}
        </h4>
        {citasFiltradas.length === 0 ? (
          <p className="no-data">No hay citas en esta categoría.</p>
        ) : (
          <div className="citas-grid">
            {citasFiltradas.map(cita => {
              const estado = obtenerEstado(cita);
              return (
                <div key={cita.id} className={`cita-card cita-${estado}`}>
                <div className="cita-header">
                  <h4>{cita.cliente_nombre || cita.nombre || cita.nombre_cliente || 'Sin nombre'}</h4>
                  <div className="cita-badges">
                    <span className={`cita-estado estado-${estado}`}>
                      {estado === 'pendiente' ? '⏳ En Espera' : 
                       estado === 'confirmada' ? '✅ Confirmada' : 
                       '❌ Rechazada'}
                    </span>
                    <span className="cita-id">#{cita.id}</span>
                  </div>
                </div>
                <div className="cita-info">
                  <p><strong>📧 Email:</strong> {
                    cita.cliente_email || 
                    cita.email || 
                    cita.correo || 
                    cita.email_cliente || 
                    cita.correo_cliente ||
                    (cita.cliente && cita.cliente.email) ||
                    (cita.cliente && cita.cliente.correo) ||
                    'No especificado'
                  }</p>
                  <p><strong>📅 Fecha:</strong> {formatearFecha(
                    cita.fecha_hora ||
                    cita.fecha || 
                    cita.fecha_cita || 
                    cita.fecha_hora_cita ||
                    cita.fecha_agendada
                  )}</p>
                  <p><strong>💇 Servicio:</strong> {obtenerNombreServicio(cita)}</p>
                  {/* Debug: Mostrar todos los campos para identificar el problema */}
                  <details style={{ marginTop: '10px', fontSize: '0.8rem', color: '#999', cursor: 'pointer' }}>
                    <summary style={{ color: '#666' }}>🔍 Ver datos completos (Debug)</summary>
                    <div style={{ 
                      background: '#f5f5f5', 
                      padding: '10px', 
                      borderRadius: '4px', 
                      overflow: 'auto',
                      fontSize: '0.75rem',
                      marginTop: '5px'
                    }}>
                      <p><strong>Campos disponibles:</strong> {Object.keys(cita).join(', ')}</p>
                      <p style={{ marginTop: '5px', marginBottom: '5px' }}>
                        <strong>Email encontrado en:</strong> {
                          cita.cliente_email ? 'cliente_email' :
                          cita.email ? 'email' :
                          cita.correo ? 'correo' :
                          cita.email_cliente ? 'email_cliente' :
                          'NINGUNO'
                        }
                      </p>
                      <p style={{ marginTop: '5px', marginBottom: '5px' }}>
                        <strong>Servicio encontrado en:</strong> {
                          cita.servicio_nombre ? `servicio_nombre: "${cita.servicio_nombre}"` :
                          cita.servicio_id ? `servicio_id: ${cita.servicio_id}` :
                          cita.servicioId ? `servicioId: ${cita.servicioId}` :
                          cita.id_servicio ? `id_servicio: ${cita.id_servicio}` :
                          cita.servicio ? `servicio: ${JSON.stringify(cita.servicio)}` :
                          'NINGUNO'
                        }
                      </p>
                      <pre style={{ marginTop: '10px' }}>
                        {JSON.stringify(cita, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
                  <div className="cita-actions">
                    {estado === 'pendiente' && (
                      <>
                        <button 
                          onClick={() => handleCambiarEstado(cita.id, 'confirmada')} 
                          className="btn-confirm"
                        >
                          ✅ Confirmar
                        </button>
                        <button 
                          onClick={() => handleCambiarEstado(cita.id, 'rechazada')} 
                          className="btn-reject"
                        >
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    {estado !== 'pendiente' && (
                      <button 
                        onClick={() => handleCambiarEstado(cita.id, 'pendiente')} 
                        className="btn-edit"
                      >
                        🔄 Volver a Pendiente
                      </button>
                    )}
                    <button onClick={() => handleDelete(cita.id)} className="btn-delete">
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitasManager;
