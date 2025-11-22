import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">JC Studio</Link>
      </div>
      
      <ul className="navbar-links">
        {/* Enlaces Informativos */}
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/galeria">Galería</Link></li>
        
        {/* Enlace de Acción (CTA) - Le pondremos una clase especial */}
        <li>
            <Link to="/citas" className="nav-cta">Agendar Cita</Link>
        </li>

        {/* Lógica de Admin */}
        {token ? (
          <>
            <li className="admin-separator">|</li> {/* Separador visual */}
            <li><Link to="/admin" className="admin-link">Panel Admin</Link></li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Salir
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login" className="login-link">Admin</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;