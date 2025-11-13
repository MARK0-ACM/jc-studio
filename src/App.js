// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes del Marco
import Navbar from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer'; // 1. Importar el Footer

// Páginas
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CitasPage from './pages/CitasPage';

function App() {
  return (
    <div className="App">
      
      <Navbar /> 

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/citas" element={<CitasPage />} />
        </Routes>
      </main>

      <Footer /> {/* 2. Agregar el Footer aquí */}
      
    </div>
  );
}

export default App;