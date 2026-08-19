import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Search, Timer } from 'lucide-react';
import { brl, CATEGORIES, categoryCounts, enrollLink, getFilteredCourses, PAGE_SIZE } from '../data';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useSpotlight } from '../hooks/useSpotlight';
import { getCookie, hasConsent, setCookie } from '../lib/cookies';
import CourseIcon from './CourseIcon';

const PREFS_TTL_DAYS = 365;

export default function Catalog() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState(() => getCookie('sos_cat') ?? 'Todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(() => getCookie('sos_sort') ?? 'az');
  const [limit, setLimit] = useState(PAGE_SIZE);

  useEffect(() => {
    if (!hasConsent()) return;
    setCookie('sos_cat', activeCategory, PREFS_TTL_DAYS);
    setCookie('sos_sort', sort, PREFS_TTL_DAYS);
  }, [activeCategory, sort]);

  const counts = useMemo(() => categoryCounts(), []);
  const filtered = useMemo(
    () => getFilteredCourses({ activeCategory, search, sort }),
    [activeCategory, search, sort]
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
          {visible.map((course) => (
            <article className="course-card" data-reveal key={course.name}>
              <div className="course-card-head">
                <span className="course-card-icon">
                  <CourseIcon course={course} />
                </span>
                <div className="course-card-head-text">
                  <p className="eyebrow course-category">{course.category}</p>
                  <h3>{course.name}</h3>
                </div>
              </div>
              <div className="meta">
                <Timer strokeWidth={2.2} /> {course.hours}h de curso
              </div>
              <div className="price-row">
                <span className="price">{brl(course.price)}</span>
                <a
                  className="matricular"
                  href={enrollLink(course.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Matricular-se <ArrowRight strokeWidth={2.2} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="catalog-more" id="catalog-more-wrap">
          {visible.length < filtered.length && (
            <button type="button" className="btn btn-primary" id="load-more" onClick={() => setLimit(filtered.length)}>
              Abrir catálogo de cursos
              <ArrowRight strokeWidth={2.4} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}