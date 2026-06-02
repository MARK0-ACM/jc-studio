import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AccountPage.css';

const API_BASE = 'http://localhost:4000';

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);


  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userStr || !token) {
        setLoading(false);
        return;
      }
      const u = JSON.parse(userStr);
      setUser(u);
      setEmail(u.email || '');
      setNombre(u.nombre || '');
      setTelefono(u.telefono || '');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `${API_BASE}/api/users/me`,
        {
          nombre: nombre.trim() || undefined,
          telefono: telefono.trim() || undefined,
          email: email.trim() || undefined,
          // Si se cambia email, backend exige contraseña actual
          currentPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );


      // Actualizar localStorage (usamos lo que tengamos en pantalla)
      const updated = {
        ...(user || {}),
        nombre: nombre.trim() || user?.nombre,
        email: email.trim() || user?.email,
      };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);

      setMessage('Datos actualizados correctamente.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Error actualizando datos.');
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const token = localStorage.getItem('token');

    try {
      await axios.patch(
        `${API_BASE}/api/users/me/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentPassword('');
      setNewPassword('');
      setMessage('Contraseña actualizada correctamente.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Error actualizando contraseña.');
    }
  };

  if (loading) {
    return <div className="account-page">Cargando...</div>;
  }

  return (
    <div className="account-page">
      <h1 className="account-title">Mi cuenta</h1>

      <div className="account-card">
        <h2>Actualizar datos</h2>

        <form onSubmit={submitUpdate} className="account-form">
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
          </label>

          <label>
            Teléfono
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Tu teléfono" />
          </label>

          <label>
            Email
            <input value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
          </label>

          <label>
            Contraseña actual (requerida si cambias el email)
            <div className="password-field">
              <input
                value={currentPassword}
                type={showCurrentPassword ? 'text' : 'password'}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showCurrentPassword ? '👁️' : '🙈'}

              </button>
            </div>
          </label>

          <button type="submit" className="btn-save">Guardar cambios</button>
        </form>

      </div>

      <div className="account-card">
        <h2>Cambiar contraseña</h2>

        <form onSubmit={submitPassword} className="account-form">
          <label>
            Contraseña actual
            <div className="password-field">
              <input
                value={currentPassword}
                type={showCurrentPassword ? 'text' : 'password'}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showCurrentPassword ? '👁️' : '🙈'}

              </button>
            </div>
          </label>

          <label>
            Nueva contraseña
            <div className="password-field">
              <input
                value={newPassword}
                type={showNewPassword ? 'text' : 'password'}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showNewPassword ? '👁️' : '🙈'}

              </button>
            </div>
          </label>


          <button type="submit" className="btn-save">Actualizar contraseña</button>
        </form>
      </div>

      {message && <div className="account-message account-message--ok">{message}</div>}
      {error && <div className="account-message account-message--err">{error}</div>}
    </div>
  );
};

export default AccountPage;

