import { useRef } from 'react';
import { Check } from 'lucide-react';
import { WHY_CHECKLIST } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function WhyUs() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="why section surface" ref={rootRef}>
      <div className="container why-grid">
        <div className="why-copy" data-reveal>
          <p className="eyebrow">Por que escolher a S.O.S Cursos?</p>
          <h2>
            Aqui o seu aprendizado
            <br />
            <span className="text-primary">é levado a sério.</span>
          </h2>
          <p className="why-text">
            Nossa missão é oferecer educação de qualidade, acessível e transformadora para todos.
          </p>
          <ul className="why-list">
            {WHY_CHECKLIST.map((item) => (
              <li key={item}>
                <span className="why-check" aria-hidden="true">
                  <Check strokeWidth={2.6} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}