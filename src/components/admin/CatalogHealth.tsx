import { ShieldAlert } from 'lucide-react';
import { COURSES, PROMOS } from '../../data';
import { useSiteData } from '../../lib/siteData';

export default function CatalogHealth() {
  const { courses, promos } = useSiteData();
  const missing = Math.max(0, COURSES.length - courses.length);
  const promosEmpty = promos.length === 0 && PROMOS.length > 0;
  const looksWiped = missing > COURSES.length / 2 || promosEmpty;

  if (!looksWiped) return null;

  return (
    <div className="admin-banner" role="alert">
      <ShieldAlert strokeWidth={2.2} />
      <div>
        <strong>Catálogo incompleto no banco de dados</strong>
        <p>
          Há {courses.length} de {COURSES.length} cursos esperados ({missing} ausentes
          {promosEmpty ? ' e nenhuma promoção cadastrada' : ''}). Se os dados foram perdidos, use a seção{' '}
          <strong>Backup & Recuperação</strong> abaixo para restaurar com um clique.
        </p>
      </div>
    </div>
  );
}