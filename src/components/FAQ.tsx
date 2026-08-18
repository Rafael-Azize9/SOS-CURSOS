import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../data';
import { gsap, useGSAP } from '../lib/gsap';

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: { q: string; a: string };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const answer = answerRef.current;
      if (!answer) return;
      if (isOpen) {
        gsap.to(answer, { height: 'auto', autoAlpha: 1, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(answer, { height: 0, autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
      }
    },
    { scope: answerRef, dependencies: [isOpen] }
  );

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button
        className="faq-question"
        type="button"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        onClick={onToggle}
      >
        <span>{item.q}</span>
        <span>
          <Plus strokeWidth={2.4} />
        </span>
      </button>
      <div className="faq-answer" ref={answerRef} id={`faq-answer-${index}`}>
        <p>{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <section className="faq section" id="duvidas">
      <div className="container faq-grid">
        <div>
          <p className="eyebrow">Dúvidas frequentes</p>
          <h2>Tudo que você precisa saber antes de começar</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item, index) => (
            <FaqItem
              key={item.q}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}