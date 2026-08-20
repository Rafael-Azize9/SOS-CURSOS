import { useLocation } from 'react-router-dom';
import { useSiteData } from '../lib/siteData';
import { useEffect } from 'react';

const SITE_URL = 'https://soscursos.com.br';
const SITE_NAME = 'S.O.S Cursos';
const DEFAULT_DESCRIPTION = 'Mais de 100 cursos online com certificado válido em todo o Brasil: informática, idiomas, administração e preparatórios. Estude no seu ritmo e matricule-se pelo WhatsApp.';
const DEFAULT_IMAGE = '/assets/imagem_sos1.webp';

function setMetaTag(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (property) tag.setAttribute('property', name); else tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setTitle(title: string) {
  document.title = title;
}

function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(json: object) {
  const id = 'json-ld-seo';
  let script = document.getElementById(id) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(json);
}

export default function SEO() {
  const location = useLocation();
  const { courses, ready } = useSiteData();

  useEffect(() => {
    if (!ready) return;

    const path = location.pathname;
    const isHome = path === '/';
    const isCatalog = path === '/catalogo' || path === '/planos';
    const isCourse = path.startsWith('/curso/');
    const isWheel = path === '/roleta';
    const isAdmin = path === '/admin';
    const isPrivacy = path === '/privacidade';

    let title = `${SITE_NAME} — Cursos online com certificado`;
    let description = DEFAULT_DESCRIPTION;
    let image = DEFAULT_IMAGE;
    let type = 'website';
    let url = `${SITE_URL}${path}`;
    let jsonLd: object | null = null;

    if (isHome) {
      title = `${SITE_NAME} — Cursos online com certificado a partir de R$ 49,90`;
      description = DEFAULT_DESCRIPTION;
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/catalogo?q={search_term_string}` },
          'query-input': 'required name=search_term_string'
        }
      };
    } else if (isCatalog) {
      title = `Catálogo completo — ${SITE_NAME}`;
      description = 'Encontre seu curso ideal entre mais de 100 opções. Filtre por categoria, busque por nome, ordene por preço ou carga horária.';
      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Catálogo de Cursos S.O.S',
        numberOfItems: courses.filter(c => !c.kids).length,
        itemListElement: courses.filter(c => !c.kids).slice(0, 20).map((course, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Course',
            name: course.name,
            description: `${course.hours}h de curso - ${course.category}`,
            provider: { '@type': 'Organization', name: SITE_NAME },
            offers: { '@type': 'Offer', price: course.price, priceCurrency: 'BRL', availability: 'https://schema.org/InStock' }
          }
        }))
      };
    } else if (isCourse) {
      const slug = path.split('/curso/')[1];
      const course = courses.find(c => c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') === slug);
      if (course) {
        title = `${course.name} — ${SITE_NAME}`;
        description = `Curso de ${course.name} (${course.hours}h) — ${course.category}. Certificado válido em todo o Brasil. Matrícula pelo WhatsApp.`;
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.name,
          description: `Curso completo de ${course.name} com ${course.hours} horas de conteúdo. Categoria: ${course.category}. Certificado incluso.`,
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          offers: { '@type': 'Offer', price: course.price, priceCurrency: 'BRL', availability: 'https://schema.org/InStock', url: `${SITE_URL}${path}` },
          educationalLevel: 'Iniciante a Avançado',
          courseMode: 'Online',
          timeRequired: `PT${course.hours}H`
        };
      }
    } else if (isWheel) {
      title = `Roleta Premiada — Até 35% OFF — ${SITE_NAME}`;
      description = 'Gire a roleta e ganhe até 35% de desconto em qualquer curso. Uma girada por sessão, prêmio garantido via WhatsApp.';
    } else if (isAdmin) {
      title = `Painel Administrativo — ${SITE_NAME}`;
      description = 'Área restrita para gestão de cursos, preços e promoções.';
      setMetaTag('robots', 'noindex, nofollow');
    } else if (isPrivacy) {
      title = `Política de Privacidade — ${SITE_NAME}`;
      description = 'Política de privacidade e proteção de dados da S.O.S Cursos.';
    }

    setTitle(title);
    setMetaTag('description', description);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:image', `${SITE_URL}${image}`, true);
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', `${SITE_URL}${image}`);
    setCanonical(url);

    if (jsonLd) setJsonLd(jsonLd);
  }, [location.pathname, courses, ready]);

  return null;
}