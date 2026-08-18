import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';

const AVATAR_COLORS = ['#e63946', '#f4a261', '#2a9d8f'];

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useScrollReveal(rootRef);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(`.testimonial-card[data-index="${index}"]`);
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    setActiveIndex(Math.min(index, TESTIMONIALS.length - 1));
  };

  return (
    <section className="testimonials section" id="depoimentos" ref={rootRef}>
      <div className="container">
        <div className="section-head">
          <div data-reveal>
            <p className="eyebrow">Depoimentos</p>
            <h2>O que nossos alunos dizem</h2>
          </div>
          <div className="testimonial-nav" data-reveal>
            <button type="button" aria-label="Depoimento anterior" onClick={() => scrollToIndex(activeIndex - 1)}>
              <ArrowLeft strokeWidth={2.2} />
            </button>
            <button type="button" aria-label="Próximo depoimento" onClick={() => scrollToIndex(activeIndex + 1)}>
              <ArrowRight strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="testimonials-track" ref={trackRef} onScroll={onScroll}>
          {TESTIMONIALS.map((testimonial, index) => (
            <article
              className="testimonial-card"
              data-index={index}
              data-reveal
              key={testimonial.name}
              style={{ ['--avatar-color' as string]: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
            >
              <Quote className="testimonial-quote" strokeWidth={1.6} aria-hidden="true" />
              <p className="testimonial-comment">“{testimonial.comment}”</p>
              <div className="testimonial-stars" aria-label="Avaliação 5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} strokeWidth={0} fill="currentColor" />
                ))}
              </div>
              <div className="testimonial-person">
                <span className="testimonial-avatar" aria-hidden="true">
                  {testimonial.initials}
                </span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <p>{testimonial.course}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonial-dots" role="tablist" aria-label="Navegação dos depoimentos">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`Depoimento ${index + 1} de ${TESTIMONIALS.length}`}
              className={activeIndex === index ? 'active' : ''}
              key={testimonial.name}
              onClick={() => scrollToIndex(index)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}