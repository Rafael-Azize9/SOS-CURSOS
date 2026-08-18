import { useRef } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { wa, WA_MESSAGE_START } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function CTA() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="cta section" id="contato" ref={rootRef}>
      <div className="container">
        <div className="cta-band" data-reveal>
          <span className="cta-shape cta-shape-a" aria-hidden="true"></span>
          <span className="cta-shape cta-shape-b" aria-hidden="true"></span>
          <span className="cta-shape cta-shape-c" aria-hidden="true"></span>
          <div className="cta-lead">
            <span className="cta-rocket" aria-hidden="true">
              <Rocket strokeWidth={1.8} />
            </span>
            <h2>
              Pronto para transformar
              <br />
              seu futuro?
            </h2>
          </div>
          <p>Comece agora mesmo e tenha acesso a todos os nossos cursos.</p>
          <a className="btn btn-light" href={wa(WA_MESSAGE_START)} target="_blank" rel="noopener noreferrer">
            Começar agora
            <ArrowRight strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </section>
  );
}