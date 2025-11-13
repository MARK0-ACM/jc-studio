// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/Login/LoginForm'; // 1. Importar

const LoginPage = () => {
  return (
    <div className="container"> 
      {/* 2. Usar el componente aquí */}
      <LoginForm /> 
    </div>
  );
};

export default LoginPage;