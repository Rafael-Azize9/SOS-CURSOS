import { useRef } from 'react';
import { ArrowRight, Award, Clock, Headset, Infinity as InfinityIcon, Play } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

const HERO_BENEFITS = [
  { icon: Award, label: 'Certificado incluso', small: 'em todos os cursos' },
  { icon: InfinityIcon, label: 'Acesso vitalício', small: 'estude para sempre' },
  { icon: Headset, label: 'Suporte especializado', small: 'sempre que precisar' },
  { icon: Clock, label: 'Estude no seu ritmo', small: 'acesse onde e quando quiser' },
];

interface HeroProps {
  ready: boolean;
}

export default function Hero({ ready }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scope = rootRef.current;
      if (!scope) return;
      const mm = gsap.matchMedia(scope);

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-hero]', { clearProps: 'all' });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ paused: !ready, defaults: { ease: 'power3.out' } });
        tl.from('.hero-eyebrow', { y: 22, autoAlpha: 0, duration: 0.7 })
          .from('.hero-copy h1', { y: 38, autoAlpha: 0, duration: 0.95 }, '-=0.45')
          .from('.hero-desc', { y: 26, autoAlpha: 0, duration: 0.8 }, '-=0.6')
          .from('.hero-actions', { y: 22, autoAlpha: 0, duration: 0.7 }, '-=0.55')
          .from('.hero-benefits', { y: 26, autoAlpha: 0, duration: 0.7 }, '-=0.45')
          .from('.image-frame', { y: 30, autoAlpha: 0, scale: 0.96, duration: 1.0 }, '-=0.9')
          .from(
            ['.hero-shape', '.float-card'],
            { autoAlpha: 0, scale: 0.85, duration: 0.6, stagger: 0.12 },
            '-=0.65'
          );
      });
    },
    { scope: rootRef, dependencies: [ready] }
  );

  return (
    <section className="hero section" ref={rootRef}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow" data-hero>
            Aprenda hoje.
          </p>
          <h1 data-hero>
            <span className="text-primary">Transforme</span>
            <br />
            seu amanhã.
          </h1>
          <p className="hero-desc" data-hero>
            Cursos online completos com certificado incluso para você aprender no seu ritmo e conquistar
            novas oportunidades.
          </p>
          <div className="hero-actions" data-hero>
            <a className="btn btn-primary" href="#cursos">
              Ver todos os cursos
              <ArrowRight strokeWidth={2.4} />
            </a>
            <a className="btn btn-ghost" href="#como-funciona">
              Como funciona
              <Play strokeWidth={2.4} />
            </a>
          </div>
          <ul className="hero-benefits" data-hero>
            {HERO_BENEFITS.map((benefit) => (
              <li key={benefit.label}>
                <span className="hero-benefit-icon" aria-hidden="true">
                  <benefit.icon strokeWidth={2} />
                </span>
                <span>
                  {benefit.label}
                  <small>{benefit.small}</small>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-visual" data-hero aria-label="Aluna da S.O.S Cursos estudando com notebook">
          <span className="hero-shape hero-shape-ring" aria-hidden="true"></span>
          <span className="hero-shape hero-shape-dots" aria-hidden="true"></span>
          <span className="hero-shape hero-shape-blob" aria-hidden="true"></span>
          <div className="image-frame">
            <img
              src="/assets/imagem_sos1.webp"
              alt="Jovem estudante sorrindo com um notebook nas mãos"
              width="1303"
              height="1207"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}