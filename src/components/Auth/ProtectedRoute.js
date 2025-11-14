import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Revisamos si el token existe en el localStorage del navegador
  const token = localStorage.getItem('token');

  // 2. Lógica de la barrera
  if (!token) {
    // Si NO hay token, lo redirigimos a la página de login
    return <Navigate to="/login" replace />;
  }

  // 3. Si SÍ hay token, le damos permiso de ver el contenido
  // <Outlet /> es el componente que React Router usa 
  // para renderizar la página hija (en nuestro caso, AdminDashboardPage)
  return <Outlet />;
};

export default ProtectedRoute;