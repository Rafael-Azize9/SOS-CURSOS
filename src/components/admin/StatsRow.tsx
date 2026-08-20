import { GraduationCap, Sparkles, Tag, Target } from 'lucide-react';
import { brl } from '../../data';
import { useSiteData } from '../../lib/siteData';

export default function StatsRow() {
  const { courses, promos } = useSiteData();
  const adults = courses.filter((course) => !course.kids);
  const kids = courses.length - adults.length;
  const average = adults.length ? adults.reduce((sum, course) => sum + course.price, 0) / adults.length : 0;

  return (
    <div className="admin-stats">
      <div className="admin-stat">
        <GraduationCap strokeWidth={2.2} />
        <strong>{courses.length}</strong>
        <span>Cursos no catálogo</span>
      </div>
      <div className="admin-stat">
        <Tag strokeWidth={2.2} />
        <strong>{promos.length}</strong>
        <span>Promoções ativas</span>
      </div>
      <div className="admin-stat">
        <Target strokeWidth={2.2} />
        <strong>{brl(average)}</strong>
        <span>Preço médio</span>
      </div>
      <div className="admin-stat">
        <Sparkles strokeWidth={2.2} />
        <strong>{kids}</strong>
        <span>Cursos Kids</span>
      </div>
    </div>
  );
}