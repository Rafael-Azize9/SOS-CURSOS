import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { NAV_LINKS, wa, WA_MESSAGE_START } from '../data';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const updateOffset = () => {
      if (navRef.current) {
        document.documentElement.style.scrollPaddingTop = `${navRef.current.offsetHeight + 16}px`;
      }
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !menuOpen) return;
      setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    const links = document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = Array.from(links)
      .map((link) => document.querySelector(link.getAttribute('href') ?? ''))
      .filter((el): el is Element => Boolean(el));

    const setActive = (id: string) => {
      links.forEach((link) => {
        link.classList.toggle('nav-active', link.getAttribute('href') === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const openSearch = () => {
    setMenuOpen(false);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => {
      document.getElementById('catalog-search')?.focus();
    }, 700);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="topo">
      <nav className="nav container" ref={navRef} aria-label="Menu principal">
        <a href="#topo" className="brand" aria-label="S.O.S Cursos início">
          <span className="brand-badge">SOS</span>
          <span className="brand-text">
            S.O.S <strong>CURSOS</strong>
          </span>
        </a>

        <ul className="nav-links" aria-label="Navegação do site">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="nav-search" type="button" aria-label="Buscar cursos" onClick={openSearch}>
            <Search strokeWidth={2.2} />
          </button>
          <a
            className="btn btn-primary nav-start"
            href={wa(WA_MESSAGE_START)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Começar agora
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} id="mobile-menu" aria-label="Menu móvel">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mobile-menu-actions">
          <a
            className="btn btn-primary"
            href={wa(WA_MESSAGE_START)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Começar agora
          </a>
        </div>
      </div>
    </header>
  );
}