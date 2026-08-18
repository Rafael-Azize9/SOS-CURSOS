import { Mail, MessageCircle } from 'lucide-react';
import { CONTACT, INSTAGRAM_URL, NAV_LINKS, wa, WA_MESSAGE_DEFAULT } from '../data';

function InstagramIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg className="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const INSTITUTIONAL_LINKS = [
  { label: 'Quem somos', href: '#topo' },
  { label: 'Política de Privacidade', href: null },
  { label: 'Termos de Uso', href: null },
  { label: 'Certificados', href: '#certificado' },
  { label: 'FAQ', href: '#duvidas' },
];

const SUPPORT_LINKS = [
  { label: 'Central de Ajuda', href: null },
  { label: 'Fale Conosco', href: wa(WA_MESSAGE_DEFAULT) },
  { label: 'Suporte Técnico', href: wa(WA_MESSAGE_DEFAULT) },
  { label: 'Como Funciona', href: '#como-funciona' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <span className="footer-brand">
              <span className="brand-badge">S.O.S</span>
              S.O.S Cursos
            </span>
            <p className="footer-tagline">
              Educação de qualidade para transformar vidas e criar novas oportunidades.
            </p>
            <ul className="footer-social" aria-label="Redes sociais">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram da S.O.S Cursos">
                  <InstagramIcon />
                </a>
              </li>
              <li>
                <a href="#topo" aria-label="Facebook da S.O.S Cursos (em breve)">
                  <FacebookIcon />
                </a>
              </li>
              <li>
                <a href="#topo" aria-label="YouTube da S.O.S Cursos (em breve)">
                  <YoutubeIcon />
                </a>
              </li>
              <li>
                <a href="#topo" aria-label="TikTok da S.O.S Cursos (em breve)">
                  <TiktokIcon />
                </a>
              </li>
            </ul>
          </div>

          <nav className="footer-col" aria-label="Navegação">
            <h3>Navegação</h3>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Institucional">
            <h3>Institucional</h3>
            <ul>
              {INSTITUTIONAL_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <span className="footer-disabled" aria-disabled="true">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h3>Suporte</h3>
            <ul>
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <span className="footer-disabled" aria-disabled="true">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h3>Fale conosco</h3>
            <ul>
              <li>
                <a href={`mailto:${CONTACT.email}`}>
                  <Mail strokeWidth={2} /> {CONTACT.email}
                </a>
              </li>
              <li>
                <span>
                  <MessageCircle strokeWidth={2} /> {CONTACT.hours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 S.O.S Cursos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}