import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.email || !formData.password || !formData.telefono) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setCargando(true);

    try {
      // Llamar al endpoint de registro
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono
      });

      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Redirigir al login después del registro exitoso
      navigate('/login');

    } catch (err) {
      console.error('Error en el registro:', err.response);
      
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al conectar con el servidor. Intenta nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="register-form-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Crear Cuenta</h2>
        <p className="form-subtitle">Regístrate para agendar tus citas</p>
        
        {/* Campo de Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre Completo:</label>
          <input 
            type="text" 
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
          />
        </div>

        {/* Campo de Email */}
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        {/* Campo de Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Teléfono:</label>
          <input 
            type="tel" 
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej: 1234567890"
            required
          />
        </div>

        {/* Campo de Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <div className="password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
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

        {/* Campo de Confirmar Contraseña */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              required
              minLength={6}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirmPassword ? '👁️' : '🙈'}
            </button>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="btn-submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>

        <p className="login-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;

