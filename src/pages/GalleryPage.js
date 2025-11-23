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
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar galería', error);
        setCargando(false);
      }
    };
    fetchFotos();
  }, []);

  return (
    <div className="gallery-page">
      <header className="gallery-header">
        <h1>Nuestra Galería</h1>
        <p>Un vistazo a nuestro trabajo y estilo.</p>
      </header>

      {cargando ? (
        <p className="loading">Cargando galería...</p>
      ) : (
        <div className="gallery-grid">
          {fotos.length === 0 ? (
            <p>No hay fotos disponibles por el momento.</p>
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

