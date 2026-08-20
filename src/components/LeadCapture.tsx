import { useEffect, useState } from 'react';
import { X, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { wa, WA_MESSAGE_DEFAULT } from '../data';
import { trackEvent } from './Analytics';

interface LeadCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'exit-intent' | 'scroll' | 'time';
}

export default function LeadCapture({ isOpen, onClose, trigger = 'scroll' }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      trackEvent('lead_capture_shown', { trigger });
    }, 100);
    return () => clearTimeout(timer);
  }, [isOpen, trigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) return;
    setSubmitting(true);
    setMessage(null);

    try {
      if (phone) {
        window.open(wa(`Olá! Gostaria de receber mais informações sobre cursos. Meu telefone é ${phone}${email ? ` e email ${email}` : ''}.`), '_blank');
      }

      trackEvent('lead_capture_submit', { hasEmail: !!email, hasPhone: !!phone, trigger });
      setSubmitted(true);
      setMessage({ type: 'success', text: 'Obrigado! Entraremos em contato em breve.' });
    } catch {
      setMessage({ type: 'error', text: 'Erro ao enviar. Tente novamente ou chame no WhatsApp.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || submitted) return null;

  return (
    <div className="lead-capture-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="lead-capture-title">
      <div className="lead-capture-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lead-capture-close" onClick={onClose} aria-label="Fechar">
          <X strokeWidth={2.4} />
        </button>
        <div className="lead-capture-content">
          <div className="lead-capture-icon" aria-hidden="true">
            <MessageCircle strokeWidth={2} />
          </div>
          <h2 id="lead-capture-title">Não perca as melhores ofertas</h2>
          <p>Cadastre-se e receba descontos exclusivos e novidades no seu WhatsApp ou email.</p>
          {message && (
            <div className={`lead-capture-message ${message.type}`}>
              {message.text}
            </div>
          )}
          {!submitted && (
            <form onSubmit={handleSubmit} className="lead-capture-form">
              <div className="form-row">
                <label>
                  <Mail strokeWidth={2} />
                  <input
                    type="email"
                    placeholder="Seu email (opcional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <MessageCircle strokeWidth={2} />
                  <input
                    type="tel"
                    placeholder="WhatsApp com DDD (opcional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-label="WhatsApp"
                    maxLength={15}
                  />
                </label>
              </div>
              <p className="form-hint">Pelo menos um contato é necessário. Não enviamos spam.</p>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting || (!email && !phone)}>
                {submitting ? 'Enviando...' : 'Quero receber ofertas'}
                <ArrowRight strokeWidth={2.4} />
              </button>
            </form>
          )}
          <p className="lead-capture-alternative">
            Ou <a href={wa(WA_MESSAGE_DEFAULT)} target="_blank" rel="noopener noreferrer">fale direto no WhatsApp</a>
          </p>
        </div>
      </div>
    </div>
  );
}