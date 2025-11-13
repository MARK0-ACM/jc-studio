// src/pages/CitasPage.js
import React from 'react';
import CitasForm from '../components/Citas/CitasForm'; // 1. Importar

const CitasPage = () => {
  return (
    <div className="container">
      {/* 2. Usar el componente aquí */}
      <CitasForm />
    </div>
  );
};

export default CitasPage;