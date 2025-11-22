import React from 'react';
import ServicesManager from '../components/Admin/ServicesManager';
import PortfolioManager from '../components/Admin/PortfolioManager'; // 1. Importar
// import './AdminDashboardPage.css'; 

const AdminDashboardPage = () => {
  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h2>Panel de Administración</h2>
      <p>Bienvenido. Aquí puedes gestionar tu negocio.</p>
      
      <hr style={{ margin: '20px 0' }} />

      {/* Módulo de Servicios */}
      <section style={{ marginBottom: '40px' }}>
        <ServicesManager />
      </section>

      {/* Módulo de Portafolio */}
      <section>
        <PortfolioManager /> {/* 2. Usar */}
      </section>

    </div>
  );
};

export default AdminDashboardPage;