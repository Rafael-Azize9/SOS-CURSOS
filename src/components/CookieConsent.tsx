import { useState } from 'react';
import { Cookie } from 'lucide-react';
import { getCookie, setCookie } from '../lib/cookies';

export default function CookieConsent() {
  const [visible, setVisible] = useState(() => !getCookie('sos_consent'));

  const choose = (consent: 'all' | 'essential') => {
    setCookie('sos_consent', consent, 365);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Aviso de cookies">
      <span className="cookie-consent-icon" aria-hidden="true">
        <Cookie strokeWidth={2} />
      </span>
      <p>
        Usamos cookies para lembrar suas preferências de navegação e melhorar sua experiência.
        Ao aceitar, você concorda com o uso de cookies conforme nossa{' '}
        <a href="#privacidade">Política de Privacidade</a>. Você pode alterar sua escolha a qualquer
        momento.
      </p>
      <div className="cookie-consent-actions">
        <button type="button" className="btn btn-primary" onClick={() => choose('all')}>
          Aceitar todos
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => choose('essential')}>
          Somente essenciais
        </button>
      </div>
    </div>
  );
}