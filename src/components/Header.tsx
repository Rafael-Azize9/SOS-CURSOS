import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { NAV_LINKS, wa, WA_MESSAGE_START } from '../data';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const routeLinks = useMemo(() => NAV_LINKS.filter((link) => !link.href.startsWith('/#')), []);

  const activeHref = useMemo(() => {
    const matched = routeLinks.find((link) => location.pathname === link.href);
    return matched?.href ?? null;
  }, [routeLinks, location.pathname]);

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

  const openSearch = () => {
    setMenuOpen(false);
    setActiveSection(null);
    navigate('/catalogo');
    setTimeout(() => {
      document.getElementById('catalog-search')?.focus();
    }, 100);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      setActiveSection(id);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      }
    }
    closeMenu();
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="topo">
      <nav className="nav container" ref={navRef} aria-label="Menu principal">
        <Link to="/" className="brand" aria-label="S.O.S Cursos início">
          <span className="brand-badge">SOS</span>
          <span className="brand-text">
            S.O.S <strong>CURSOS</strong>
          </span>
        </Link>

        <ul className="nav-links" aria-label="Navegação do site">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              {link.href.startsWith('/#') ? (
                <a
                  href={link.href}
                  className={`nav-link${activeSection === link.href.slice(2) ? ' nav-active' : ''}`}
                  aria-current={activeSection === link.href.slice(2) ? 'true' : undefined}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className={`nav-link${!activeSection && activeHref === link.href ? ' nav-active' : ''}`}
                  aria-current={!activeSection && activeHref === link.href ? 'page' : undefined}
                  onClick={() => { setActiveSection(null); closeMenu(); }}
                >
                  {link.label}
                </Link>
              )}
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
            <li key={link.label}>
              {link.href.startsWith('/#') ? (
                <a
                  href={link.href}
                  className={`nav-link${activeSection === link.href.slice(2) ? ' nav-active' : ''}`}
                  aria-current={activeSection === link.href.slice(2) ? 'true' : undefined}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className={`nav-link${!activeSection && activeHref === link.href ? ' nav-active' : ''}`}
                  aria-current={!activeSection && activeHref === link.href ? 'page' : undefined}
                  onClick={() => { setActiveSection(null); closeMenu(); }}
                >
                  {link.label}
                </Link>
              )}
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