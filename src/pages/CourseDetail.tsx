import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Award, Users, BookOpen, CheckCircle, MessageCircle, Share2, Download, Heart } from 'lucide-react';
import { brl, enrollLink, normalizeText, COURSES, PROMOS, type Course } from '../data';
import { useSiteData } from '../lib/siteData';
import CourseIcon from '../components/CourseIcon';

const SITE_NAME = 'S.O.S Cursos';

const SYLLABUS: Record<string, { title: string; items: string[] }[]> = {
  'Excel Básico e Avançado': [
    { title: 'Módulo 1 - Fundamentos', items: ['Interface do Excel', 'Células, linhas e colunas', 'Formatação básica', 'Fórmulas simples (SOMA, MÉDIA)'] },
    { title: 'Módulo 2 - Intermediário', items: ['Funções SE, PROCV, PROCH', 'Validação de dados', 'Tabelas dinâmicas introdutórias', 'Gráficos básicos'] },
    { title: 'Módulo 3 - Avançado', items: ['Macros e VBA básico', 'Power Query', 'Tabelas dinâmicas avançadas', 'Dashboard interativo'] }
  ],
  'Inglês do Zero a Fluência': [
    { title: 'Módulo 1 - Iniciante (A1)', items: ['Alfabeto e pronúncia', 'Verbo to be', 'Artigos e plurais', 'Vocabulário básico (500 palavras)'] },
    { title: 'Módulo 2 - Elementar (A2)', items: ['Present Simple vs Continuous', 'Past Simple', 'Future com will/going to', 'Conversação prática'] },
    { title: 'Módulo 3 - Intermediário (B1)', items: ['Present Perfect', 'Condicionais', 'Phrasal verbs', 'Leitura e compreensão'] },
    { title: 'Módulo 4 - Avançado (B2/C1)', items: ['Discursos complexos', 'Inglês para negócios', 'Preparação para exames', 'Fluência conversacional'] }
  ],
  'Marketing Digital': [
    { title: 'Módulo 1 - Fundamentos', items: ['Conceitos de marketing digital', 'Persona e jornada do cliente', 'Funil de vendas', 'Métricas e KPIs'] },
    { title: 'Módulo 2 - Tráfego Pago', items: ['Google Ads (Search/Display)', 'Meta Ads (Facebook/Instagram)', 'Segmentação de públicos', 'Otimização de campanhas'] },
    { title: 'Módulo 3 - Orgânico & Conteúdo', items: ['SEO on-page e técnico', 'Marketing de conteúdo', 'Email marketing', 'Automação'] }
  ],
  'Programação para Iniciantes': [
    { title: 'Módulo 1 - Lógica', items: ['Variáveis e tipos de dados', 'Estruturas de controle', 'Laços de repetição', 'Funções e modularização'] },
    { title: 'Módulo 2 - JavaScript Básico', items: ['Sintaxe moderna (ES6+)', 'DOM e eventos', 'Fetch API', 'Projeto prático'] },
    { title: 'Módulo 3 - Projeto Final', items: ['Criação de aplicação web', 'Deploy no Vercel/Netlify', 'Boas práticas', 'Próximos passos'] }
  ],
  'Manutenção de Celular': [
    { title: 'Módulo 1 - Hardware', items: ['Ferramentas e EPI', 'Desmontagem segura', 'Componentes internos', 'Diagnóstico de falhas'] },
    { title: 'Módulo 2 - Reparos Comuns', items: ['Troca de tela', 'Conector de carga', 'Botões e flex', 'Microfone/alto-falante'] },
    { title: 'Módulo 3 - Software', items: ['Hard reset e recovery', 'Atualização de firmware', 'Remoção de conta Google/iCloud', 'Backup e restauração'] }
  ]
};

