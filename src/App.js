import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CitasPage from './pages/CitasPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import RegisterPage from './pages/RegisterPage';
import MisCitasPage from './pages/MisCitasPage';

// 1. Importar los nuevos componentes
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* --- Rutas Públicas --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/citas" element={<CitasPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/galeria" element={<GalleryPage />} />

          {/* --- Rutas Privadas (Requieren Autenticación) --- */}
          <Route element={<ProtectedRoute />}>
            {/* Panel de Administración (Solo Admin/Jefe) */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* Mis Citas (Para Clientes) */}
            <Route path="/mis-citas" element={<MisCitasPage />} />
          </Route>

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;