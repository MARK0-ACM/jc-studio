import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Importar useNavigate
import './Navbar.css';

const Navbar = () => {
  // 2. Inicializar el hook de navegación
  const navigate = useNavigate();

  // 3. Revisamos si el token existe CADA VEZ que el Navbar se renderiza
  const token = localStorage.getItem('token');

  // 4. Función para manejar el "Cerrar Sesión"
  const handleLogout = () => {
    // Borramos el token del navegador
    localStorage.removeItem('token');
    
    // Redirigimos al usuario a la página de login
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">JC Studio</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/citas">Agendar Cita</Link></li>

        {/* 5. LÓGICA CONDICIONAL */}
        {token ? (
          // --- Si el usuario SÍ está logueado ---
          <>
            <li><Link to="/admin">Admin</Link></li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </li>
          </>
        ) : (
          // --- Si el usuario NO está logueado ---
          <li><Link to="/login">Login</Link></li>
        )}
        
      </ul>
    </nav>
  );
};

export default Navbar;