function generateSyllabus(courseName: string): { title: string; items: string[] }[] {
  if (SYLLABUS[courseName]) return SYLLABUS[courseName];
  
  const course = COURSES.find(c => c.name === courseName);
  const category = course?.category || '';
  
  const genericByCategory: Record<string, { title: string; items: string[] }[]> = {
    'Informática & Tecnologia': [
      { title: 'Módulo 1 - Introdução', items: ['Conceitos fundamentais', 'Ambiente de trabalho', 'Ferramentas necessárias', 'Primeiros passos'] },
      { title: 'Módulo 2 - Prática', items: ['Exercícios guiados', 'Projetos práticos', 'Dicas de produtividade', 'Solução de problemas'] },
      { title: 'Módulo 3 - Aperfeiçoamento', items: ['Recursos avançados', 'Integrações', 'Automações', 'Projeto final'] }
    ],
    'Administrativo & Negócios': [
      { title: 'Módulo 1 - Base Teórica', items: ['Conceitos essenciais', 'Legislação aplicável', 'Processos organizacionais', 'Ferramentas de gestão'] },
      { title: 'Módulo 2 - Aplicação Prática', items: ['Casos reais', 'Planilhas e modelos', 'Rotinas administrativas', 'Indicadores de desempenho'] },
      { title: 'Módulo 3 - Especialização', items: ['Tópicos avançados', 'Gestão estratégica', 'Liderança e equipes', 'Projeto integrador'] }
    ],
    'Preparatórios': [
      { title: 'Módulo 1 - Revisão Básica', items: ['Conceitos fundamentais', 'Resolução de exercícios', 'Técnicas de estudo', 'Organização do tempo'] },
      { title: 'Módulo 2 - Tópicos Frequentes', items: ['Questões comentadas', 'Pegadinhas comuns', 'Macetes de prova', 'Simulados parciais'] },
      { title: 'Módulo 3 - Preparação Final', items: ['Simulados completos', 'Revisão direcionada', 'Controle emocional', 'Estratégias de prova'] }
    ],
    'Idiomas': [
      { title: 'Módulo 1 - Fundamentos', items: ['Alfabeto e sons', 'Vocabulário essencial', 'Estruturas básicas', 'Compreensão oral'] },
      { title: 'Módulo 2 - Comunicação', items: ['Conversação do dia a dia', 'Gramática na prática', 'Leitura e escrita', 'Expressões idiomáticas'] },
      { title: 'Módulo 3 - Fluência', items: ['Temas complexos', 'Vocabulário avançado', 'Produção textual', 'Certificação'] }
    ],
    'Diversas Áreas': [
      { title: 'Módulo 1 - Introdução', items: ['Contexto da área', 'Normas e regulamentos', 'Ferramentas de trabalho', 'Segurança'] },
      { title: 'Módulo 2 - Prática Profissional', items: ['Procedimentos padrão', 'Casos práticos', 'Resolução de problemas', 'Qualidade'] },
      { title: 'Módulo 3 - Aperfeiçoamento', items: ['Tendências do mercado', 'Especializações', 'Empreendedorismo', 'Projeto final'] }
    ]
  };

  return genericByCategory[category] || [
    { title: 'Módulo 1 - Fundamentos', items: ['Introdução ao tema', 'Conceitos básicos', 'Metodologia do curso', 'Primeiros exercícios'] },
    { title: 'Módulo 2 - Desenvolvimento', items: ['Aprofundamento teórico', 'Prática supervisionada', 'Estudos de caso', 'Avaliação parcial'] },
    { title: 'Módulo 3 - Conclusão', items: ['Tópicos avançados', 'Projeto integrador', 'Revisão geral', 'Certificação'] }
  ];
}

