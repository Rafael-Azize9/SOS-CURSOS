import { useRef } from 'react';
import { ArrowRight, Bot, Code2, MonitorSmartphone, Palette } from 'lucide-react';
import { KIDS_AREAS, wa, WA_MESSAGE_KIDS } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';

const AREA_ICONS = [Code2, MonitorSmartphone, Palette, Bot];

export default function Kids() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="kids section" id="kids" ref={rootRef}>
      <div className="container">
        <div className="kids-panel" data-reveal>
          <span className="kids-blob kids-blob-a" aria-hidden="true"></span>
          <span className="kids-blob kids-blob-b" aria-hidden="true"></span>
          <span className="kids-confetti kids-confetti-a" aria-hidden="true">✦</span>
          <span className="kids-confetti kids-confetti-b" aria-hidden="true">●</span>
          <span className="kids-confetti kids-confetti-c" aria-hidden="true">✦</span>

          <div className="kids-hero-copy">
            <div className="kids-wordmark">
              <span>S.O.S</span>
              <strong>
                <i>K</i>
                <i>I</i>
                <i>D</i>
                <i>S</i>
              </strong>
            </div>
            <h2>Aprender pode ser divertido!</h2>
            <p>
              Cursos desenvolvidos especialmente para crianças e adolescentes explorarem o mundo da
              tecnologia, informática e criatividade.
            </p>
            <a className="btn btn-primary kids-cta" href={wa(WA_MESSAGE_KIDS)} target="_blank" rel="noopener noreferrer">
              Conheça a S.O.S Kids
              <ArrowRight strokeWidth={2.4} />
            </a>
          </div>

          <ul className="kids-areas">
            {KIDS_AREAS.map((area, index) => {
              const AreaIcon = AREA_ICONS[index % AREA_ICONS.length];
              return (
                <li className="kids-area-row" key={area.title}>
                  <span className="kids-area-icon" aria-hidden="true">
                    <AreaIcon strokeWidth={2} />
                  </span>
                  <span>{area.title}</span>
                </li>
              );
            })}
          </ul>

          <div className="kids-photo">
            <img
              src="/assets/kids.png"
              alt="Crianças aprendendo com os cursos da S.O.S Kids"
              width="1200"
              height="900"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}