import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Clock, Gift, Search } from 'lucide-react';
import { brl, CATEGORIES, categoryCounts, courseDescription, enrollLink, formatCourseSlug, getFilteredCourses, PAGE_SIZE } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { useSiteData } from '../lib/siteData';
import CourseIcon from './CourseIcon';

function readPref(key: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writePref(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // sem storage disponível, ignora
  }
}

export default function Catalog() {
  const rootRef = useRef<HTMLElement>(null);
  const { courses, promos } = useSiteData();
  const [activeCategory, setActiveCategory] = useState(() => readPref('sos_cat', 'Todos'));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(() => readPref('sos_sort', 'az'));
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    writePref('sos_cat', activeCategory);
    writePref('sos_sort', sort);
  }, [activeCategory, sort]);

  const promoByCourse = useMemo(() => {
    const map = new Map<string, (typeof promos)[number]>();
    promos.forEach((promo) => map.set(promo.name, promo));
    return map;
  }, [promos]);

  const counts = useMemo(() => categoryCounts(courses), [courses]);
  const filtered = useMemo(
    () => getFilteredCourses({ courses, activeCategory, search, sort }),
    [courses, activeCategory, search, sort]
  );
  const visible = filtered.slice(0, limit);

  useScrollReveal(rootRef, [visible]);
  useSpotlight(rootRef, [visible]);

  const resetAndApply = (update: () => void) => {
    setLimit(PAGE_SIZE);
    update();
  };

  return (
    <section className="catalog-wrapper section surface" id="catalogo" ref={rootRef}>
      <div className="container">
        <p className="eyebrow">Catálogo completo</p>
        <h2>Encontre seu curso em segundos</h2>
        <p className="lead">Busque pelo nome, filtre por área ou ordene por preço e carga horária.</p>

        {promos.length > 0 && (
          <>
            <div className="title-row" data-reveal>
              <div>
                <p className="eyebrow">Promoções de matrícula</p>
                <h2>Aproveite as ofertas da semana</h2>
              </div>
            </div>
            <div className="promo-grid" data-reveal>
              {promos.map((promo) => (
                <article className="course-card" key={promo.id ?? promo.name}>
                  <span className="course-card-icon" aria-hidden="true">
                    <CourseIcon course={promo} />
                  </span>
                  <Link to={`/curso/${formatCourseSlug(promo.name)}`} className="course-card-title-link">
                    <h3 className="course-card-title">{promo.name}</h3>
                  </Link>
                  <p className="course-card-desc">{courseDescription(promo.name)}</p>
                  <div className="course-card-hours">
                    <Clock strokeWidth={2} /> {promo.hours}h de curso
                  </div>
                  <div className="course-card-divider" aria-hidden="true" />
                  <div className="course-card-footer">
                    <div className="course-card-price">
                      <del>{brl(promo.from)}</del>
                      <strong>{brl(promo.price)}</strong>
                    </div>
                    <div className="course-card-actions">
                      <Link to={`/curso/${formatCourseSlug(promo.name)}`} className="btn-details">
                        Ver detalhes
                      </Link>
                      <a
                        className="btn-enroll"
                        href={enrollLink(promo.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Matricular-se em ${promo.name}`}
                      >
                        <ArrowUpRight strokeWidth={2.4} /> Matricular-se
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        <div className="catalog-toolbar">
          <div className="search-box">
            <Search strokeWidth={2.2} />
            <input
              id="catalog-search"
              type="search"
              placeholder="Buscar curso (ex.: Excel, Inglês, Enem...)"
              aria-label="Buscar curso"
              value={search}
              onChange={(event) => resetAndApply(() => setSearch(event.target.value))}
            />
          </div>
          <select
            id="catalog-sort"
            aria-label="Ordenar cursos"
            value={sort}
            onChange={(event) => resetAndApply(() => setSort(event.target.value))}
          >
            <option value="az">Ordem alfabética</option>
            <option value="preco">Menor preço</option>
            <option value="carga">Maior carga horária</option>
          </select>
        </div>

        <div className="filter-chips" id="filter-chips">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              className={`filter-chip${activeCategory === category ? ' active' : ''}`}
              key={category}
              aria-pressed={activeCategory === category}
              onClick={() => resetAndApply(() => setActiveCategory(category))}
            >
              {category} <span>{category === 'Todos' ? counts.Todos : counts[category] || 0}</span>
            </button>
          ))}
        </div>

        <p className="catalog-count" aria-live="polite">
          <strong id="results-count">{filtered.length}</strong> cursos encontrados
        </p>
        <div className="catalog-grid" id="catalog-grid">
          {visible.map((course) => {
            const promo = promoByCourse.get(course.name);
            const slug = formatCourseSlug(course.name);
            return (
              <article className="course-card" data-reveal key={course.name}>
                <span className="course-card-icon" aria-hidden="true">
                  <CourseIcon course={course} />
                </span>
                <Link to={`/curso/${slug}`} className="course-card-title-link">
                  <h3 className="course-card-title">{course.name}</h3>
                </Link>
                <p className="course-card-desc">{courseDescription(course.name)}</p>
                <div className="course-card-hours">
                  <Clock strokeWidth={2} /> {course.hours}h de curso
                </div>
                <div className="course-card-divider" aria-hidden="true" />
                <div className="course-card-footer">
                  <div className="course-card-price">
                    {promo && <del>{brl(promo.from)}</del>}
                    <strong>{brl(course.price)}</strong>
                  </div>
                  <div className="course-card-actions">
                    <Link to={`/curso/${slug}`} className="btn-details">
                      Ver detalhes
                    </Link>
                    <a
                      className="btn-enroll"
                      href={enrollLink(course.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Matricular-se em ${course.name}`}
                    >
                      <ArrowUpRight strokeWidth={2.4} /> Matricular-se
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="catalog-more" id="catalog-more-wrap">
          {visible.length < filtered.length && (
            <button type="button" className="btn btn-primary" id="load-more" onClick={() => setLimit(filtered.length)}>
              Abrir catálogo de cursos
              <ArrowRight strokeWidth={2.4} />
            </button>
          )}
          <Link className="btn btn-outline" to="/roleta">
            <Gift strokeWidth={2.4} /> Roleta Premiada — até 35% OFF
          </Link>
        </div>
      </div>
    </section>
  );
}