function getRelatedCourses(course: Course, allCourses: Course[]): Course[] {
  return allCourses
    .filter(c => c.name !== course.name && !c.kids && c.category === course.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

function formatCourseSlug(name: string): string {
  return normalizeText(name).replace(/\s+/g, '-');
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { courses, ready } = useSiteData();
  const [course, setCourse] = useState<Course | null>(null);
  const [related, setRelated] = useState<Course[]>([]);
  const [showSyllabus, setShowSyllabus] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!ready || !slug) return;
    const found = courses.find(c => formatCourseSlug(c.name) === slug);
    if (found) {
      setCourse(found);
      setRelated(getRelatedCourses(found, courses));
    } else {
      navigate('/catalogo', { replace: true });
    }
  }, [slug, courses, ready, navigate]);

  if (!ready || !course) {
    return (
      <div className="course-detail-loading" role="status">
        <div className="spinner" />
        <span>Carregando curso...</span>
      </div>
    );
  }

  const syllabus = generateSyllabus(course.name);
  const promo = PROMOS.find(c => c.name === course.name);
  const hasPromo = Boolean(promo);

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    setEnrolled(true);
    window.open(enrollLink(course.name), '_blank', 'noopener,noreferrer');
    setTimeout(() => setEnrolled(false), 2000);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Confira este curso: ${course.name} - ${SITE_NAME}`;
    if (navigator.share) {
      try { await navigator.share({ title: course.name, text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  return (
    <article className="course-detail">
      <nav className="breadcrumb" aria-label="Navegação">
        <Link to="/" className="breadcrumb-item">Início</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <Link to="/catalogo" className="breadcrumb-item">Catálogo</Link>
        <span className="breadcrumb-sep" aria-hidden="true">/</span>
        <span className="breadcrumb-current" aria-current="page">{course.name}</span>
      </nav>

      <header className="course-detail-header">
        <div className="course-detail-hero">
          <div className="course-detail-badge">
            <span className="category-tag">{course.category}</span>
            {course.kids && <span className="kids-tag">Kids</span>}
          </div>
          <h1>{course.name}</h1>
          <div className="course-detail-meta">
            <div className="meta-item">
              <Clock strokeWidth={2} /> {course.hours}h de conteúdo
            </div>
            <div className="meta-item">
              <Award strokeWidth={2} /> Certificado incluso
            </div>
            <div className="meta-item">
              <Users strokeWidth={2} /> Acesso vitalício
            </div>
          </div>
          <div className="course-detail-price">
            {hasPromo && promo && (
              <>
                <del className="old-price">{brl(promo.from)}</del>
                <span className="price promo-price">{brl(course.price)}</span>
                <span className="discount-badge">-{Math.round((1 - course.price / promo.from) * 100)}%</span>
              </>
            )}
            {!hasPromo && <span className="price">{brl(course.price)}</span>}
          </div>
          <div className="course-detail-actions">
            <button
              className="btn btn-primary btn-lg"
              onClick={handleEnroll}
              disabled={enrolled}
              aria-label={enrolled ? 'Redirecionando para WhatsApp...' : `Matricular-se em ${course.name}`}
            >
              {enrolled ? (
                <>
                  <MessageCircle strokeWidth={2.4} /> Redirecionando...
                </>
              ) : (
                <>
                  <MessageCircle strokeWidth={2.4} /> Matricular-se pelo WhatsApp
                </>
              )}
            </button>
            <button className="btn btn-secondary btn-lg" onClick={handleShare} aria-label="Compartilhar curso">
              <Share2 strokeWidth={2.4} /> Compartilhar
            </button>
          </div>
        </div>
        <div className="course-detail-visual">
          <div className="course-detail-visual-inner">
            <CourseIcon course={course} />
          </div>
        </div>
      </header>

      <div className="course-detail-content">
        <section className="course-detail-section" aria-labelledby="syllabus-heading">
          <div className="section-header">
            <h2 id="syllabus-heading">
              <BookOpen strokeWidth={2} /> Ementa do Curso
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowSyllabus(!showSyllabus)}
              aria-expanded={showSyllabus}
            >
              {showSyllabus ? 'Ocultar' : 'Ver'} ementa
              <Download strokeWidth={2} />
            </button>
          </div>
          {showSyllabus && (
            <div className="syllabus">
              {syllabus.map((module, idx) => (
                <div key={idx} className="syllabus-module">
                  <h3 className="module-title">{module.title}</h3>
                  <ul className="module-items">
                    {module.items.map((item, i) => (
                      <li key={i} className="module-item">
                        <CheckCircle strokeWidth={2} className="check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="course-detail-section" aria-labelledby="benefits-heading">
          <h2 id="benefits-heading">
            <Award strokeWidth={2} /> O que você ganha
          </h2>
          <ul className="benefits-list">
            <li><CheckCircle strokeWidth={2} /> Acesso imediato e vitalício ao conteúdo</li>
            <li><CheckCircle strokeWidth={2} /> Certificado digital válido em todo o Brasil</li>
            <li><CheckCircle strokeWidth={2} /> Estude no seu ritmo, 24h por dia</li>
            <li><CheckCircle strokeWidth={2} /> Suporte especializado via WhatsApp</li>
            <li><CheckCircle strokeWidth={2} /> Atualizações de conteúdo sem custo extra</li>
            <li><CheckCircle strokeWidth={2} /> Garantia de satisfação (7 dias)</li>
          </ul>
        </section>

        {related.length > 0 && (
          <section className="course-detail-section" aria-labelledby="related-heading">
            <h2 id="related-heading">
              <Heart strokeWidth={2} /> Cursos Relacionados
            </h2>
            <div className="related-grid">
              {related.map(relatedCourse => (
                <Link key={relatedCourse.name} to={`/curso/${formatCourseSlug(relatedCourse.name)}`} className="related-card">
                  <div className="related-icon">
                    <CourseIcon course={relatedCourse} />
                  </div>
                  <h3>{relatedCourse.name}</h3>
                  <p className="related-category">{relatedCourse.category}</p>
                  <div className="related-footer">
                    <span className="related-price">{brl(relatedCourse.price)}</span>
                    <span className="related-hours">{relatedCourse.hours}h</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="course-detail-cta">
          <h2>Pronto para começar?</h2>
          <p>Matricule-se agora e tenha acesso imediato ao conteúdo completo.</p>
          <button className="btn btn-primary btn-xl" onClick={handleEnroll} disabled={enrolled}>
            <MessageCircle strokeWidth={2.4} />
            {enrolled ? 'Redirecionando...' : 'Quero me matricular agora'}
          </button>
        </section>
      </div>
    </article>
  );
}