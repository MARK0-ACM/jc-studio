import React from 'react';
import './Footer.css'; // Importamos los estilos

const Footer = () => {
  const phone = '351-147-9299';
  const email = 'yusagitario47@gmail.com';
  const facebookUrl = 'https://www.facebook.com/share/18yX33ndQh/?mibextid=wwXIfr';
  const address = 'Calle Primavera #21, Fraccionamiento Las Fuentes, Zamora, Mich.';

  return (
    <footer className="footer-section">
      <div className="footer-content container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-title">JC Studio</div>
            <div className="footer-sub">Ven y Visitanos </div>
            <div className="footer-sub">O </div>
            <div className="footer-sub">Agenda una cita a domicilo </div>
          </div>

          <div className="footer-col">
            <div className="footer-title">Contacto</div>
            <div className="footer-item">
              <a
                className="footer-link"
                href={`https://wa.me/${phone.replace(/-/g, '')}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp: {phone}
              </a>
            </div>
            <div className="footer-item">
              <a className="footer-link" href={`mailto:${email}`}>Correo: {email}</a>
            </div>
            <div className="footer-item footer-address">{address}</div>
          </div>

          <div className="footer-col">
            <div className="footer-title">Redes</div>
            <div className="footer-item">
              <a className="footer-link" href={facebookUrl} target="_blank" rel="noreferrer">
                Facebook
              </a>
            </div>

            <div className="footer-cta">
              <a
                className="footer-cta-btn"
                href={`https://wa.me/${phone.replace(/-/g, '')}?text=${encodeURIComponent(
                  'Hola, me gustaría pedir información y agendar una cita.'
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Consultar vía WhatsApp
              </a>
            </div>
          </div>
        </div>

        <p className="footer-copy">&copy; 2025 JC Studio. Desarrollado por MarCode.</p>
      </div>
    </footer>
  );
};

export default Footer;
