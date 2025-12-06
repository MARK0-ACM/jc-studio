import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MisCitasPage.css';

const MisCitasPage = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMisCitas();
  }, []);

  const fetchMisCitas = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No estás autenticado. Por favor, inicia sesión.');
        setCargando(false);
        return;
      }

      // Hacer petición al backend con el token en el header
      // El backend filtra automáticamente: admin ve todas, cliente ve solo las suyas
      const response = await axios.get('http://localhost:4000/api/citas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCitas(response.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al cargar mis citas:', err);
      
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
      } else {
        setError(err.response?.data?.error || 'Error al cargar tus citas. Intenta nuevamente.');
      }
      
      setCargando(false);
    }
  };

  // Función para formatear fecha
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
      console.error('Error al formatear fecha:', error);
      return 'Error al formatear fecha';
    }
  };

  // Función para obtener el color del badge según el estado
  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'estado-confirmada';
      case 'rechazada':
        return 'estado-rechazada';
      case 'cancelada':
        return 'estado-cancelada';
      default:
        return 'estado-pendiente';
    }
  };

  // Función para obtener el texto del estado
  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return '✅ Confirmada';
      case 'rechazada':
        return '❌ Rechazada';
      case 'cancelada':
        return '🚫 Cancelada';
      default:
        return '⏳ En Espera';
    }
  };

  // Función para verificar si una cita puede cancelarse
  const puedeCancelar = (cita) => {
    // Solo se pueden cancelar citas pendientes o confirmadas
    if (cita.estado !== 'pendiente' && cita.estado !== 'confirmada') {
      return false;
    }

    // Verificar que haya al menos 1 hora antes de la cita
    const fechaCita = new Date(cita.fecha_hora);
    const ahora = new Date();
    const diferenciaMs = fechaCita.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);

    return diferenciaHoras >= 1; // Mínimo 1 hora antes
  };

  // Función para obtener el tiempo restante antes de la cita
  const obtenerTiempoRestante = (cita) => {
    const fechaCita = new Date(cita.fecha_hora);
    const ahora = new Date();
    const diferenciaMs = fechaCita.getTime() - ahora.getTime();
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    const diferenciaMinutos = Math.floor(diferenciaMs / (1000 * 60));

    if (diferenciaHoras >= 24) {
      const dias = Math.floor(diferenciaHoras / 24);
      return `${dias} día(s)`;
    } else if (diferenciaHoras >= 1) {
      return `${Math.floor(diferenciaHoras)} hora(s)`;
    } else {
      return `${diferenciaMinutos} minuto(s)`;
    }
  };

  // Helper para formatear teléfono a formato WhatsApp (asumiendo México +52)
  const formatearTelefonoWhatsApp = (telefono) => {
    if (!telefono) return '';
    // Quitar espacios, guiones y otros caracteres
    let limpio = String(telefono).replace(/[^0-9]/g, '');
    if (!limpio) return '';
    // Si ya empieza con 52, lo dejamos; si no, lo agregamos
    if (!limpio.startsWith('52')) {
      limpio = '52' + limpio;
    }
    return limpio;
  };

  // Función para formatear fecha para mensaje de WhatsApp
  const formatearFechaWhatsApp = (fechaString) => {
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
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };

  // Función para cancelar una cita
  const handleCancelarCita = async (citaId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:4000/api/citas/${citaId}/cancelar`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      alert(response.data.message || 'Cita cancelada exitosamente');
      fetchMisCitas(); // Recargar la lista

      // Notificar al admin por WhatsApp si hay datos disponibles
      if (response.data.notificarAdmin && response.data.adminTelefono && response.data.citaInfo) {
        const adminTelefono = formatearTelefonoWhatsApp(response.data.adminTelefono);
        const citaInfo = response.data.citaInfo;
        const fechaTexto = formatearFechaWhatsApp(citaInfo.fechaHora);

        if (adminTelefono) {
          const mensajeWhatsApp =
            `🔔 NOTIFICACIÓN: Cancelación de Cita%0A%0A` +
            `👤 Cliente: ${citaInfo.clienteNombre}%0A` +
            `📧 Email: ${citaInfo.clienteEmail}%0A` +
            `📅 Fecha y hora: ${fechaTexto}%0A` +
            `💇 Servicio: ${citaInfo.servicioNombre}%0A` +
            (citaInfo.precio ? `💰 Precio: $${citaInfo.precio}%0A` : '') +
            `%0A⚠️ Esta cita fue cancelada por el cliente.`;

          const urlWhatsApp = `https://wa.me/${adminTelefono}?text=${mensajeWhatsApp}`;
          window.open(urlWhatsApp, '_blank');
        }
      }
    } catch (err) {
      console.error('Error al cancelar cita:', err);
      const errorMsg = err.response?.data?.error || 'Error al cancelar la cita. Intenta nuevamente.';
      alert(errorMsg);
    }
  };

  if (cargando) {
    return (
      <div className="mis-citas-page">
        <div className="loading-container">
          <p>Cargando tus citas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-citas-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mis-citas-page">
      <header className="mis-citas-header">
        <h1>Mis Citas</h1>
        <p>Aquí puedes ver el historial de todas tus citas agendadas</p>
      </header>

      {citas.length === 0 ? (
        <div className="no-citas">
          <p>No tienes citas agendadas aún.</p>
          <a href="/citas" className="btn-agendar">Agendar una Cita</a>
        </div>
      ) : (
        <div className="citas-container">
          <div className="citas-grid">
            {citas.map(cita => (
              <div key={cita.id} className="cita-card">
                <div className="cita-header">
                  <h3>{cita.servicio_nombre || 'Servicio'}</h3>
                  <span className={`cita-estado ${obtenerColorEstado(cita.estado)}`}>
                    {obtenerTextoEstado(cita.estado)}
                  </span>
                </div>
                
                <div className="cita-info">
                  <p><strong>📅 Fecha y Hora:</strong> {formatearFecha(cita.fecha_hora)}</p>
                  <p><strong>💰 Precio:</strong> ${cita.precio || 'N/A'}</p>
                  {cita.estado === 'confirmada' && (
                    <p className="mensaje-confirmada">
                      ✅ Tu cita ha sido confirmada. Te esperamos en la fecha y hora indicada.
                    </p>
                  )}
                  {cita.estado === 'rechazada' && (
                    <p className="mensaje-rechazada">
                      ❌ Lo sentimos, esta cita fue rechazada. Puedes agendar una nueva cita.
                    </p>
                  )}
                  {cita.estado === 'cancelada' && (
                    <p className="mensaje-cancelada">
                      🚫 Esta cita fue cancelada.
                    </p>
                  )}
                  {puedeCancelar(cita) && (
                    <div className="cita-acciones">
                      <p className="info-cancelacion">
                        ⏰ Tiempo restante: {obtenerTiempoRestante(cita)} antes de la cita
                      </p>
                      <button 
                        onClick={() => handleCancelarCita(cita.id)}
                        className="btn-cancelar-cita"
                      >
                        🚫 Cancelar Cita
                      </button>
                    </div>
                  )}
                  {!puedeCancelar(cita) && (cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                    <p className="mensaje-no-cancelable">
                      ⚠️ Esta cita no puede cancelarse en línea porque está muy cerca de la hora programada. 
                      Por favor, contacta directamente con el establecimiento.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCitasPage;

