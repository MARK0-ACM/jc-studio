import React, { useState } from 'react';
import axios from 'axios'; // 1. Importar axios
import { useNavigate } from 'react-router-dom'; // 2. Importar useNavigate
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // 3. Inicializar el hook de navegación

  // 4. Esta será la función de envío (handleSubmit) MODIFICADA
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    
    setError(''); // Limpiar errores previos

    try {
      // 5. ¡LA LLAMADA A LA API!
      // Llamamos a nuestro endpoint en el backend (localhost:4000)
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email: email,
        password: password
      });

      // 6. Si el login es Exitoso (recibimos el token y datos del usuario)
      const { token, user } = response.data;
      
      // Guardamos el token y los datos del usuario en el navegador
      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      console.log('¡Login exitoso!', { token, user });
      
      // 7. Redirigir según el rol del usuario
      const rol = user?.rol || 'cliente';
      
      if (rol === 'admin' || rol === 'jefe') {
        // Si es admin/jefe, redirigir al panel de administración
        alert(`¡Bienvenido ${user?.nombre || 'Administrador'}!`);
        navigate('/admin');
      } else {
        // Si es cliente, redirigir a "Mis Citas"
        alert(`¡Bienvenido ${user?.nombre || 'Cliente'}!`);
        navigate('/mis-citas');
      }

    } catch (err) {
      // 8. Si el login Falla (error 400, 401, 500)
      console.error('Error en el login:', err.response);
      
      if (err.response && err.response.data.error) {
        // Muestra el error que enviamos desde la API (ej: "Credenciales inválidas")
        setError(err.response.data.error);
      } else {
        setError('Error al conectar con el servidor.');
      }
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar Sesión</h2>
        
        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-submit">
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;