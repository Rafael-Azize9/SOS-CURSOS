import { useRef } from 'react';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { brl, COURSES, enrollLink, wa, WA_MESSAGE_OFFERS } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';
import CourseIcon from './CourseIcon';

const FEATURED_NAMES = [
  'Excel Básico e Avançado',
  'Microsoft Word',
  'Power Point',
  'PhotoShop CC',
  'Power Bi',
  'Inglês do Zero a Fluência',
];

const FEATURED_DESCRIPTIONS: Record<string, string> = {
  'Excel Básico e Avançado': 'Do básico ao avançado e torne-se um especialista.',
  'Microsoft Word': 'Domine o Word e crie documentos profissionais.',
  'Power Point': 'Crie apresentações incríveis e impactantes.',
  'PhotoShop CC': 'Edição, manipulação e criação de artes incríveis.',
  'Power Bi': 'Transforme dados em informações estratégicas.',
  'Inglês do Zero a Fluência': 'Do zero à fluência para conquistar o mundo.',
};

const FEATURED_COURSES = FEATURED_NAMES.map((name) => COURSES.find((course) => course.name === name)).filter(
  (course): course is NonNullable<typeof course> => Boolean(course)
);

export default function Courses() {
  const rootRef = useRef<HTMLElement>(null);
  useScrollReveal(rootRef);

  return (
    <section className="courses section" id="cursos" ref={rootRef}>
      <div className="container">
        <div className="section-head">
          <div data-reveal>
            <p className="eyebrow">Nossos cursos</p>
            <h2>Os cursos mais procurados</h2>
          </div>
          <a className="btn btn-outline section-head-btn" href="#catalogo" data-reveal>
            Ver todos os cursos
            <ArrowRight strokeWidth={2.4} />
          </a>
        </div>

        <div className="featured-track" data-reveal>
          {FEATURED_COURSES.map((course) => (
            <article className="featured-card" key={course.name}>
              <span className="featured-card-icon" aria-hidden="true">
                <CourseIcon course={course} />
              </span>
              <h3>{course.name}</h3>
              <p className="featured-card-desc">{FEATURED_DESCRIPTIONS[course.name]}</p>
              <div className="featured-card-hours">
                <Clock strokeWidth={2.2} /> {course.hours}h de curso
              </div>
              <div className="featured-card-foot">
                <div className="featured-card-price">
                  <strong>{brl(course.price)}</strong>
                </div>
                <a
                  className="featured-card-link"
                  href={enrollLink(course.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Matricular-se em ${course.name}`}
                >
                  <ArrowUpRight strokeWidth={2.4} />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="featured-note" data-reveal>
          Valores promocionais de matrícula.{' '}
          <a href={wa(WA_MESSAGE_OFFERS)}>Consulte todas as ofertas no WhatsApp</a>.
        </p>
      </div>
    </section>
  );
}