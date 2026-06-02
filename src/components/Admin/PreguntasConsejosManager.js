import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './PreguntasConsejosManager.css';

import { apiUrl } from '../../api';

const API = apiUrl('api/preguntas-consejos');

const PreguntasConsejosManager = () => {
  const [loading, setLoading] = useState(true);
  const [zonas, setZonas] = useState([]);
  const [faq, setFaq] = useState([]);
  const [prepost, setPrepost] = useState([]);

  // Zona form
  const [zonaEditId, setZonaEditId] = useState(null);
  const [zonaForm, setZonaForm] = useState({
    slug: '',
    nombre: '',
    gran_duda_titulo: '',
    gran_duda_texto: '',
    aclaracion_texto: '',
    orden: 0
  });

  // FAQ form
  const [faqEditId, setFaqEditId] = useState(null);
  const [faqForm, setFaqForm] = useState({ pregunta: '', respuesta: '', orden: 0 });

  // PrePost form
  const [ppEditId, setPpEditId] = useState(null);
  const [ppForm, setPpForm] = useState({
    tipo: 'post',
    titulo: '',
    reglas_texto: '',
    variante: 'soft',
    orden: 0
  });

  const [error, setError] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const cargar = async () => {
    try {
      setLoading(true);
      setError('');
      const headers = getAuthHeaders();

      const [zonasRes, faqRes, ppRes] = await Promise.all([
        axios.get(`${API}/admin/zonas`, { headers }),
        axios.get(`${API}/admin/faq`, { headers }),
        axios.get(`${API}/admin/prepost`, { headers })
      ]);

      setZonas(zonasRes.data || []);
      setFaq(faqRes.data || []);
      setPrepost(ppRes.data || []);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar el contenido. Revisa tu sesión (token) y el backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetZona = () => {
    setZonaEditId(null);
    setZonaForm({ slug: '', nombre: '', gran_duda_titulo: '', gran_duda_texto: '', aclaracion_texto: '', orden: 0 });
  };

  const resetFaq = () => {
    setFaqEditId(null);
    setFaqForm({ pregunta: '', respuesta: '', orden: 0 });
  };

  const resetPp = () => {
    setPpEditId(null);
    setPpForm({ tipo: 'post', titulo: '', reglas_texto: '', variante: 'soft', orden: 0 });
  };

  const handleZonaChange = (e) => {
    const { name, value } = e.target;
    if (name === 'orden') {
      const n = Number(value);
      // Evita negativos
      const safe = Number.isFinite(n) ? Math.max(0, n) : 0;
      setZonaForm((f) => ({ ...f, [name]: safe }));
      return;
    }
    setZonaForm((f) => ({ ...f, [name]: value }));
  };


  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    if (name === 'orden') {
      const n = Number(value);
      const safe = Number.isFinite(n) ? Math.max(0, n) : 0;
      setFaqForm((f) => ({ ...f, [name]: safe }));
      return;
    }
    setFaqForm((f) => ({ ...f, [name]: value }));
  };


  const handlePpChange = (e) => {
    const { name, value } = e.target;
    if (name === 'orden') {
      const n = Number(value);
      const safe = Number.isFinite(n) ? Math.max(0, n) : 0;
      setPpForm((f) => ({ ...f, [name]: safe }));
      return;
    }
    setPpForm((f) => ({ ...f, [name]: value }));
  };


  const submitZona = async (e) => {
    e.preventDefault();
    setError('');

    const headers = getAuthHeaders();

    try {
      if (zonaEditId) {
        await axios.put(`${API}/admin/zonas/${zonaEditId}`, {
          ...zonaForm,
          orden: Number(zonaForm.orden || 0)
        }, { headers });
      } else {
        await axios.post(`${API}/admin/zonas`, {
          ...zonaForm,
          orden: Number(zonaForm.orden || 0)
        }, { headers });
      }
      resetZona();
      await cargar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Error al guardar la zona.');
    }
  };

  const editZona = (z) => {
    setZonaEditId(z.id);
    setZonaForm({
      slug: z.slug || '',
      nombre: z.nombre || '',
      gran_duda_titulo: z.gran_duda_titulo || '',
      gran_duda_texto: z.gran_duda_texto || '',
      aclaracion_texto: z.aclaracion_texto || '',
      orden: z.orden ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteZona = async (id) => {
    if (!window.confirm('¿Eliminar esta zona?')) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API}/admin/zonas/${id}`, { headers });
      await cargar();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar zona.');
    }
  };

  const submitFaq = async (e) => {
    e.preventDefault();
    setError('');

    const headers = getAuthHeaders();

    try {
      if (faqEditId) {
        await axios.put(`${API}/admin/faq/${faqEditId}`, {
          ...faqForm,
          orden: Number(faqForm.orden || 0)
        }, { headers });
      } else {
        await axios.post(`${API}/admin/faq`, {
          ...faqForm,
          orden: Number(faqForm.orden || 0)
        }, { headers });
      }
      resetFaq();
      await cargar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Error al guardar FAQ.');
    }
  };

  const editFaq = (item) => {
    setFaqEditId(item.id);
    setFaqForm({ pregunta: item.pregunta || '', respuesta: item.respuesta || '', orden: item.orden ?? 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API}/admin/faq/${id}`, { headers });
      await cargar();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar FAQ.');
    }
  };

  const submitPp = async (e) => {
    e.preventDefault();
    setError('');

    const headers = getAuthHeaders();

    try {
      if (ppEditId) {
        await axios.put(`${API}/admin/prepost/${ppEditId}`, {
          ...ppForm,
          orden: Number(ppForm.orden || 0)
        }, { headers });
      } else {
        await axios.post(`${API}/admin/prepost`, {
          ...ppForm,
          orden: Number(ppForm.orden || 0)
        }, { headers });
      }
      resetPp();
      await cargar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Error al guardar pre/post.');
    }
  };

  const editPp = (item) => {
    setPpEditId(item.id);
    setPpForm({
      tipo: item.tipo || 'post',
      titulo: item.titulo || '',
      reglas_texto: item.reglas_texto || '',
      variante: item.variante || 'soft',
      orden: item.orden ?? 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deletePp = async (id) => {
    if (!window.confirm('¿Eliminar esta regla pre/post?')) return;
    const headers = getAuthHeaders();
    try {
      await axios.delete(`${API}/admin/prepost/${id}`, { headers });
      await cargar();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar pre/post.');
    }
  };

  const preItems = useMemo(() => (prepost || []).filter((x) => x.tipo === 'pre'), [prepost]);
  const postItems = useMemo(() => (prepost || []).filter((x) => x.tipo === 'post'), [prepost]);

  if (loading) {
    return (
      <div className="pcc-manager">
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="pcc-manager">
      <h3>Administrar Preguntas y Consejos</h3>
      <p className="pcc-hint">Admin/Jefe puede agregar, editar y eliminar contenido. Los cambios se reflejan en la página pública.</p>

      {error && <div className="pcc-error">{error}</div>}

      {/* ZONAS */}
      <div className="pcc-block">
        <h4>1) Zonas</h4>

        <form onSubmit={submitZona} className="pcc-form">
          <div className="pcc-row">
            <label>
              slug (superior/inferior/textura)
              <input name="slug" value={zonaForm.slug} onChange={handleZonaChange} required />
            </label>
            <label>
              nombre (texto visible)
              <input name="nombre" value={zonaForm.nombre} onChange={handleZonaChange} required />
            </label>
          </div>

          <div className="pcc-row">
            <label>
              orden
              <input type="number" name="orden" value={zonaForm.orden} onChange={handleZonaChange} />
            </label>
          </div>

          <label>
            Gran duda (título)
            <input name="gran_duda_titulo" value={zonaForm.gran_duda_titulo} onChange={handleZonaChange} required />
          </label>

          <label>
            Gran duda (texto)
            <textarea name="gran_duda_texto" value={zonaForm.gran_duda_texto} onChange={handleZonaChange} required rows={4} />
          </label>

          <label>
            Aclaración (texto con saltos de línea; puedes usar formato por párrafos)
            <textarea name="aclaracion_texto" value={zonaForm.aclaracion_texto} onChange={handleZonaChange} required rows={6} />
          </label>

          <div className="pcc-actions">
            <button className="pcc-btn" type="submit">{zonaEditId ? 'Actualizar zona' : 'Agregar zona'}</button>
            {zonaEditId && (
              <button type="button" className="pcc-btn pcc-btn-ghost" onClick={resetZona}>Cancelar</button>
            )}
          </div>
        </form>

        <div className="pcc-list">
          <table>
            <thead>
              <tr>
                <th>Slug</th>
                <th>Nombre</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(zonas || []).map((z) => (
                <tr key={z.id}>
                  <td>{z.slug}</td>
                  <td>{z.nombre}</td>
                  <td>{z.orden ?? 0}</td>
                  <td>
                    <button className="pcc-mini" onClick={() => editZona(z)}>✏️</button>
                    <button className="pcc-mini pcc-mini-danger" onClick={() => deleteZona(z.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="pcc-block">
        <h4>2) FAQ</h4>

        <form onSubmit={submitFaq} className="pcc-form">
          <div className="pcc-row">
            <label>
              orden
              <input type="number" name="orden" value={faqForm.orden} onChange={handleFaqChange} />
            </label>
          </div>
          <label>
            Pregunta
            <input name="pregunta" value={faqForm.pregunta} onChange={handleFaqChange} required />
          </label>
          <label>
            Respuesta
            <textarea name="respuesta" value={faqForm.respuesta} onChange={handleFaqChange} rows={4} required />
          </label>

          <div className="pcc-actions">
            <button className="pcc-btn" type="submit">{faqEditId ? 'Actualizar FAQ' : 'Agregar FAQ'}</button>
            {faqEditId && (
              <button type="button" className="pcc-btn pcc-btn-ghost" onClick={resetFaq}>Cancelar</button>
            )}
          </div>
        </form>

        <div className="pcc-list">
          <table>
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Orden</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(faq || []).map((item) => (
                <tr key={item.id}>
                  <td>{item.pregunta}</td>
                  <td>{item.orden ?? 0}</td>
                  <td>
                    <button className="pcc-mini" onClick={() => editFaq(item)}>✏️</button>
                    <button className="pcc-mini pcc-mini-danger" onClick={() => deleteFaq(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRE/POST */}
      <div className="pcc-block">
        <h4>3) Cuidado Pre y Post</h4>

        <form onSubmit={submitPp} className="pcc-form">
          <div className="pcc-row">
            <label>
              tipo (pre/post)
              <select name="tipo" value={ppForm.tipo} onChange={handlePpChange}>
                <option value="pre">pre</option>
                <option value="post">post</option>
              </select>
            </label>
            <label>
              variante (gold/soft)
              <select name="variante" value={ppForm.variante} onChange={handlePpChange}>
                <option value="gold">gold</option>
                <option value="soft">soft</option>
              </select>
            </label>
            <label>
              orden
              <input type="number" name="orden" value={ppForm.orden} onChange={handlePpChange} />
            </label>
          </div>

          <label>
            Título (aparece en la tarjeta)
            <input name="titulo" value={ppForm.titulo} onChange={handlePpChange} required />
          </label>

          <label>
            Reglas (un renglón por punto; separa con saltos de línea)
            <textarea name="reglas_texto" value={ppForm.reglas_texto} onChange={handlePpChange} rows={6} required />
          </label>

          <div className="pcc-actions">
            <button className="pcc-btn" type="submit">{ppEditId ? 'Actualizar regla' : 'Agregar regla'}</button>
            {ppEditId && (
              <button type="button" className="pcc-btn pcc-btn-ghost" onClick={resetPp}>Cancelar</button>
            )}
          </div>
        </form>

        <div className="pcc-split">
          <div className="pcc-col">
            <h5>Pre</h5>
            <div className="pcc-list">
              <table>
                <thead>
                  <tr><th>Título</th><th>Orden</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {preItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.titulo}</td>
                      <td>{item.orden ?? 0}</td>
                      <td>
                        <button className="pcc-mini" onClick={() => editPp(item)}>✏️</button>
                        <button className="pcc-mini pcc-mini-danger" onClick={() => deletePp(item.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pcc-col">
            <h5>Post</h5>
            <div className="pcc-list">
              <table>
                <thead>
                  <tr><th>Título</th><th>Orden</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {postItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.titulo}</td>
                      <td>{item.orden ?? 0}</td>
                      <td>
                        <button className="pcc-mini" onClick={() => editPp(item)}>✏️</button>
                        <button className="pcc-mini pcc-mini-danger" onClick={() => deletePp(item.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreguntasConsejosManager;

