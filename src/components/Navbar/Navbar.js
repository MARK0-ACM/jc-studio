import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const rol = user?.rol || null;
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu}>JC Studio</Link>
        </div>

        {/* Links escritorio */}
        <ul className="navbar-links navbar-desktop">
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>Inicio</Link></li>
          <li><Link to="/servicios" className={isActive('/servicios') ? 'active' : ''}>Servicios</Link></li>
          <li><Link to="/galeria" className={isActive('/galeria') ? 'active' : ''}>Galería</Link></li>
          <li><Link to="/preguntas-y-consejos" className={isActive('/preguntas-y-consejos') ? 'active' : ''}>Preguntas y Consejos</Link></li>
          <li><Link to="/citas" className={`nav-cta ${isActive('/citas') ? 'active' : ''}`}>Agendar Cita</Link></li>

          {token ? (
            <>
              <li className="admin-separator">|</li>

              <li><Link to="/mi-cuenta" className={`admin-link ${isActive('/mi-cuenta') ? 'active' : ''}`}>Mi Cuenta</Link></li>

              {rol === 'admin' || rol === 'jefe' ? (
                <li><Link to="/admin" className={`admin-link ${isActive('/admin') ? 'active' : ''}`}>Panel Admin</Link></li>
              ) : (
                <li><Link to="/mis-citas" className={`admin-link ${isActive('/mis-citas') ? 'active' : ''}`}>Mis Citas</Link></li>
              )}
              <li><button onClick={handleLogout} className="btn-logout">Salir</button></li>
            </>
          ) : (

            <>
              <li><Link to="/login" className={`login-link ${isActive('/login') ? 'active' : ''}`}>Iniciar Sesión</Link></li>
              <li><Link to="/register" className={`login-link ${isActive('/register') ? 'active' : ''}`}>Registrarse</Link></li>
            </>
          )}
        </ul>

        {/* Botón hamburguesa móvil */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Menú móvil overlay */}
      {menuOpen && (
        <div className="navbar-mobile-overlay" onClick={closeMenu}>
          <div className="navbar-mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="mobile-menu-logo">JC Studio</span>
              <button className="mobile-menu-close" onClick={closeMenu}>✕</button>
            </div>

            <ul className="mobile-menu-links">
              <li><Link to="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>Inicio</Link></li>
              <li><Link to="/servicios" className={isActive('/servicios') ? 'active' : ''} onClick={closeMenu}>Servicios</Link></li>
              <li><Link to="/galeria" className={isActive('/galeria') ? 'active' : ''} onClick={closeMenu}>Galería</Link></li>
              <li><Link to="/preguntas-y-consejos" className={isActive('/preguntas-y-consejos') ? 'active' : ''} onClick={closeMenu}>Preguntas y Consejos</Link></li>

              <li className="mobile-menu-divider"></li>


              <li>
                <Link to="/citas" className="mobile-cta" onClick={closeMenu}>
                  Agendar Cita
                </Link>
              </li>

              {token ? (
                <>
                  <li><Link to="/mi-cuenta" onClick={closeMenu}>Mi Cuenta</Link></li>

                  {rol === 'admin' || rol === 'jefe' ? (
                    <li><Link to="/admin" onClick={closeMenu}>Panel Admin</Link></li>
                  ) : (
                    <li><Link to="/mis-citas" onClick={closeMenu}>Mis Citas</Link></li>
                  )}

                  <li>
                    <button onClick={handleLogout} className="mobile-logout">Salir</button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" onClick={closeMenu}>Iniciar Sesión</Link></li>
                  <li><Link to="/register" onClick={closeMenu}>Registrarse</Link></li>
                </>
              )}

            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;