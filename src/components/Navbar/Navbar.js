import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Para detectar la ruta actual
  const token = localStorage.getItem('token');
  
  // Obtener datos del usuario si está autenticado
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const rol = user?.rol || null;

  // Función para verificar si un enlace está activo
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">JC Studio</Link>
      </div>
      
      <ul className="navbar-links">
        {/* Enlaces Informativos */}
        <li>
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/servicios" className={isActive('/servicios') ? 'active' : ''}>
            Servicios
          </Link>
        </li>
        <li>
          <Link to="/galeria" className={isActive('/galeria') ? 'active' : ''}>
            Galería
          </Link>
        </li>
        
        {/* Enlace de Acción (CTA) */}
        <li>
          <Link 
            to="/citas" 
            className={`nav-cta ${isActive('/citas') ? 'active' : ''}`}
          >
            Agendar Cita
          </Link>
        </li>

        {/* Lógica de Autenticación - Mostrar según rol */}
        {token ? (
          <>
            <li className="admin-separator">|</li> {/* Separador visual */}
            {rol === 'admin' || rol === 'jefe' ? (
              <li>
                <Link 
                  to="/admin" 
                  className={`admin-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  Panel Admin
                </Link>
              </li>
            ) : (
              <li>
                <Link 
                  to="/mis-citas" 
                  className={`admin-link ${isActive('/mis-citas') ? 'active' : ''}`}
                >
                  Mis Citas
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Salir
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link 
                to="/login" 
                className={`login-link ${isActive('/login') ? 'active' : ''}`}
              >
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className={`login-link ${isActive('/register') ? 'active' : ''}`}
              >
                Registrarse
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;