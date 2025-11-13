import React from 'react';
import { Link } from 'react-router-dom'; // 1. Importamos <Link> para la navegación
import './Navbar.css'; // 2. Importamos los estilos

const Navbar = () => {
  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="logo">
          {/* El logo nos lleva al inicio */}
          <Link to="/">JC Studio</Link>
        </div>
        
        <ul className="nav-links">
          {/* Enlaces de navegación */}
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/citas" className="btn-cta">Agendar Cita</Link>
          </li>
          <li>
            <Link to="/login">Iniciar Sesión</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;