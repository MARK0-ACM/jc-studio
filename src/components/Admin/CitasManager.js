import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CitasManager.css';
import { apiUrl } from '../../api';


const CitasManager = () => {
  const [citas, setCitas] = useState([]);
  const [toast, setToast] = useState(null);



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

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [ordenFecha, setOrdenFecha] = useState('desc'); // 'asc' | 'desc'

  // Helper para obtener headers con token (Admin autenticado)
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Cargar citas y servicios al iniciar
  useEffect(() => {
    fetchCitas();
    fetchServicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await axios.get(apiUrl('api/citas'), {

        headers: getAuthHeaders()
      });
      setCitas(response.data || []);
      setCargando(false);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError('Error al cargar las citas');
      setCargando(false);
    }
  };

  const fetchServicios = async () => {
    try {
      const response = await axios.get(apiUrl('api/servicios'), {

        headers: getAuthHeaders()
      });
      setServicios(response.data || []);
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


    // Si se agendó correctamente, notificar inmediatamente al admin (solo UI)
    // Nota: el recordatorio por 1 hora / 30 min se hará con el cron/local timer.



    try {
      await axios.post(
        apiUrl('api/citas'),

        {
          ...form,
          servicioId: parseInt(form.servicioId)
        },
        { headers: getAuthHeaders() }
      );

      alert('Cita creada exitosamente');
      setForm({ nombre: '', email: '', fecha: '', servicioId: '' });
      fetchCitas();

      // Notificación UI al admin: cita agendada (inmediata)
      const msg = '✅ Cita agendada. El admin ya puede prepararse.';
      setToast({ id: Date.now(), type: 'info', message: msg });
      setTimeout(() => {
        setToast((t) => (t && t.message === msg ? null : t));
      }, 8000);


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
      await axios.delete(apiUrl(`api/citas/${id}`), {

        headers: getAuthHeaders()
      });
      fetchCitas();
      alert('Cita eliminada exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la cita');
    }
  };

  const formatearTelefonoWhatsApp = (telefono) => {
    if (!telefono) return '';
    const limpio = String(telefono).replace(/[^0-9]/g, '');
    if (!limpio) return '';
    if (limpio.startsWith('52')) return limpio;
    if (limpio.length === 10) return `52${limpio}`;
    return `52${limpio}`;
  };

  const crearMensajeWhatsApp = ({ estado, nombreCliente, servicioNombre, fechaTexto, precio }) => {
    const safeNombre = nombreCliente ? `*${nombreCliente}*` : 'Hola';

    if (estado === 'confirmada') {
      return (
        `Hola ${safeNombre}, tu cita en JC Studio ha sido *CONFIRMADA*.\n\n` +
        `📅 Fecha y hora: ${fechaTexto}\n` +
        `🛠️ Servicio: ${servicioNombre}\n` +
        (precio ? `💰 Precio: $${precio}\n` : '') +
        `\n¡Te esperamos!`
      );
    }

    if (estado === 'rechazada') {
      return (
        `Hola ${safeNombre}, lamentamos informarte que tu cita para *${fechaTexto}* ha sido *CANCELADA*.\n\n` +
        `🛠️ Servicio: ${servicioNombre}\n\n` +
        `Para reagendar, contáctanos. Estamos aquí para ayudarte. 🙏`
      );
    }

    return `Hola ${safeNombre}. Tu cita fue actualizada.`;
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'Fecha no disponible';
    try {
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) return 'Fecha inválida';
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

  const obtenerNombreServicio = (cita) => {
    if (cita.servicio_nombre) return cita.servicio_nombre;
    if (cita.servicio?.nombre) return cita.servicio.nombre;
    if (cita.nombre_servicio) return cita.nombre_servicio;

    const servicioId =
      cita.servicio_id ||
      cita.servicioId ||
      cita.id_servicio ||
      cita.servicio_id_cita ||
      cita.servicio?.id;

    if (servicioId || servicioId === 0) {
      const servicio = servicios.find((s) => {
        return (
          s.id === servicioId ||
          s.id === parseInt(servicioId) ||
          String(s.id) === String(servicioId) ||
          Number(s.id) === Number(servicioId)
        );
      });
      if (servicio) return servicio.nombre;
    }

    return 'Servicio no especificado';
  };

  const obtenerEstado = (cita) => cita.estado || cita.status || 'pendiente';

  const normalizarTexto = (s) => (s === null || s === undefined ? '' : String(s).toLowerCase().trim());

  const parseFechaCita = (cita) => {
    const fechaString =
      cita.fecha_hora ||
      cita.fecha ||
      cita.fecha_cita ||
      cita.fecha_hora_cita ||
      cita.fecha_agendada;
    if (!fechaString) return null;
    const d = new Date(fechaString);
    return isNaN(d.getTime()) ? null : d;
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {

    // Si se rechaza/cancela o cambia, opcionalmente podríamos cancelar recordatorios,
    // pero por ahora los recordatorios se disparan solo para citas futuras y se evita duplicar con localStorage.

    const citaSeleccionada = citas.find((c) => c.id === id);

    try {
      await axios.patch(
        apiUrl(`api/citas/${id}/estado`),
        { estado: nuevoEstado },
        { headers: getAuthHeaders() }
      );

      fetchCitas();

      const mensajeBase =
        nuevoEstado === 'confirmada'
          ? 'Cita confirmada exitosamente'
          : nuevoEstado === 'rechazada'
            ? 'Cita rechazada exitosamente'
            : `Cita actualizada a: ${nuevoEstado}`;

      alert(mensajeBase);

      if ((nuevoEstado === 'confirmada' || nuevoEstado === 'rechazada') && citaSeleccionada) {
        const telefono = citaSeleccionada.cliente_telefono || citaSeleccionada.telefono;
        const waTelefono = formatearTelefonoWhatsApp(telefono);

        if (waTelefono) {
          const nombreCliente = citaSeleccionada.cliente_nombre || citaSeleccionada.nombre || 'cliente';
          const servicioNombre = obtenerNombreServicio(citaSeleccionada);
          const fechaTexto = formatearFecha(
            citaSeleccionada.fecha_hora ||
              citaSeleccionada.fecha ||
              citaSeleccionada.fecha_cita ||
              citaSeleccionada.fecha_hora_cita ||
              citaSeleccionada.fecha_agendada
          );

          const mensajeWhatsApp = crearMensajeWhatsApp({
            estado: nuevoEstado,
            nombreCliente,
            servicioNombre,
            fechaTexto,
            precio: citaSeleccionada.precio
          });

          const urlWhatsApp = `https://wa.me/${waTelefono}?text=${encodeURIComponent(mensajeWhatsApp)}`;
          window.open(urlWhatsApp, '_blank');
        }
      }
    } catch (err) {
      console.error('Error con PATCH:', err);

      try {
        await axios.put(
          apiUrl(`api/citas/${id}/estado`),
          { estado: nuevoEstado },
          { headers: getAuthHeaders() }
        );

        fetchCitas();

        const mensaje =
          nuevoEstado === 'confirmada'
            ? 'Cita confirmada exitosamente'
            : nuevoEstado === 'rechazada'
              ? 'Cita rechazada exitosamente'
              : `Cita actualizada a: ${nuevoEstado}`;

        alert(mensaje);
      } catch (err2) {
        console.error('Error con PUT:', err2);
        const errorMsg =
          err2.response?.data?.error ||
          err2.response?.data?.message ||
          err2.message ||
          'Error desconocido';
        const statusCode = err2.response?.status || 'N/A';
        alert(`Error al cambiar el estado de la cita (${statusCode}): ${errorMsg}\n\nRevisa la consola para más detalles.`);
      }
    }
  };

  if (cargando) {
    return (
      <div className="citas-manager">
        <p>Cargando citas...</p>
      </div>
    );
  }

  // Corte por fecha: futuras (>= ahora) vs historial (pasadas)
  const ahora = new Date();

  const isFuture = (cita) => {
    const d = parseFechaCita(cita);
    if (!d) return false;
    return d.getTime() >= ahora.getTime();
  };

  const isPast = (cita) => {
    const d = parseFechaCita(cita);
    if (!d) return false;
    return d.getTime() < ahora.getTime();
  };

  // Contadores para la sección “Futuras (por atender)”
  const contadores = {
    todas: citas.filter((c) => isFuture(c)).length,
    pendiente: citas.filter((c) => isFuture(c) && obtenerEstado(c) === 'pendiente').length,
    confirmada: citas.filter((c) => isFuture(c) && obtenerEstado(c) === 'confirmada').length,
    rechazada: citas.filter((c) => isFuture(c) && obtenerEstado(c) === 'rechazada').length,

    historial: citas.filter((c) => isPast(c)).length
  };

  const citasFuturasBase =
    filtroEstado === 'todas'
      ? citas.filter((c) => isFuture(c))
      : citas.filter((c) => isFuture(c) && obtenerEstado(c) === filtroEstado);

  const citasHistorialBase = citas.filter((c) => isPast(c));

  const term = normalizarTexto(busqueda);
  const fechaDesdeObj = fechaDesde ? new Date(`${fechaDesde}T00:00:00`) : null;
  const fechaHastaObj = fechaHasta ? new Date(`${fechaHasta}T23:59:59`) : null;

  const filterAndSort = (lista, extraPastOrFutureFn) =>
    lista
      .filter((cita) => {
        const d = parseFechaCita(cita);
        if (!d) return false;

        if (extraPastOrFutureFn && !extraPastOrFutureFn(cita)) return false;

        const texto = [
          cita.cliente_nombre,
          cita.nombre,
          cita.nombre_cliente,
          cita.cliente_email,
          cita.email,
          cita.correo,
          cita.email_cliente,
          cita.correo_cliente,
          cita.cliente_telefono,
          cita.telefono,
          cita.telefono_cliente,
          obtenerNombreServicio(cita)
        ].join(' ');

        const matchBusqueda = !term || normalizarTexto(texto).includes(term);
        if (!matchBusqueda) return false;

        if (fechaDesdeObj && d < fechaDesdeObj) return false;
        if (fechaHastaObj && d > fechaHastaObj) return false;

        return true;
      })
      .sort((a, b) => {
        const da = parseFechaCita(a)?.getTime() ?? 0;
        const db = parseFechaCita(b)?.getTime() ?? 0;
        return ordenFecha === 'asc' ? da - db : db - da;
      });

  // FUTURAS
  const citasFuturasFiltradas = filterAndSort(citasFuturasBase);

  // HISTORIAL
  const citasHistorialFiltradas = filterAndSort(citasHistorialBase, isPast);

  const fechaToKey = (d) => {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return 'unknown';
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const hoyKey = fechaToKey(new Date());

  const citasHoy = citasFuturasFiltradas.filter((c) => {
    const d = parseFechaCita(c);
    return d ? fechaToKey(d) === hoyKey : false;
  });

  const citasFuturasTodasNormal = citasFuturasFiltradas.filter((c) => {
    const d = parseFechaCita(c);
    return d ? fechaToKey(d) !== hoyKey : false;
  });

  return (
    <div className="citas-manager">
      {toast && (
        <div className={`toast-admin toast-${toast.type || 'info'}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
      <h3>Gestión de Citas</h3>


      <details className="admin-form-container">
        <summary className="form-summary">➕ Agregar Nueva Cita Manualmente</summary>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del Cliente"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email del Cliente"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="datetime-local"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
            />
            <select name="servicioId" value={form.servicioId} onChange={handleChange} required>
              <option value="">Selecciona un servicio...</option>
              {servicios.map((servicio) => (
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

      {/* FILTROS */}
      <div className="citas-filtros">
        <div className="citas-filtros-top">
          <input
            className="citas-search"
            type="text"
            placeholder="Buscar por nombre, email, teléfono o servicio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="filtros-fechas">
            <label>
              Desde
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </label>
            <label>
              Hasta
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </label>
          </div>

          <div className="filtros-orden">
            <label>
              Orden
              <select value={ordenFecha} onChange={(e) => setOrdenFecha(e.target.value)}>
                <option value="desc">Más recientes</option>
                <option value="asc">Más antiguas</option>
              </select>
            </label>
          </div>

          <button
            className="btn-clear"
            type="button"
            onClick={() => {
              setBusqueda('');
              setFechaDesde('');
              setFechaHasta('');
              setOrdenFecha('desc');
              setFiltroEstado('todas');
            }}
          >
            Limpiar
          </button>
        </div>

      </div>

      {/* LISTA */}
      <div className="citas-list">
        <div className="citas-list-tabs">
          <button
            type="button"
            className={`filtro-btn ${filtroEstado === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('todas')}
          >
            Todas ({contadores.todas})
          </button>
          <button
            type="button"
            className={`filtro-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('pendiente')}
          >
            En Espera ({contadores.pendiente})
          </button>
          <button
            type="button"
            className={`filtro-btn ${filtroEstado === 'confirmada' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('confirmada')}
          >
            Confirmadas ({contadores.confirmada})
          </button>
          <button
            type="button"
            className={`filtro-btn ${filtroEstado === 'rechazada' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('rechazada')}
          >
            Rechazadas ({contadores.rechazada})
          </button>
          <button
            type="button"
            className={`filtro-btn ${filtroEstado === 'historial' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('historial')}
          >
            Historial ({contadores.historial})
          </button>
        </div>

        {/* FUTURAS */}
        {citasFuturasFiltradas.length === 0 ? (
          <p className="no-data">No hay citas futuras en esta categoría.</p>
        ) : (
          <>
            {/* Apartado Hoy */}
            {citasHoy.length > 0 && (
              <>
                <h5 className="citas-dia-titulo">📌 Hoy ({citasHoy.length})</h5>
                <div className="citas-grid">
                  {citasHoy.map((cita) => {
                    const estado = obtenerEstado(cita);
                    return (
                      <div key={cita.id} className={`cita-card cita-${estado}`}>
                        <div className="cita-header">
                          <h4>{cita.cliente_nombre || cita.nombre || cita.nombre_cliente || 'Sin nombre'}</h4>
                          <div className="cita-badges">
                            <span className={`cita-estado estado-${estado}`}>
                              {estado === 'pendiente'
                                ? '⏳ En Espera'
                                : estado === 'confirmada'
                                  ? '✅ Confirmada'
                                  : '❌ Rechazada'}
                            </span>
                            <span className="cita-id">#{cita.id}</span>
                          </div>
                        </div>

                        <div className="cita-info">
                          <p>
                            <strong>📞 Teléfono:</strong> {cita.cliente_telefono || cita.telefono || 'No registrado'}
                          </p>
                          <p>
                            <strong>📧 Email:</strong>{' '}
                            {cita.cliente_email ||
                              cita.email ||
                              cita.correo ||
                              cita.email_cliente ||
                              cita.correo_cliente ||
                              (cita.cliente && cita.cliente.email) ||
                              (cita.cliente && cita.cliente.correo) ||
                              'No especificado'}
                          </p>
                          <p>
                            <strong>📅 Fecha:</strong>{' '}
                            {formatearFecha(
                              cita.fecha_hora ||
                                cita.fecha ||
                                cita.fecha_cita ||
                                cita.fecha_hora_cita ||
                                cita.fecha_agendada
                            )}
                          </p>
                          <p>
                            <strong>💇 Servicio:</strong> {obtenerNombreServicio(cita)}
                          </p>
                        </div>

                        <div className="cita-actions">
                          {estado === 'pendiente' ? (
                            <>
                              <button onClick={() => handleCambiarEstado(cita.id, 'confirmada')} className="btn-confirm">
                                ✅ Confirmar
                              </button>
                              <button onClick={() => handleCambiarEstado(cita.id, 'rechazada')} className="btn-reject">
                                ❌ Rechazar
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleCambiarEstado(cita.id, 'pendiente')} className="btn-edit">
                              🔄 Volver a Pendiente
                            </button>
                          )}

                          {estado === 'confirmada' || estado === 'rechazada' ? (
                            <button onClick={() => handleDelete(cita.id)} className="btn-delete">
                              🗑️ Eliminar
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Apartado Futuras (resto) */}
            <h5 className="citas-dia-titulo">Todas (Futuras)</h5>
            <div className="citas-grid">
              {citasFuturasTodasNormal.map((cita) => {
                const estado = obtenerEstado(cita);
                return (
                  <div key={cita.id} className={`cita-card cita-${estado}`}>
                    <div className="cita-header">
                      <h4>{cita.cliente_nombre || cita.nombre || cita.nombre_cliente || 'Sin nombre'}</h4>
                      <div className="cita-badges">
                        <span className={`cita-estado estado-${estado}`}>
                          {estado === 'pendiente'
                            ? '⏳ En Espera'
                            : estado === 'confirmada'
                              ? '✅ Confirmada'
                              : '❌ Rechazada'}
                        </span>
                        <span className="cita-id">#{cita.id}</span>
                      </div>
                    </div>

                    <div className="cita-info">
                      <p>
                        <strong>📞 Teléfono:</strong> {cita.cliente_telefono || cita.telefono || 'No registrado'}
                      </p>
                      <p>
                        <strong>📧 Email:</strong>{' '}
                        {cita.cliente_email ||
                          cita.email ||
                          cita.correo ||
                          cita.email_cliente ||
                          cita.correo_cliente ||
                          (cita.cliente && cita.cliente.email) ||
                          (cita.cliente && cita.cliente.correo) ||
                          'No especificado'}
                      </p>
                      <p>
                        <strong>📅 Fecha:</strong>{' '}
                        {formatearFecha(
                          cita.fecha_hora ||
                            cita.fecha ||
                            cita.fecha_cita ||
                            cita.fecha_hora_cita ||
                            cita.fecha_agendada
                        )}
                      </p>
                      <p>
                        <strong>💇 Servicio:</strong> {obtenerNombreServicio(cita)}
                      </p>
                    </div>

                    <div className="cita-actions">
                      {estado === 'pendiente' ? (
                        <>
                          <button onClick={() => handleCambiarEstado(cita.id, 'confirmada')} className="btn-confirm">
                            ✅ Confirmar
                          </button>
                          <button onClick={() => handleCambiarEstado(cita.id, 'rechazada')} className="btn-reject">
                            ❌ Rechazar
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleCambiarEstado(cita.id, 'pendiente')} className="btn-edit">
                          🔄 Volver a Pendiente
                        </button>
                      )}

                      {estado === 'confirmada' || estado === 'rechazada' ? (
                        <button onClick={() => handleDelete(cita.id)} className="btn-delete">
                          🗑️ Eliminar
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* HISTORIAL */}
        {filtroEstado === 'historial' && (
          <>
            <h5 className="citas-dia-titulo" style={{ marginTop: 26 }}>
              📜 Historial (pasadas)
            </h5>
            {citasHistorialFiltradas.length === 0 ? (
              <p className="no-data">No hay citas pasadas en este rango.</p>
            ) : (
              <div className="citas-grid">
                {citasHistorialFiltradas.map((cita) => {
                  const estado = obtenerEstado(cita);
                  return (
                    <div key={cita.id} className={`cita-card cita-${estado}`}>
                      <div className="cita-header">
                        <h4>{cita.cliente_nombre || cita.nombre || cita.nombre_cliente || 'Sin nombre'}</h4>
                        <div className="cita-badges">
                          <span className={`cita-estado estado-${estado}`}>
                            {estado === 'pendiente'
                              ? '⏳ En Espera'
                              : estado === 'confirmada'
                                ? '✅ Confirmada'
                                : '❌ Rechazada'}
                          </span>
                          <span className="cita-id">#{cita.id}</span>
                        </div>
                      </div>

                      <div className="cita-info">
                        <p>
                          <strong>📞 Teléfono:</strong>{' '}
                          {cita.cliente_telefono || cita.telefono || 'No registrado'}
                        </p>
                        <p>
                          <strong>📧 Email:</strong>{' '}
                          {cita.cliente_email ||
                            cita.email ||
                            cita.correo ||
                            cita.email_cliente ||
                            cita.correo_cliente ||
                            (cita.cliente && cita.cliente.email) ||
                            (cita.cliente && cita.cliente.correo) ||
                            'No especificado'}
                        </p>
                        <p>
                          <strong>📅 Fecha:</strong>{' '}
                          {formatearFecha(
                            cita.fecha_hora ||
                              cita.fecha ||
                              cita.fecha_cita ||
                              cita.fecha_hora_cita ||
                              cita.fecha_agendada
                          )}
                        </p>
                        <p>
                          <strong>💇 Servicio:</strong> {obtenerNombreServicio(cita)}
                        </p>
                      </div>

                      <div className="cita-actions">
                        <button onClick={() => handleDelete(cita.id)} className="btn-delete">
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CitasManager;