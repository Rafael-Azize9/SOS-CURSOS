import { useRef } from 'react';
import { Award, Smile, Users, Video } from 'lucide-react';
import { NUMBERS } from '../data';
import type { StatItem } from '../data';
import { gsap, useGSAP } from '../lib/gsap';
import { useScrollReveal } from '../hooks/useScrollReveal';

const STAT_ICONS = [Users, Video, Award, Smile];

export default function Numbers() {
  const rootRef = useRef<HTMLElement>(null);

  useScrollReveal(rootRef);

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-counter]', rootRef.current);
      if (!targets.length) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      targets.forEach((el) => {
        const end = parseFloat(el.dataset.counter ?? '0');
        const prefix = el.dataset.prefix ?? '';
        const suffix = el.dataset.suffix ?? '';
        const obj = { value: 0 };
        gsap.to(obj, {
          value: end,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.value).toLocaleString('pt-BR')}${suffix}`;
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section className="numbers section" ref={rootRef} aria-label="Números da S.O.S Cursos">
      <div className="container numbers-grid">
        {NUMBERS.map((stat: StatItem, index) => {
          const Icon = STAT_ICONS[index % STAT_ICONS.length];
          return (
            <div className="number-item" data-reveal key={stat.label}>
              <span className="number-icon" aria-hidden="true">
                <Icon strokeWidth={1.8} />
              </span>
              <p className="number-value">
                <strong data-counter={stat.value} data-prefix={stat.prefix ?? ''} data-suffix={stat.suffix}>
                  {stat.prefix ?? ''}0{stat.suffix}
                </strong>
              </p>
              <p className="number-label">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}