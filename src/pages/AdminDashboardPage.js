import React, { useState } from 'react';
import ServicesManager from '../components/Admin/ServicesManager';
import PortfolioManager from '../components/Admin/PortfolioManager';
import CitasManager from '../components/Admin/CitasManager';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('servicios'); // Estado para la pestaña activa

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Panel de Administración</h2>
        <p>Gestiona los diferentes aspectos de tu negocio</p>
      </div>

      {/* Sistema de Pestañas */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'servicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('servicios')}
        >
          📋 Servicios
        </button>
        <button 
          className={`tab-button ${activeTab === 'galeria' ? 'active' : ''}`}
          onClick={() => setActiveTab('galeria')}
        >
          🖼️ Galería
        </button>
        <button 
          className={`tab-button ${activeTab === 'citas' ? 'active' : ''}`}
          onClick={() => setActiveTab('citas')}
        >
          📅 Citas
        </button>
      </div>

      {/* Contenido de las Pestañas */}
      <div className="admin-tab-content">
        {activeTab === 'servicios' && (
          <div className="tab-panel">
            <ServicesManager />
          </div>
        )}
        {activeTab === 'galeria' && (
          <div className="tab-panel">
            <PortfolioManager />
          </div>
        )}
        {activeTab === 'citas' && (
          <div className="tab-panel">
            <CitasManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;