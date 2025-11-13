// src/pages/HomePage.js
import React from 'react';
import Hero from '../components/Hero/Hero';
import ServiciosList from '../components/Servicios/ServiciosList';
import PortafolioGrid from '../components/Portafolio/PortafolioGrid'; // 1. Importar

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ServiciosList />
      <PortafolioGrid /> {/* 2. Agregar el componente aquí */}
    </div>
  );
};

export default HomePage;