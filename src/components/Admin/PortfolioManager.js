import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PortfolioManager.css';

const PortfolioManager = () => {
  const [items, setItems] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [archivo, setArchivo] = useState(null); // Aquí guardaremos el archivo seleccionado
  const [error, setError] = useState('');

  // 1. Cargar fotos al iniciar
  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/portafolio');
      setItems(response.data);
    } catch (err) {
      console.error('Error al cargar portafolio:', err);
    }
  };

  // 2. Manejar la selección del archivo
  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  // 3. Subir la imagen (POST con FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!archivo) {
      setError('Por favor selecciona una imagen.');
      return;
    }

    // CREAMOS EL FORM DATA (Es como el "form-data" de Postman)
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('imagen', archivo); // 'imagen' debe coincidir con el backend (upload.single('imagen'))

    try {
      await axios.post('http://localhost:4000/api/portafolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // ¡Importante para subir archivos!
        }
      });
      
      alert('Imagen subida exitosamente');
      // Limpiar formulario
      setTitulo('');
      setDescripcion('');
      setArchivo(null);
      // Resetear el input de archivo visualmente es un poco truco en React, 
      // por simplicidad dejaremos que el usuario vea que se limpió el estado.
      document.getElementById('fileInput').value = ""; 
      
      fetchPortfolio(); // Recargar lista

    } catch (err) {
      console.error(err);
      setError('Error al subir la imagen.');
    }
  };

  // 4. Eliminar imagen
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro de borrar esta foto?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/portafolio/${id}`);
      fetchPortfolio();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar imagen');
    }
  };

  return (
    <div className="portfolio-manager">
      <h3>Gestión del Portafolio</h3>

      {/* FORMULARIO DE SUBIDA */}
      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-group">
          <input 
            type="text" placeholder="Título" 
            value={titulo} onChange={(e) => setTitulo(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <textarea 
            placeholder="Descripción corta" 
            value={descripcion} onChange={(e) => setDescripcion(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <input 
            id="fileInput"
            type="file" 
            accept="image/*" // Solo acepta imágenes
            onChange={handleFileChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-upload">Subir Foto</button>
        {error && <p className="error-msg">{error}</p>}
      </form>

      {/* GALERÍA VISUAL */}
      <div className="gallery-grid">
        {items.map(item => (
          <div key={item.id} className="gallery-card">
            {/* OJO: La URL debe apuntar a tu backend/uploads */}
            <img 
              src={`http://localhost:4000/uploads/${item.imagen_url}`} 
              alt={item.titulo} 
              className="gallery-img"
            />
            <div className="gallery-info">
              <h4>{item.titulo}</h4>
              <p>{item.descripcion}</p>
              <button onClick={() => handleDelete(item.id)} className="btn-delete-img">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioManager;