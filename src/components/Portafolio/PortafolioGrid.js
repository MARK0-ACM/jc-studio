import React from 'react';
import './Portafolio.css'; // Importamos los estilos

// 1. DATOS SIMULADOS (MOCK DATA)
const portafolioItems = [
  { id: 1, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+1', alt: 'Proyecto 1' },
  { id: 2, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+2', alt: 'Proyecto 2' },
  { id: 3, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+3', alt: 'Proyecto 3' },
  { id: 4, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+4', alt: 'Proyecto 4' },
  { id: 5, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+4', alt: 'Proyecto 5' },
  { id: 6, imgUrl: 'https://via.placeholder.com/400x300?text=Proyecto+4', alt: 'Proyecto 6' },

];

const PortafolioGrid = () => {
  return (
    <section id="portafolio" className="portafolio-section container">
      <h2>Portafolio</h2>
      
      <div className="portafolio-grid">
        {/* 2. Mapeamos los items del portafolio */}
        {portafolioItems.map((item) => (
          
          <div key={item.id} className="portafolio-item">
            <img src={item.imgUrl} alt={item.alt} />
          </div>

        ))}
      </div>
    </section>
  );
};

export default PortafolioGrid;