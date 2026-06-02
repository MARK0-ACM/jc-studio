import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PortfolioManager.css';
import { apiUrl } from '../../api';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = modo crear, objeto = modo editar
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(apiUrl('api/portafolio'));
      setItems(response.data);
    } catch (err) {
      console.error('Error al cargar portafolio:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setArchivo(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const openAddForm = () => {
    setEditingItem(null);
    setTitulo('');
    setDescripcion('');
    setArchivo(null);
    setPreview(null);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setTitulo(item.titulo);
    setDescripcion(item.descripcion || '');
    setArchivo(null);
    setPreview(apiUrl(`uploads/${item.imagen_url}`));
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setTitulo('');
    setDescripcion('');
    setArchivo(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!editingItem && !archivo) {
      setError('Por favor selecciona una imagen.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    if (archivo) formData.append('imagen', archivo);

    try {
      if (editingItem) {
        await axios.put(apiUrl(`api/portafolio/${editingItem.id}`), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(apiUrl('api/portafolio'), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      closeForm();
      fetchPortfolio();
    } catch (err) {
      console.error('Error completo:', err);
      // Mostrar el mensaje real del servidor para facilitar el diagnóstico
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.response?.data;
      const status = err?.response?.status;
      if (typeof serverMsg === 'string' && serverMsg) {
        setError(`Error ${status || ''}: ${serverMsg}`);
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('No se pudo conectar al servidor. ¿Está corriendo en el puerto 4000?');
      } else {
        setError(`Error al guardar (${status || err.message}). Revisa la consola del navegador (F12).`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(apiUrl(`api/portafolio/${id}`));
      setDeleteConfirm(null);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="portfolio-manager">
      {/* Header */}
      <div className="pm-header">
        <div className="pm-title-group">
          <span className="pm-label">Panel de Administración</span>
          <h2 className="pm-title">Portafolio</h2>
        </div>
        <button className="pm-btn-add" onClick={openAddForm}>
          <span className="pm-btn-icon">＋</span>
          Nueva Foto
        </button>
      </div>

      <div className="pm-stats">
        <span>{items.length} foto{items.length !== 1 ? 's' : ''} en galería</span>
      </div>

      {/* Modal de Formulario */}
      {showForm && (
        <div className="pm-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="pm-modal">
            <div className="pm-modal-header">
              <h3>{editingItem ? 'Editar Foto' : 'Agregar Nueva Foto'}</h3>
              <button className="pm-modal-close" onClick={closeForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="pm-form">
              {/* Zona de imagen */}
              <div
                className={`pm-dropzone ${preview ? 'has-preview' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="pm-preview-container">
                    <img src={preview} alt="Vista previa" className="pm-preview-img" />
                    <div className="pm-preview-overlay">
                      <span>Haz clic o arrastra para cambiar</span>
                    </div>
                  </div>
                ) : (
                  <div className="pm-dropzone-placeholder">
                    <div className="pm-dropzone-icon">🖼️</div>
                    <p className="pm-dropzone-text">Arrastra una imagen aquí</p>
                    <span className="pm-dropzone-sub">o haz clic para seleccionar</span>
                    <span className="pm-dropzone-formats">JPG, PNG, WEBP · Máx. 5MB</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="pm-file-input"
                  required={!editingItem}
                />
              </div>

              {/* Campos de texto */}
              <div className="pm-fields">
                <div className="pm-field-group">
                  <label className="pm-field-label">Título *</label>
                  <input
                    type="text"
                    className="pm-input"
                    placeholder="Ej: Corte degradado moderno"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="pm-field-group">
                  <label className="pm-field-label">Descripción</label>
                  <textarea
                    className="pm-textarea"
                    placeholder="Describe el trabajo realizado..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {error && <p className="pm-error">{error}</p>}

              <div className="pm-form-actions">
                <button type="button" className="pm-btn-cancel" onClick={closeForm}>
                  Cancelar
                </button>
                <button type="submit" className="pm-btn-save" disabled={loading}>
                  {loading ? (
                    <span className="pm-loading-spinner"></span>
                  ) : (
                    editingItem ? 'Guardar Cambios' : 'Subir Foto'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      {deleteConfirm && (
        <div className="pm-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="pm-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pm-confirm-icon">🗑️</div>
            <h4>¿Eliminar esta foto?</h4>
            <p>Esta acción no se puede deshacer.</p>
            <div className="pm-confirm-actions">
              <button className="pm-btn-cancel" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="pm-btn-delete" onClick={() => handleDelete(deleteConfirm)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galería */}
      {items.length === 0 ? (
        <div className="pm-empty">
          <div className="pm-empty-icon">📷</div>
          <h4>Sin fotos todavía</h4>
          <p>Agrega tu primera foto al portafolio</p>
          <button className="pm-btn-add" onClick={openAddForm}>Agregar foto</button>
        </div>
      ) : (
        <div className="pm-gallery">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="pm-card"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="pm-card-img-wrapper">
                <img
                  src={apiUrl(`uploads/${item.imagen_url}`)}
                  alt={item.titulo}
                  className="pm-card-img"
                />
                <div className="pm-card-actions-overlay">
                  <button
                    className="pm-overlay-btn pm-overlay-edit"
                    onClick={() => openEditForm(item)}
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="pm-overlay-btn pm-overlay-delete"
                    onClick={() => setDeleteConfirm(item.id)}
                    title="Eliminar"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
              <div className="pm-card-info">
                <h4 className="pm-card-title">{item.titulo}</h4>
                {item.descripcion && (
                  <p className="pm-card-desc">{item.descripcion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;