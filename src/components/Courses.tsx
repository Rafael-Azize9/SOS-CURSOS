import { useMemo, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { brl, enrollLink, wa, WA_MESSAGE_OFFERS } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSiteData } from '../lib/siteData';
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

export default function Courses() {
  const rootRef = useRef<HTMLElement>(null);
  const { courses, promos } = useSiteData();
  useScrollReveal(rootRef);

  const featured = useMemo(
    () =>
      FEATURED_NAMES.map((name) => courses.find((course) => course.name === name)).filter(
        (course): course is NonNullable<typeof course> => Boolean(course)
      ),
    [courses]
  );

  const promoByCourse = useMemo(() => {
    const map = new Map<string, (typeof promos)[number]>();
    promos.forEach((promo) => map.set(promo.name, promo));
    return map;
  }, [promos]);

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
          {featured.map((course) => {
            const promo = promoByCourse.get(course.name);
            return (
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
                    {promo && <del>{brl(promo.from)}</del>}
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
            );
          })}
        </div>

        <p className="featured-note" data-reveal>
          Valores promocionais de matrícula.{' '}
          <a href={wa(WA_MESSAGE_OFFERS)}>Consulte todas as ofertas no WhatsApp</a>.
        </p>
      </div>
    </section>
  );
}