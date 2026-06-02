import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './PreguntasConsejosPage.css';
import { apiUrl } from '../api';

const PreguntasConsejosPage = () => {
  const [zona, setZona] = useState('superior');
  const [data, setData] = useState({ zonas: [], faq: [], prepost: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await axios.get(apiUrl('api/preguntas-consejos'));
        setData(res.data || { zonas: [], faq: [], prepost: [] });

        // Garantizar que exista la zona seleccionada
        const existe = (res.data?.zonas || []).some((z) => z.slug === zona);
        if (!existe && (res.data?.zonas || []).length > 0) {
          setZona(res.data.zonas[0].slug);
        }
      } catch (err) {
        console.error('Error cargando preguntas y consejos:', err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contenidoZona = useMemo(() => {
    return (data.zonas || []).find((z) => z.slug === zona) || null;
  }, [data.zonas, zona]);

  const renderReglas = (texto) => {
    if (!texto) return null;
    const partes = String(texto)
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return (
      <ul className="pp-list">
        {partes.map((p, idx) => (
          <li key={idx}>{p}</li>
        ))}
      </ul>
    );
  };

  const renderAclaracion = (texto) => {
    if (!texto) return null;
    // Guardamos el texto como multi-linea. Lo mostramos como lista si contiene saltos.
    const partes = String(texto)
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (partes.length <= 1) return <p>{texto}</p>;

    return (
      <>
        <p className="pp-uses"><strong>{partes[0]}</strong></p>
        <ul className="pp-list">
          {partes.slice(1).map((p, idx) => (
            <li key={idx}>{p}</li>
          ))}
        </ul>
      </>
    );
  };

  const zonasOrdenadas = data.zonas || [];

  return (
    <div className="pp-page">
      <section className="pp-hero">
        <div className="pp-container">
          <span className="pp-eyebrow">Preguntas y consejos</span>
          <h1 className="pp-title">¿Tienes dudas? </h1>
          <p className="pp-subtitle">
            Elige la zona que te preocupa y revisa comparativas claras para tomar una decisión informada.
          </p>

          <div className="pp-cta-row">
            <a className="pp-cta" href="/citas">Agendar cita</a>
            <a className="pp-cta pp-cta-outline" href="/servicios">Ver servicios</a>
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-container">
          <div className="pp-filtro-header">
            <div>
              <span className="pp-section-eyebrow">Filtro por Preocupación o Zona</span>
              <h2 className="pp-section-title">Selecciona la zona que te genera dudas.</h2>
            </div>
          </div>

          <div className="pp-filtro-grid" role="tablist" aria-label="Filtro por zona">
            {zonasOrdenadas.map((z) => (
              <button
                key={z.slug}
                type="button"
                className={`pp-zone-btn ${zona === z.slug ? 'active' : ''}`}
                onClick={() => setZona(z.slug)}
                role="tab"
                aria-selected={zona === z.slug}
              >
                <span className="pp-zone-icon">{z.slug === 'superior' ? '👁️' : z.slug === 'inferior' ? '💋' : '✨'}</span>
                {z.nombre}
              </button>
            ))}
          </div>

          <div className="pp-zona-card" role="tabpanel">
            {loading || !contenidoZona ? (
              <p className="pp-muted">Cargando contenido...</p>
            ) : (
              <>
                <h3 className="pp-zona-nombre">{contenidoZona.nombre}</h3>
                <p className="pp-gran-duda">{contenidoZona.gran_duda_titulo}</p>
                <div className="pp-aclaracion">{renderAclaracion(contenidoZona.aclaracion_texto)}</div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="pp-section pp-section-alt">
        <div className="pp-container">
          <span className="pp-section-eyebrow">Formato de Preguntas Frecuentes Automatizadas (FAQ)</span>
          <h2 className="pp-section-title">Respuestas a preguntas frecuentes</h2>

          <div className="pp-faq-grid">
            {(data.faq || []).map((item) => (
              <details key={item.id} className="pp-faq-item">
                <summary>{item.pregunta}</summary>
                <p>{item.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pp-section">
        <div className="pp-container">
          <span className="pp-section-eyebrow">Ideas de cuidado Pre y Post</span>
          <h2 className="pp-section-title">Cuida tu inversión (y evita riesgos)</h2>

          <div className="pp-post-grid">
            {(data.prepost || []).map((pp) => (
              <div
                key={pp.id}
                className={`pp-alert ${pp.variante === 'gold' ? 'pp-alert-gold' : 'pp-alert-soft'}`}
              >
                <h3>{pp.titulo}</h3>
                {renderReglas(pp.reglas_texto)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PreguntasConsejosPage;


