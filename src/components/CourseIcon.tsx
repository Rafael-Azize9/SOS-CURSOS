import type { LucideIcon } from 'lucide-react';
import {
  Atom,
  Award,
  Baby,
  Banknote,
  BedDouble,
  Bitcoin,
  BookMarked,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Briefcase,
  Calculator,
  Clapperboard,
  Cloud,
  Code,
  Cpu,
  Database,
  Dumbbell,
  FileText,
  FlaskConical,
  Fuel,
  Gamepad2,
  Globe,
  GraduationCap,
  Hand,
  HardHat,
  Headset,
  Home,
  Keyboard,
  Landmark,
  Languages,
  Leaf,
  Megaphone,
  MessageCircle,
  Mic,
  Microscope,
  Monitor,
  Newspaper,
  Package,
  Palette,
  PawPrint,
  PenLine,
  Pill,
  Presentation,
  Rocket,
  Ruler,
  Scale,
  Scan,
  Scissors,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Speaker,
  Stethoscope,
  Sun,
  Table,
  Target,
  Terminal,
  TrendingUp,
  Truck,
  Users,
  Video,
  Wrench,
  Zap,
} from 'lucide-react';
import { COURSE_ICON_FILES, KIDS_ICON_FILES } from '../data';
import type { Course } from '../data';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Informática & Tecnologia': Monitor,
  'Administrativo & Negócios': Briefcase,
  Preparatórios: BookOpen,
  'Diversas Áreas': Award,
  Idiomas: Languages,
};

const KEYWORD_ICONS: Array<[RegExp, LucideIcon]> = [
  [/word kids|informática básica kids|kids$/i, Monitor],
  [/wordpress/i, Globe],
  [/word$/i, FileText],
  [/indesign/i, FileText],
  [/adwords/i, Megaphone],
  [/excel/i, Table],
  [/access/i, Database],
  [/power ?point/i, Presentation],
  [/power bi/i, Table],
  [/photoshop|illustrator|corel|canva/i, Palette],
  [/after effects|premiere/i, Clapperboard],
  [/youtuber/i, Video],
  [/criação de game/i, Gamepad2],
  [/frentista/i, Fuel],
  [/autocad|sketchup/i, Ruler],
  [/3d studio|blender/i, Boxes],
  [/programação|javascript|php|html|css|lógica/i, Code],
  [/segurança na internet/i, ShieldCheck],
  [/manutenção de celular|celular para idosos|app android|ios/i, Smartphone],
  [/montagem|manutenção de pc/i, Cpu],
  [/podcast|oratória/i, Mic],
  [/bitcoin/i, Bitcoin],
  [/drive/i, Cloud],
  [/linux/i, Terminal],
  [/digitação/i, Keyboard],
  [/windows/i, Monitor],
  [/robótica/i, Bot],
  [/whatsapp/i, MessageCircle],
  [/alexa/i, Speaker],
  [/inteligência artificial/i, Brain],
  [/bancários/i, Landmark],
  [/investimento/i, TrendingUp],
  [/contabilidade|financeira/i, Calculator],
  [/matemática/i, Calculator],
  [/instagram/i, Megaphone],
  [/marketing|mídias sociais/i, Share2],
  [/vendas/i, Target],
  [/curr[ií]culo/i, FileText],
  [/empreendedorismo/i, Rocket],
  [/rh|departamento pessoal|gestão|supervisão pedagógica/i, Users],
  [/logística|empilhadeira|retroescavadeira|pá carregadeira/i, Truck],
  [/fiscal/i, ShieldCheck],
  [/telemaketing|telemarketing|atendente/i, Headset],
  [/jornalismo/i, Newspaper],
  [/corretor de imóveis/i, Home],
  [/loja virtual|dropshipping/i, ShoppingCart],
  [/estoque|almoxarifado/i, Package],
  [/farmácia/i, Pill],
  [/creche/i, Baby],
  [/veterinário/i, PawPrint],
  [/barbeiro/i, Scissors],
  [/cílios|maquiagem/i, Sparkles],
  [/manicure|massagem/i, Hand],
  [/análises clínicas/i, Microscope],
  [/energia solar/i, Sun],
  [/teologia/i, BookMarked],
  [/mediador/i, Scale],
  [/socorrista/i, Stethoscope],
  [/nr-/i, HardHat],
  [/solda|eletricista/i, Zap],
  [/radiologia/i, Scan],
  [/libras/i, Hand],
  [/inglês|espanhol|english/i, Languages],
  [/artes/i, Palette],
  [/educação física/i, Dumbbell],
  [/física/i, Atom],
  [/química/i, FlaskConical],
  [/biologia/i, Leaf],
  [/filosofia|sociologia/i, Brain],
  [/geografia/i, Globe],
  [/história/i, Landmark],
  [/redação/i, PenLine],
  [/português|literatura/i, BookOpen],
  [/hotelaria/i, BedDouble],
  [/operador de caixa/i, Banknote],
  [/tbo/i, HardHat],
  [/ponte rolante/i, Wrench],
];

interface CourseIconProps {
  course: Course;
  kind?: 'course' | 'kids';
}

export default function CourseIcon({ course, kind = 'course' }: CourseIconProps) {
  const files = kind === 'kids' ? KIDS_ICON_FILES : COURSE_ICON_FILES;
  const file = files[course.name];
  if (file) {
    return (
      <img
        className="course-icon"
        src={`/assets/${file}`}
        alt=""
        width="128"
        height="128"
        loading="lazy"
        decoding="async"
      />
    );
  }

  const match = KEYWORD_ICONS.find(([pattern]) => pattern.test(course.name));
  const FallbackIcon = match?.[1] ?? CATEGORY_ICONS[course.category] ?? GraduationCap;
  return <FallbackIcon aria-hidden="true" strokeWidth={2} />;
}