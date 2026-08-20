function getWhatsAppNumber(): string {
  return import.meta.env.VITE_WHATSAPP_NUMBER || '5588996996085';
}

export function wa(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function enrollLink(courseName: string): string {
  return wa(`Olá! Quero me matricular no curso de ${courseName}.`);
}

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export interface Promo {
  id?: string;
  name: string;
  hours: number;
  from: number;
  price: number;
  icon: string;
}

export const PROMOS: Promo[] = [
  { name: 'Excel Básico e Avançado', hours: 26, from: 99.9, price: 79.9, icon: 'promo-icon-excel.webp' },
  { name: 'Manutenção de Celular', hours: 50, from: 119.9, price: 89.9, icon: 'promo-icon-celular.webp' },
  { name: 'Marketing Digital', hours: 20, from: 89.9, price: 69.9, icon: 'promo-icon-megafone.webp' },
  { name: 'Programação para Iniciantes', hours: 20, from: 89.9, price: 69.9, icon: 'promo-icon-codigo.webp' },
  { name: 'Inglês do Zero a Fluência', hours: 100, from: 129.9, price: 99.9, icon: 'promo-icon-chat.webp' },
];

export const PROMO_ICON_OPTIONS = [
  'promo-icon-excel.webp',
  'promo-icon-celular.webp',
  'promo-icon-megafone.webp',
  'promo-icon-codigo.webp',
  'promo-icon-chat.webp',
];

export interface Step {
  n: string;
  title: string;
  text: string;
}

export const STEPS: Step[] = [
  {
    n: '01',
    title: 'Escolha seu curso',
    text: 'Chame a gente no WhatsApp e conte qual curso você procura — a gente indica a melhor opção.',
  },
  {
    n: '02',
    title: 'Estude no seu ritmo',
    text: 'Acesse as aulas online quando quiser, sem horário fixo e sem sair de casa.',
  },
  {
    n: '03',
    title: 'Receba seu certificado',
    text: 'Ao concluir o curso, seu certificado digital fica disponível para download.',
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: 'O certificado é válido em todo o Brasil?',
    a: 'Sim. São cursos livres nos termos da Lei nº 9.394/96, do Decreto nº 5.154/04 e da Deliberação CEE 14/97, válidos em todo o território nacional — mesmo sem regulamentação do MEC.',
  },
  {
    q: 'Como faço a matrícula?',
    a: 'Escolha o curso no catálogo e clique em "Matricular-se". Você fala direto com a nossa equipe no WhatsApp e finaliza a matrícula por lá, sem burocracia.',
  },
  {
    q: 'Tem prazo para concluir o curso?',
    a: 'Você estuda no seu ritmo, pelo celular ou computador, no horário que fizer sentido pra você. Ao concluir a última aula, o certificado fica disponível para download.',
  },
  {
    q: 'Preciso de algum conhecimento prévio?',
    a: 'Não. A maioria dos cursos começa do zero. Se estiver em dúvida sobre qual escolher, chame a equipe no WhatsApp que indicamos a melhor opção pro seu objetivo.',
  },
  {
    q: 'Há cursos para crianças?',
    a: 'Sim, os Cursos KIDS reúnem cursos com atividades lúdicas e seguras para crianças, como Windows 11 Kids, Word Kids e Excel Kids.',
  },
];

export const CATEGORIES = [
  'Todos',
  'Informática & Tecnologia',
  'Administrativo & Negócios',
  'Preparatórios',
  'Diversas Áreas',
  'Idiomas',
];

export const COURSE_ICON_FILES: Record<string, string> = {
  '3D Studio Max Básico': 'course-icon-3dmax.webp',
  'Access 2016': 'course-icon-access.webp',
  'Administração de empresas': 'course-icon-admin.webp',
  'After Effects': 'course-icon-aftereffects.webp',
  'Agente comunitário de saúde': 'course-icon-comunidade.webp',
  'Agente de Portaria': 'course-icon-portaria.webp',
};

export interface Course {
  id?: string;
  name: string;
  category: string;
  hours: number;
  price: number;
  kids?: boolean;
}

export const COURSES: Course[] = [
  { name: '3D Studio Max Básico', category: 'Informática & Tecnologia', hours: 21, price: 79.9 },
  { name: 'Access 2016', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'After Effects', category: 'Informática & Tecnologia', hours: 15, price: 69.9 },
  { name: 'AutoCad 2D e 3D', category: 'Informática & Tecnologia', hours: 50, price: 89.9 },
  { name: 'Bitcoin', category: 'Informática & Tecnologia', hours: 2, price: 49.9 },
  { name: 'Blender 3D', category: 'Informática & Tecnologia', hours: 22, price: 79.9 },
  { name: 'Canva', category: 'Informática & Tecnologia', hours: 30, price: 79.9 },
  { name: 'Como ser um Youtuber', category: 'Informática & Tecnologia', hours: 4, price: 59.9 },
  { name: 'Corel Draw X8', category: 'Informática & Tecnologia', hours: 6, price: 59.9 },
  { name: 'Criação de App Android e iOS', category: 'Informática & Tecnologia', hours: 80, price: 89.9 },
  { name: 'Criação de Game Profissional', category: 'Informática & Tecnologia', hours: 100, price: 99.9 },
  { name: 'Criação de Loja Virtual', category: 'Informática & Tecnologia', hours: 4, price: 59.9 },
  { name: 'Digitação Interativa', category: 'Informática & Tecnologia', hours: 15, price: 69.9 },
  { name: 'Dropshipping', category: 'Informática & Tecnologia', hours: 40, price: 79.9 },
  { name: 'Edição de Vídeo Premiere', category: 'Informática & Tecnologia', hours: 13, price: 69.9 },
  { name: 'Excel Básico e Avançado', category: 'Informática & Tecnologia', hours: 26, price: 79.9 },
  { name: 'Google Adwords', category: 'Informática & Tecnologia', hours: 1, price: 49.9 },
  { name: 'Google Drive', category: 'Informática & Tecnologia', hours: 1, price: 49.9 },
  { name: 'Illustrator 2022', category: 'Informática & Tecnologia', hours: 6, price: 59.9 },
  { name: 'InDesign', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'Introdução a Informática', category: 'Informática & Tecnologia', hours: 10, price: 59.9 },
  { name: 'JavaScript', category: 'Informática & Tecnologia', hours: 30, price: 79.9 },
  { name: 'Linux', category: 'Informática & Tecnologia', hours: 3, price: 49.9 },
  { name: 'Lógica de Programação', category: 'Informática & Tecnologia', hours: 10, price: 59.9 },
  { name: 'Manutenção de Celular', category: 'Informática & Tecnologia', hours: 50, price: 89.9 },
  { name: 'Microsoft Word', category: 'Informática & Tecnologia', hours: 18, price: 69.9 },
  { name: 'Montagem e Manutenção de PC', category: 'Informática & Tecnologia', hours: 19, price: 69.9 },
  { name: 'Operador de Podcast', category: 'Informática & Tecnologia', hours: 10, price: 59.9 },
  { name: 'PhotoShop CC', category: 'Informática & Tecnologia', hours: 22, price: 79.9 },
  { name: 'Power Bi', category: 'Informática & Tecnologia', hours: 30, price: 79.9 },
  { name: 'Power Point', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'WordPress', category: 'Informática & Tecnologia', hours: 120, price: 99.9 },
  { name: 'Segurança na Internet', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'SketchUp', category: 'Informática & Tecnologia', hours: 12, price: 69.9 },
  { name: 'Windows 10', category: 'Informática & Tecnologia', hours: 22, price: 79.9 },
  { name: 'Windows 11', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'Word Kids', category: 'Informática & Tecnologia', hours: 40, price: 35.9, kids: true },
  { name: 'Excel Kids', category: 'Informática & Tecnologia', hours: 60, price: 35.9, kids: true },
  { name: 'Celular para idosos', category: 'Informática & Tecnologia', hours: 20, price: 69.9 },
  { name: 'Robótica', category: 'Informática & Tecnologia', hours: 70, price: 89.9 },
  { name: 'WhatsApp Business', category: 'Informática & Tecnologia', hours: 5, price: 59.9 },
  { name: 'Automação com Alexa', category: 'Informática & Tecnologia', hours: 80, price: 89.9 },
  { name: 'Inteligência artificial', category: 'Informática & Tecnologia', hours: 180, price: 99.9 },
  { name: 'PHP', category: 'Informática & Tecnologia', hours: 180, price: 99.9 },
  { name: 'HTML e CSS', category: 'Informática & Tecnologia', hours: 120, price: 99.9 },
  { name: 'Administração de empresas', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Agente de Portaria', category: 'Administrativo & Negócios', hours: 15, price: 69.9 },
  { name: 'Almoxarifado', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Atendente de Farmácia', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Conhecimentos Bancários', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Contabilidade', category: 'Administrativo & Negócios', hours: 22, price: 79.9 },
  { name: 'Departamento Pessoal', category: 'Administrativo & Negócios', hours: 100, price: 99.9 },
  { name: 'Elaboração de Currículo', category: 'Administrativo & Negócios', hours: 3, price: 49.9 },
  { name: 'Empreendedorismo', category: 'Administrativo & Negócios', hours: 100, price: 99.9 },
  { name: 'Gestão em RH', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Hotelaria e Turismo', category: 'Administrativo & Negócios', hours: 30, price: 79.9 },
  { name: 'Instagram para Vendas', category: 'Administrativo & Negócios', hours: 4, price: 59.9 },
  { name: 'Investimento mercado financeiro', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Logística 4.0', category: 'Administrativo & Negócios', hours: 50, price: 89.9 },
  { name: 'Marketing Digital', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Matemática financeira', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Mídias sociais', category: 'Administrativo & Negócios', hours: 4, price: 59.9 },
  { name: 'Operador de Caixa', category: 'Administrativo & Negócios', hours: 30, price: 79.9 },
  { name: 'Supervisão Pedagógica', category: 'Administrativo & Negócios', hours: 60, price: 89.9 },
  { name: 'Técnicas de Vendas', category: 'Administrativo & Negócios', hours: 20, price: 69.9 },
  { name: 'Telemarketing', category: 'Administrativo & Negócios', hours: 18, price: 69.9 },
  { name: 'Oratória', category: 'Administrativo & Negócios', hours: 30, price: 79.9 },
  { name: 'Jornalismo', category: 'Administrativo & Negócios', hours: 75, price: 89.9 },
  { name: 'Corretor de Imóveis', category: 'Administrativo & Negócios', hours: 60, price: 89.9 },
  { name: 'Estoque e Faturamento', category: 'Administrativo & Negócios', hours: 40, price: 79.9 },
  { name: 'Artes', category: 'Preparatórios', hours: 30, price: 79.9 },
  { name: 'Biologia', category: 'Preparatórios', hours: 40, price: 79.9 },
  { name: 'Educação Física', category: 'Preparatórios', hours: 25, price: 79.9 },
  { name: 'Filosofia', category: 'Preparatórios', hours: 15, price: 69.9 },
  { name: 'Física', category: 'Preparatórios', hours: 45, price: 89.9 },
  { name: 'Geografia', category: 'Preparatórios', hours: 70, price: 89.9 },
  { name: 'História', category: 'Preparatórios', hours: 80, price: 89.9 },
  { name: 'Matemática', category: 'Preparatórios', hours: 110, price: 99.9 },
  { name: 'Matemática para Enem', category: 'Preparatórios', hours: 45, price: 89.9 },
  { name: 'Português', category: 'Preparatórios', hours: 40, price: 79.9 },
  { name: 'Química', category: 'Preparatórios', hours: 55, price: 89.9 },
  { name: 'Sociologia', category: 'Preparatórios', hours: 20, price: 69.9 },
  { name: 'Técnicas de Redação', category: 'Preparatórios', hours: 30, price: 79.9 },
  { name: 'Literatura', category: 'Preparatórios', hours: 35, price: 79.9 },
  { name: 'Atualização em Radiologia', category: 'Diversas Áreas', hours: 40, price: 79.9 },
  { name: 'Auxiliar de Creche', category: 'Diversas Áreas', hours: 20, price: 69.9 },
  { name: 'Auxiliar de Veterinário', category: 'Diversas Áreas', hours: 130, price: 99.9 },
  { name: 'Barbeiro Profissional', category: 'Diversas Áreas', hours: 80, price: 89.9 },
  { name: 'Designer de Cílios & Sobrancelha', category: 'Diversas Áreas', hours: 15, price: 69.9 },
  { name: 'Análises Clínicas', category: 'Diversas Áreas', hours: 60, price: 89.9 },
  { name: 'Energia Solar', category: 'Diversas Áreas', hours: 80, price: 89.9 },
  { name: 'Agente comunitário de saúde', category: 'Diversas Áreas', hours: 80, price: 89.9 },
  { name: 'Teologia Histórica', category: 'Diversas Áreas', hours: 100, price: 99.9 },
  { name: 'Fiscal de Loja', category: 'Diversas Áreas', hours: 10, price: 59.9 },
  { name: 'Frentista', category: 'Diversas Áreas', hours: 40, price: 79.9 },
  { name: 'Manicure e Pedicure', category: 'Diversas Áreas', hours: 50, price: 89.9 },
  { name: 'Maquiagem', category: 'Diversas Áreas', hours: 15, price: 69.9 },
  { name: 'Massagem Modeladora', category: 'Diversas Áreas', hours: 40, price: 79.9 },
  { name: 'Mediador Escolar', category: 'Diversas Áreas', hours: 10, price: 59.9 },
  { name: 'NR-10', category: 'Diversas Áreas', hours: 40, price: 79.9 },
  { name: 'NR-33', category: 'Diversas Áreas', hours: 16, price: 69.9 },
  { name: 'NR-34', category: 'Diversas Áreas', hours: 16, price: 69.9 },
  { name: 'NR-35', category: 'Diversas Áreas', hours: 16, price: 69.9 },
  { name: 'Operador de Empilhadeira', category: 'Diversas Áreas', hours: 30, price: 79.9 },
  { name: 'Pá Carregadeira', category: 'Diversas Áreas', hours: 25, price: 79.9 },
  { name: 'Ponte Rolante', category: 'Diversas Áreas', hours: 80, price: 89.9 },
  { name: 'Retroescavadeira', category: 'Diversas Áreas', hours: 25, price: 79.9 },
  { name: 'Socorrista APH', category: 'Diversas Áreas', hours: 24, price: 79.9 },
  { name: 'Solda MIG/MAG', category: 'Diversas Áreas', hours: 32, price: 79.9 },
  { name: 'Solda TIG', category: 'Diversas Áreas', hours: 30, price: 79.9 },
  { name: 'Eletricista', category: 'Diversas Áreas', hours: 60, price: 89.9 },
  { name: 'TBO - Treinamento Básico Op.', category: 'Diversas Áreas', hours: 35, price: 79.9 },
  { name: 'Inglês do Zero a Fluência', category: 'Idiomas', hours: 100, price: 99.9 },
  { name: 'Interactive English', category: 'Idiomas', hours: 100, price: 99.9 },
  { name: 'Libras', category: 'Idiomas', hours: 50, price: 89.9 },
  { name: 'Espanhol', category: 'Idiomas', hours: 110, price: 99.9 },
  { name: 'Windows 11 Kids', category: 'Informática & Tecnologia', hours: 15, price: 79.9, kids: true },
  { name: 'Digitação Kids', category: 'Informática & Tecnologia', hours: 20, price: 35.9, kids: true },
  { name: 'Power Point Kids', category: 'Informática & Tecnologia', hours: 30, price: 35.9, kids: true },
  { name: 'Informática Básica Kids', category: 'Informática & Tecnologia', hours: 40, price: 39.9, kids: true },
  { name: 'Programação Kids (Scratch)', category: 'Informática & Tecnologia', hours: 30, price: 49.9, kids: true },
];

export const PAGE_SIZE = 6;

export const KIDS_DETAILS: Record<string, [string, string]> = {
  'Word Kids': ['6 a 10 anos', 'Introdução ao Word de forma fácil e divertida.'],
  'Excel Kids': ['8 a 12 anos', 'Aprenda Excel brincando e crie planilhas incríveis.'],
  'Windows 11 Kids': ['7 a 11 anos', 'Descubra o computador e o Windows 11 do zero.'],
  'Digitação Kids': ['7 a 11 anos', 'Digite com rapidez e precisão de um jeito divertido.'],
  'Power Point Kids': ['7 a 12 anos', 'Crie apresentações incríveis e encante a todos.'],
  'Informática Básica Kids': ['8 a 12 anos', 'Noções básicas de informática de forma simples.'],
  'Programação Kids (Scratch)': ['8 a 13 anos', 'Dê os primeiros passos na programação com Scratch.'],
};

export const KIDS_ICON_FILES: Record<string, string> = {
  'Word Kids': 'kids-word.webp',
  'Excel Kids': 'kids-excel.webp',
  'Windows 11 Kids': 'kids-windows.webp',
  'Digitação Kids': 'kids-digitacao.webp',
  'Power Point Kids': 'kids-powerpoint.webp',
  'Informática Básica Kids': 'kids-informatica.webp',
  'Programação Kids (Scratch)': 'kids-programacao.webp',
};

export function initialCatalogList(courses: Course[] = COURSES): Course[] {
  return courses.filter((course) => !course.kids);
}

export function normalizeText(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function formatCourseSlug(name: string): string {
  return normalizeText(name).replace(/\s+/g, '-');
}

const COURSE_DESCRIPTIONS: Record<string, string> = {
  'Excel Básico e Avançado': 'Do básico ao avançado e torne-se um especialista.',
  'Inglês do Zero a Fluência': 'Do zero à fluência para conquistar o mundo.',
  'Marketing Digital': 'Domine as estratégias digitais e aumente suas vendas.',
  'Programação para Iniciantes': 'Aprenda a programar do zero e crie seus projetos.',
  'Manutenção de Celular': 'Repare celulares e abra seu próprio negócio.',
  'Microsoft Word': 'Domine o Word e crie documentos profissionais.',
  'Power Point': 'Crie apresentações incríveis e impactantes.',
  'PhotoShop CC': 'Edição, manipulação e criação de artes incríveis.',
  'Power Bi': 'Transforme dados em informações estratégicas.',
};

export function courseDescription(name: string): string {
  return COURSE_DESCRIPTIONS[name] ?? 'Curso completo com certificado válido em todo o Brasil.';
}

export function getFilteredCourses({
  courses,
  activeCategory,
  search,
  sort,
}: {
  courses: Course[];
  activeCategory: string;
  search: string;
  sort: string;
}): Course[] {
  const base = initialCatalogList(courses);
  const q = normalizeText(search);
  const filtered = base.filter((course) => {
    const categoryMatch = activeCategory === 'Todos' || course.category === activeCategory;
    const textMatch = !q || normalizeText(course.name).includes(q);
    return categoryMatch && textMatch;
  });

  return [...filtered].sort((a, b) => {
    if (sort === 'preco') return a.price - b.price;
    if (sort === 'carga') return b.hours - a.hours;
    return a.name.localeCompare(b.name, 'pt-BR');
  });
}

export function categoryCounts(courses: Course[] = COURSES): Record<string, number> {
  const base = initialCatalogList(courses);
  const counts: Record<string, number> = { Todos: base.length };
  base.forEach((course) => {
    counts[course.category] = (counts[course.category] || 0) + 1;
  });
  return counts;
}

export const INSTAGRAM_URL = 'https://www.instagram.com/cursos.sos';

export const WA_MESSAGE_DEFAULT = 'Olá! Vim pelo site da S.O.S Cursos.';
export const WA_MESSAGE_START = 'Olá! Quero começar um curso na S.O.S Cursos.';
export const WA_MESSAGE_OFFERS = 'Olá! Quero saber mais sobre as ofertas de matrícula da S.O.S Cursos.';
export const WA_MESSAGE_KIDS = 'Olá! Quero saber mais sobre os cursos da S.O.S Kids.';
export const WA_MESSAGE_LOGIN = 'Olá! Quero acessar minha conta de aluno da S.O.S Cursos.';

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'Cursos', href: '/catalogo' },
  { label: 'Planos', href: '/planos' },
  { label: 'Certificados', href: '/#certificado' },
  { label: 'Depoimentos', href: '/#depoimentos' },
  { label: 'Contato', href: '/#contato' },
];

export interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
}

export const NUMBERS: StatItem[] = [
  { value: 10000, suffix: '', prefix: '+', label: 'Alunos matriculados' },
  { value: 250, suffix: '', prefix: '+', label: 'Cursos disponíveis' },
  { value: 8000, suffix: '', prefix: '+', label: 'Certificados emitidos' },
  { value: 98, suffix: '%', label: 'Satisfação dos alunos' },
];

export interface Testimonial {
  name: string;
  course: string;
  initials: string;
  comment: string;
  rating: number;
  avatar?: string;
  date?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Maria Fernanda Silva',
    course: 'Excel Básico e Avançado',
    initials: 'MF',
    comment:
      'O curso de Excel mudou completamente minha vida profissional. Hoje consigo fazer análises incríveis, tabelas dinâmicas e dashboards que impressionam meu chefe. Vale cada centavo!',
    rating: 5,
    date: '2024-11-15',
  },
  {
    name: 'João Pedro Santos',
    course: 'Power Point',
    initials: 'JP',
    comment: 'As aulas são muito didáticas e práticas. Consegui criar apresentações profissionais para minha defesa de TCC e passei com nota máxima. Recomendo demais para todos!',
    rating: 5,
    date: '2024-10-22',
  },
  {
    name: 'Amanda Souza Lima',
    course: 'PhotoShop CC',
    initials: 'AS',
    comment: 'Aprendi do zero e hoje já trabalho com edição de imagens para e-commerce. O suporte no WhatsApp é rápido e tira todas as dúvidas. Cursos top demais!',
    rating: 5,
    date: '2024-09-08',
  },
  {
    name: 'Carlos Eduardo Rocha',
    course: 'Inglês do Zero a Fluência',
    initials: 'CE',
    comment: 'Nunca tinha estudado inglês sério. Em 6 meses já consigo assistir séries sem legenda e me comunicar em viagens. A metodologia é excelente!',
    rating: 5,
    date: '2024-12-01',
  },
  {
    name: 'Patrícia Alves',
    course: 'Marketing Digital',
    initials: 'PA',
    comment: 'Consegui meu primeiro cliente freelancer antes mesmo de terminar o curso. O módulo de tráfego pago é ouro puro. Já recuperei o investimento 10x.',
    rating: 5,
    date: '2024-08-30',
  },
  {
    name: 'Ricardo Mendes',
    course: 'Manutenção de Celular',
    initials: 'RM',
    comment: 'Abri minha própria assistência técnica depois desse curso. O conteúdo de hardware + software é completo. Hoje faturo R$ 8k/mês só com reparos.',
    rating: 5,
    date: '2024-07-18',
  },
];

export interface KidArea {
  title: string;
  text: string;
}

export const KIDS_AREAS: KidArea[] = [
  { title: 'Linguagem de programação', text: 'Primeiros passos na lógica com Scratch e programação visual.' },
  { title: 'Informática Kids', text: 'Windows, Word e Excel com atividades adaptadas para cada idade.' },
  { title: 'Design & Criatividade', text: 'PowerPoint, artes e projetos que soltam a imaginação.' },
  { title: 'Robótica e Tecnologia', text: 'Noções de robótica, automação e curiosidades do mundo tech.' },
];

export const WHY_CHECKLIST = [
  'Cursos atualizados e com qualidade',
  'Acesso 24h por dia, 7 dias por semana',
  'Certificado válido em todo o Brasil',
  'Plataforma segura e fácil de usar',
  'Suporte rápido e humanizado',
];

export const CONTACT = {
  email: 'cursos.sos@outlook.com',
  hours: 'Seg - Sex: 08h às 18h',
};

export const ADMIN_USERNAME = 'admin.azize';
export const ADMIN_EMAIL = 'admin.azize@soscursos.com';
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_SECONDS = 60;

export function isAdminEmail(email: string | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}