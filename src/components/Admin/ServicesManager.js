import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServicesManager.css';

const ServicesManager = () => {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    duracion_min: '',
    precio: ''
  });
  const [editingId, setEditingId] = useState(null); // null = modo crear, número = modo editar
  const [error, setError] = useState('');

  // 1. Cargar servicios al iniciar
  useEffect(() => {
    fetchServicios();
  }, []);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/servicios');
      setServicios(response.data);
    } catch (err) {
      console.error('Error al cargar servicios:', err);
    }
  };

  // 2. Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 3. Enviar formulario (Crear o Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        // MODO EDITAR (PUT)
        await axios.put(`http://localhost:4000/api/servicios/${editingId}`, form);
        alert('Servicio actualizado');
      } else {
        // MODO CREAR (POST)
        await axios.post('http://localhost:4000/api/servicios', form);
        alert('Servicio creado');
      }
      
      // Limpiar y recargar
      setForm({ nombre: '', descripcion: '', duracion_min: '', precio: '' });
      setEditingId(null);
      fetchServicios();

    } catch (err) {
      console.error(err);
      setError('Error al guardar el servicio');
    }
  };

  // 4. Preparar para editar
  const handleEdit = (servicio) => {
    setEditingId(servicio.id);
    setForm({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      duracion_min: servicio.duracion_min,
      precio: servicio.precio
    });
  };

  // 5. Eliminar servicio
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/servicios/${id}`);
      fetchServicios(); // Recargar lista
    } catch (err) {
      console.error(err);
      alert('Error al eliminar (quizás tiene citas asociadas)');
    }
  };

  // 6. Cancelar edición
  const handleCancel = () => {
    setEditingId(null);
    setForm({ nombre: '', descripcion: '', duracion_min: '', precio: '' });
  };

  return (
    <div className="services-manager">
      <h3>Gestión de Servicios</h3>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-row">
          <input 
            type="text" name="nombre" placeholder="Nombre del Servicio" 
            value={form.nombre} onChange={handleChange} required 
          />
          <input 
            type="number" name="precio" placeholder="Precio ($)" 
            value={form.precio} onChange={handleChange} required step="0.01"
          />
        </div>
        <div className="form-row">
          <input 
            type="number" name="duracion_min" placeholder="Duración (minutos)" 
            value={form.duracion_min} onChange={handleChange} required 
          />
        </div>
        <textarea 
          name="descripcion" placeholder="Descripción..." 
          value={form.descripcion} onChange={handleChange} required
        />
        
        <div className="form-actions">
          <button type="submit" className={editingId ? "btn-update" : "btn-create"}>
            {editingId ? 'Actualizar Servicio' : 'Agregar Servicio'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancelar
            </button>
          )}
        </div>
        {error && <p className="error-msg">{error}</p>}
      </form>

      {/* LISTA DE SERVICIOS */}
      <div className="services-list">
        <h4>Lista Actual</h4>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(servicio => (
              <tr key={servicio.id}>
                <td>{servicio.nombre}</td>
                <td>${servicio.precio}</td>
                <td>{servicio.duracion_min} min</td>
                <td>
                  <button onClick={() => handleEdit(servicio)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(servicio.id)} className="btn-delete">Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesManager;