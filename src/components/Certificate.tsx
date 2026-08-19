import { useRef } from 'react';
import { Award, Check, Globe, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Certificate() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="certificate section surface" id="certificado" ref={rootRef}>
      <div className="container certificate-grid">
        <div data-reveal>
          <p className="eyebrow">Certificados</p>
          <h2>
            Um certificado que vale em qualquer <span>lugar do Brasil!</span>
          </h2>
          <p>
            Ao concluir seu curso, você recebe um certificado digital com a identidade da S.O.S Cursos —
            pronto para anexar ao currículo ou apresentar onde precisar.
          </p>
          <ul className="feature-list">
            <li>
              <span className="list-icon">
                <ShieldCheck strokeWidth={2} />
              </span>
              <div>
                <strong>Amparo legal</strong>
                <p>
                  Cursos livres reconhecidos pela Lei nº 9.394/96, válidos em todo o território nacional
                  mesmo sem regulamentação do MEC.
                </p>
              </div>
            </li>
            <li>
              <span className="list-icon">
                <Award strokeWidth={2} />
              </span>
              <div>
                <strong>Emissão digital</strong>
                <p>Assim que você conclui a última aula, o certificado fica disponível para download.</p>
              </div>
            </li>
            <li>
              <span className="list-icon">
                <Globe strokeWidth={2} />
              </span>
              <div>
                <strong>Sua carga horária, no seu tempo</strong>
                <p>Cada curso informa a carga horária certificada ao final.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="certificate-card" data-reveal>
          <div className="certificate-top">
            <span className="badge-sos">SOS</span>
            <span className="status-pill">
              <Check strokeWidth={2.4} /> Aprovado
            </span>
          </div>
          <p className="certificate-label">Certificamos que</p>
          <p className="certificate-name">Nome do Aluno(a)</p>
          <p className="certificate-body">
            concluiu com aproveitamento o curso de <strong>Informática Básica</strong>, promovido pela
            S.O.S Cursos, em conformidade com a Lei nº 9.394/96.
          </p>
          <div className="certificate-meta">
            <div>
              <p>Carga horária</p>
              <strong>40 horas</strong>
            </div>
            <div>
              <p>Emitido em</p>
              <strong>__/__/____</strong>
            </div>
          </div>
          <span className="cert-seal" aria-hidden="true">★</span>
        </div>
      </div>
      <p className="legal-note">
        Cursos livres nos termos da Lei nº 9.394/96, do Decreto nº 5.154/04 e da Deliberação CEE 14/97.
      </p>
    </section>
  );
}