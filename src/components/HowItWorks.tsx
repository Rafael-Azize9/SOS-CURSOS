import { useRef } from 'react';
import { STEPS } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="how section" id="como-funciona" ref={rootRef}>
      <div className="container">
        <p className="eyebrow">Como funciona</p>
        <h2>Três passos entre você e o certificado</h2>
        <p className="lead">
          Sem prova presencial, sem burocracia. Você escolhe o curso e estuda de onde estiver.
        </p>
        <ol className="steps-grid">
          {STEPS.map((step) => (
            <li className="step-card" data-reveal key={step.n}>
              <span className="step-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}