import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


function decodeJwtPayload(jwtToken) {
  try {
    const parts = String(jwtToken).split('.');
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');


  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeJwtPayload(token);
  const rol = payload?.rol;
  const esAdmin = rol === 'admin' || rol === 'jefe';

  if (!esAdmin) {
    // Clientes: solo pueden ver sus rutas.
    // Si intenta entrar a algo que no es /mi-cuenta o /mis-citas, lo mandamos a /mi-cuenta.
    if (location.pathname === '/mi-cuenta' || location.pathname === '/mis-citas') {
      return <Outlet />;
    }

    return <Navigate to="/mi-cuenta" replace />;
  }


  return <Outlet />;
};

export default ProtectedRoute;

