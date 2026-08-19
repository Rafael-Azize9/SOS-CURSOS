import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Gift, Search, Tag, Timer } from 'lucide-react';
import { brl, CATEGORIES, categoryCounts, enrollLink, getFilteredCourses, PAGE_SIZE } from '../data';
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
                  <div className="course-card-head">
                    <span className="course-card-icon promo-card-icon">
                      {promo.icon ? (
                        <img
                          className="course-icon"
                          src={`/assets/${promo.icon}`}
                          alt=""
                          width="128"
                          height="128"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <Tag aria-hidden="true" strokeWidth={2} />
                      )}
                    </span>
                    <div className="course-card-head-text">
                      <div className="promo-card-head-line">
                        <p className="eyebrow course-category">Oferta</p>
                        <span className="offer-tag offer-tag-inline">Promo</span>
                      </div>
                      <h3>{promo.name}</h3>
                    </div>
                  </div>
                  <div className="meta">
                    <Timer strokeWidth={2.2} /> {promo.hours}h de curso
                  </div>
                  <div className="price-row">
                    <div className="price-col">
                      <del className="old-price">{brl(promo.from)}</del>
                      <span className="price">{brl(promo.price)}</span>
                    </div>
                    <a
                      className="matricular"
                      href={enrollLink(promo.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Matricular-se <ArrowRight strokeWidth={2.2} />
                    </a>
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
            return (
              <article className="course-card" data-reveal key={course.name}>
                {promo && <span className="offer-tag">Promo</span>}
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
                  <div className="price-col">
                    {promo && <del className="old-price">{brl(promo.from)}</del>}
                    <span className="price">{brl(course.price)}</span>
                  </div>
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
          <a className="btn btn-outline" href="#roleta">
            <Gift strokeWidth={2.4} /> Roleta Premiada — até 35% OFF
          </a>
        </div>
      </div>
    </section>
  );
}