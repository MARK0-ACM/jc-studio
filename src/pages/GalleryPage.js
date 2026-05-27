import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GalleryPage.css';

const GalleryPage = () => {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/portafolio');
        setFotos(response.data);
      } catch (error) {
        console.error('Error al cargar galería', error);
      } finally {
        setCargando(false);
      }
    };
    fetchFotos();
  }, []);

  return (
    <div className="gallery-page">

      {/* Header */}
      <header className="gallery-header">
        <div className="gallery-eyebrow">Nuestro trabajo</div>
        <h1>Nuestra Galería</h1>
        <p>Un vistazo a nuestro arte y estilo.</p>
      </header>

      {/* Contenido */}
      {cargando ? (
        <p className="loading">Cargando galería...</p>
      ) : (
        <div className="gallery-grid">
          {fotos.length === 0 ? (
            <div className="gallery-empty">
              <div className="gallery-empty-icon">📷</div>
              <h4>Sin fotos todavía</h4>
              <p>Pronto compartiremos nuestro trabajo aquí.</p>
            </div>
          ) : (
            fotos.map((foto) => (
              <div key={foto.id} className="gallery-item">
                <img
                  src={`http://localhost:4000/uploads/${foto.imagen_url}`}
                  alt={foto.titulo || 'Foto del portafolio'}
                  className="gallery-image"
                />
                <div className="gallery-overlay">
                  <h3>{foto.titulo}</h3>
                  {foto.descripcion && <p>{foto.descripcion}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;