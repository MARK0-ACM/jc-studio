import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CitasPage from './pages/CitasPage';

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
          <Route path="/citas" element={<CitasPage />} />

          {/* --- Rutas Privadas (Admin) --- */}
          {/* 2. Esta es la nueva lógica */}
          <Route element={<ProtectedRoute />}>
            {/* Todas las rutas "hijas" aquí adentro estarán protegidas */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            {/* Si tuvieras más rutas de admin, irían aquí: */}
            {/* <Route path="/admin/servicios" element={<AdminServicios />} /> */}
            {/* <Route path="/admin/portafolio" element={<AdminPortafolio />} /> */}
          </Route>

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;